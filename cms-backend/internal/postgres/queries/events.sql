-- name: CreateEvent :one
INSERT INTO events (
    title, topic, content, 
    cover_img, start_time, end_time, 
    status, venue, price, 
    agenda, tags, organizers, 
    partners, speakers, max_attendees, 
    updated_by, created_by
)
VALUES (
    sqlc.arg('title'), sqlc.arg('topic'), sqlc.arg('content'), 
    sqlc.arg('cover_img'), sqlc.arg('start_time'), sqlc.arg('end_time'), 
    sqlc.arg('status'), COALESCE(sqlc.narg('venue'), '{}'::jsonb), COALESCE(sqlc.narg('price'), 'free'), 
    COALESCE(sqlc.narg('agenda'), '{}'::jsonb), COALESCE(sqlc.narg('tags'), '{}'::text[]), COALESCE(sqlc.narg('organizers'), '{}'::jsonb), 
    COALESCE(sqlc.narg('partners'), '{}'::jsonb), COALESCE(sqlc.narg('speakers'), '{}'::jsonb), COALESCE(sqlc.narg('max_attendees'), 500), 
    sqlc.arg('updated_by'), sqlc.arg('created_by')
)
RETURNING id;

-- name: GetEvent :one
SELECT * FROM events
WHERE id = $1;

-- name: GetPublishedEvent :one
SELECT * FROM events
WHERE id = $1 AND published = TRUE AND deleted_at IS NULL;

-- name: CheckEventIsPublishedAndUpcomingOrLive :one
SELECT EXISTS(
    SELECT 1 FROM events
    WHERE id = sqlc.arg('event_id')
    AND published = TRUE
    AND deleted_at IS NULL
    AND status IN ('upcoming', 'live')
) AS is_published_and_upcoming_or_live;


-- name: EventExists :one
SELECT EXISTS(SELECT 1 FROM events WHERE id = $1) AS exists;

-- name: AddEventRegisteredAttedee :exec
UPDATE events
SET registered_attendees = registered_attendees + 1
WHERE id = sqlc.arg('event_id');

-- name: UpdateEvent :exec
UPDATE events
SET title = COALESCE(sqlc.narg('title'), title),
    topic = COALESCE(sqlc.narg('topic'), topic),
    content = COALESCE(sqlc.narg('content'), content),
    cover_img = COALESCE(sqlc.narg('cover_img'), cover_img),
    start_time = COALESCE(sqlc.narg('start_time'), start_time),
    end_time = COALESCE(sqlc.narg('end_time'), end_time),
    status = COALESCE(sqlc.narg('status'), status),
    venue = COALESCE(sqlc.narg('venue'), venue),
    price = COALESCE(sqlc.narg('price'), price),
    agenda = COALESCE(sqlc.narg('agenda'), agenda),
    tags = COALESCE(sqlc.narg('tags'), tags),
    organizers = COALESCE(sqlc.narg('organizers'), organizers),
    partners = COALESCE(sqlc.narg('partners'), partners),
    speakers = COALESCE(sqlc.narg('speakers'), speakers),
    max_attendees = COALESCE(sqlc.narg('max_attendees'), max_attendees),
    registered_attendees = COALESCE(sqlc.narg('registered_attendees'), registered_attendees),
    updated_by = sqlc.arg('updated_by'),
    updated_at = NOW()
WHERE id = sqlc.arg('id');

-- name: PublishEvent :exec
UPDATE events
SET published = TRUE,
    published_at = NOW(),
    updated_by = sqlc.arg('updated_by'),
    updated_at = NOW()
WHERE id = sqlc.arg('id');

-- name: DeleteEvent :exec
UPDATE events
SET deleted_at = NOW(),
    deleted_by = sqlc.arg('deleted_by')
WHERE id = sqlc.arg('id');

-- name: ListEvents :many
SELECT * FROM events
WHERE 
    deleted_at IS NULL
    AND (
        COALESCE(sqlc.narg('search')::text, '') = '' 
        OR LOWER(title) LIKE sqlc.narg('search')
        OR LOWER(topic) LIKE sqlc.narg('search')
    )
    AND (
        sqlc.narg('status')::text IS NULL 
        OR status = sqlc.narg('status')
    )
    AND (
        sqlc.narg('published')::boolean IS NULL 
        OR published = sqlc.narg('published')
    )
    AND (
        sqlc.narg('tags')::text[] IS NULL 
        OR tags && sqlc.narg('tags')::text[]
    )
    AND (
        sqlc.narg('start_time')::timestamptz IS NULL 
        OR start_time >= sqlc.narg('start_time')
    )
    AND (
        sqlc.narg('end_time')::timestamptz IS NULL 
        OR end_time <= sqlc.narg('end_time')
    )
ORDER BY created_at DESC
LIMIT sqlc.arg('limit') OFFSET sqlc.arg('offset');

-- name: CountEvents :one
SELECT COUNT(*) FROM events
WHERE 
    deleted_at IS NULL
    AND (
        COALESCE(sqlc.narg('search')::text, '') = '' 
        OR LOWER(title) LIKE sqlc.narg('search')
        OR LOWER(topic) LIKE sqlc.narg('search')
    )
    AND (
        sqlc.narg('status')::text IS NULL 
        OR status = sqlc.narg('status')
    )
    AND (
        sqlc.narg('published')::boolean IS NULL 
        OR published = sqlc.narg('published')
    )
    AND (
        sqlc.narg('tags')::text[] IS NULL 
        OR tags && sqlc.narg('tags')::text[]
    )
    AND (
        sqlc.narg('start_time')::timestamptz IS NULL 
        OR start_time >= sqlc.narg('start_time')
    )
    AND (
        sqlc.narg('end_time')::timestamptz IS NULL 
        OR end_time <= sqlc.narg('end_time')
    );
