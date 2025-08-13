-- name: CreateNewsUpdate :one
INSERT INTO news_updates (title, topic, date, min_read, content, cover_img, updated_by, created_by)
VALUES (sqlc.arg('title'), sqlc.arg('topic'), sqlc.arg('date'), sqlc.arg('min_read'), sqlc.arg('content'), sqlc.arg('cover_img'), sqlc.arg('updated_by'), sqlc.arg('created_by'))
RETURNING id;

-- name: GetNewsUpdate :one
SELECT * FROM news_updates
WHERE id = $1;

-- name: UpdateNewsUpdate :exec
UPDATE news_updates
SET title = COALESCE(sqlc.narg('title'), title),
    topic = COALESCE(sqlc.narg('topic'), topic),
    date = COALESCE(sqlc.narg('date'), date),
    min_read = COALESCE(sqlc.narg('min_read'), min_read),
    content = COALESCE(sqlc.narg('content'), content),
    cover_img = COALESCE(sqlc.narg('cover_img'), cover_img),
    updated_by = sqlc.arg('updated_by'),
    updated_at = NOW()
WHERE id = sqlc.arg('id');

-- name: DeleteNewsUpdate :exec
UPDATE news_updates
SET deleted_at = NOW(),
    deleted_by = sqlc.arg('deleted_by')
WHERE id = sqlc.arg('id');

-- name: PublishNewsUpdate :one
UPDATE news_updates
SET published = TRUE,
    published_at = NOW(),
    updated_by = sqlc.arg('updated_by'),
    updated_at = NOW()
WHERE id = sqlc.arg('id')
RETURNING *;

-- name: ListNewsUpdates :many
SELECT * FROM news_updates
WHERE 
    deleted_at IS NULL
    AND (
        COALESCE(sqlc.narg('search')::text, '') = '' 
        OR LOWER(title) LIKE sqlc.narg('search')
        OR LOWER(topic) LIKE sqlc.narg('search')
    )
    AND (
        sqlc.narg('published')::boolean IS NULL 
        OR published = sqlc.narg('published')
    )
    AND (
        slqc.narg('start_date')::timestamptz IS NULL 
        OR date >= sqlc.narg('start_date')
    )
    AND (
        sqlc.narg('end_date')::timestamptz IS NULL 
        OR date <= sqlc.narg('end_date')
    )
ORDER BY created_at DESC
LIMIT sqlc.arg('limit') OFFSET sqlc.arg('offset');

-- name: CountNewsUpdates :one
SELECT COUNT(*) FROM news_updates
WHERE 
    deleted_at IS NULL
    AND (
        COALESCE(sqlc.narg('search')::text, '') = '' 
        OR LOWER(title) LIKE sqlc.narg('search')
        OR LOWER(topic) LIKE sqlc.narg('search')
    )
    AND (
        sqlc.narg('published')::boolean IS NULL 
        OR published = sqlc.narg('published')
    )
    AND (
        slqc.narg('start_date')::timestamptz IS NULL 
        OR date >= sqlc.narg('start_date')
    )
    AND (
        sqlc.narg('end_date')::timestamptz IS NULL 
        OR date <= sqlc.narg('end_date')
    );