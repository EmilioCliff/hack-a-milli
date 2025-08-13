-- name: CreateEvent :one
INSERT INTO events (title, topic, content, cover_img, start_time, end_time, status, venue, price, agenda, tags, organizers, partners, speakers, max_attendees)
VALUES (sqlc.arg('title'), sqlc.arg('topic'), sqlc.arg('content'), sqlc.arg('cover_img'), sqlc.arg('start_time'), sqlc.arg('end_time'), sqlc.arg('status'), sqlc.narg('venue'), sqlc.narg('price'), sqlc.narg('agenda'), sqlc.narg('tags'), sqlc.narg('organizers'), sqlc.narg('partners'), sqlc.narg('speakers'), sqlc.narg('max_attendees'))
RETURNING id;

-- name: GetEvent :one
SELECT * FROM events
WHERE id = $1;

-- name: UpdateEvent :one
UPDATE events
SET title = COALESCE(sqlc.arg('title'), title),
    topic = COALESCE(sqlc.arg('topic'), topic),
    content = COALESCE(sqlc.arg('content'), content),
    cover_img = COALESCE(sqlc.arg('cover_img'), cover_img),
    start_time = COALESCE(sqlc.arg('start_time'), start_time),
    end_time = COALESCE(sqlc.arg('end_time'), end_time),
    status = COALESCE(sqlc.arg('status'), status),
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
WHERE id = sqlc.arg('id')
RETURNING *;

-- name: PublishEvent :one
UPDATE events
SET published = TRUE,
    published_at = NOW(),
    updated_by = sqlc.arg('updated_by'),
    updated_at = NOW()
WHERE id = sqlc.arg('id')
RETURNING *;

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
        COALESCE(sqlc.narg('search'), '') = '' 
        OR LOWER(title) LIKE sqlc.narg('search')
        OR LOWER(topic) LIKE sqlc.narg('search')
    )
    AND (
        sqlc.narg('status')::text IS NULL 
        OR status = sqlc.narg('status')
    )
    AND (
        sqlc.narg('published')::boolean IS NULL 
        OR b.published = sqlc.narg('published')
    )
    AND (
        sqlc.narg('tags')::text[] IS NULL 
        OR tags = ANY(sqlc.narg('tags')::text[])
    )
    AND (
        sqlc.narg('start_time')::timestamp IS NULL 
        OR start_time >= sqlc.narg('start_time')
    )
    AND (
        sqlc.narg('end_time')::timestamp IS NULL 
        OR end_time <= sqlc.narg('end_time')
    )
ORDER BY created_at DESC
LIMIT sqlc.arg('limit') OFFSET sqlc.arg('offset');

-- name: CountEvents :one
SELECT * FROM events
WHERE 
    deleted_at IS NULL
    AND (
        COALESCE(sqlc.narg('search'), '') = '' 
        OR LOWER(title) LIKE sqlc.narg('search')
        OR LOWER(topic) LIKE sqlc.narg('search')
    )
    AND (
        sqlc.narg('status')::text IS NULL 
        OR status = sqlc.narg('status')
    )
    AND (
        sqlc.narg('published')::boolean IS NULL 
        OR b.published = sqlc.narg('published')
    )
    AND (
        sqlc.narg('tags')::text[] IS NULL 
        OR tags = ANY(sqlc.narg('tags')::text[])
    )
    AND (
        sqlc.narg('start_time')::timestamp IS NULL 
        OR start_time >= sqlc.narg('start_time')
    )
    AND (
        sqlc.narg('end_time')::timestamp IS NULL 
        OR end_time <= sqlc.narg('end_time')
    );
