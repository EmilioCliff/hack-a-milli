-- name: CreateNewsUpdate :one
INSERT INTO news_updates (title, topic, date, min_read, content, cover_img)
VALUES (sqlc.arg('title'), sqlc.arg('topic'), sqlc.arg('date'), sqlc.arg('min_read'), sqlc.arg('content'), sqlc.arg('cover_img'))
RETURNING id;

-- name: GetNewsUpdate :one
SELECT * FROM news_updates
WHERE id = $1;

-- name: UpdateNewsUpdate :one
UPDATE news_updates
SET title = COALESCE(sqlc.arg('title'), title),
    topic = COALESCE(sqlc.arg('topic'), topic),
    date = COALESCE(sqlc.arg('date'), date),
    min_read = COALESCE(sqlc.arg('min_read'), min_read),
    content = COALESCE(sqlc.arg('content'), content),
    cover_img = COALESCE(sqlc.arg('cover_img'), cover_img),
    updated_by = sqlc.arg('updated_by'),
    updated_at = NOW()
WHERE id = sqlc.arg('id')
RETURNING *;

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

-- name: ListNewsUpdate :many
SELECT * FROM news_updates
WHERE 
    deleted_at IS NULL
    AND (
        COALESCE(sqlc.narg('search'), '') = '' 
        OR LOWER(title) LIKE sqlc.narg('search')
        OR LOWER(topic) LIKE sqlc.narg('search')
    )
    AND (
        sqlc.narg('published')::boolean IS NULL 
        OR published = sqlc.narg('published')
    )
    AND (
        slqc.narg('start_date')::date IS NULL 
        OR date >= sqlc.narg('start_date')
    )
    AND (
        sqlc.narg('end_date')::date IS NULL 
        OR date <= sqlc.narg('end_date')
    )
ORDER BY created_at DESC
LIMIT sqlc.arg('limit') OFFSET sqlc.arg('offset');

-- name: CountNewsUpdate :one
SELECT * FROM news_updates
WHERE 
    deleted_at IS NULL
    AND (
        COALESCE(sqlc.narg('search'), '') = '' 
        OR LOWER(title) LIKE sqlc.narg('search')
        OR LOWER(topic) LIKE sqlc.narg('search')
    )
    AND (
        sqlc.narg('published')::boolean IS NULL 
        OR published = sqlc.narg('published')
    )
    AND (
        slqc.narg('start_date')::date IS NULL 
        OR date >= sqlc.narg('start_date')
    )
    AND (
        sqlc.narg('end_date')::date IS NULL 
        OR date <= sqlc.narg('end_date')
    );