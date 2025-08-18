-- name: CreateNewsLetter :one
INSERT INTO news_letters (title, description, pdf_url, date, updated_by, created_by)
VALUES (sqlc.arg('title'), sqlc.arg('description'), sqlc.arg('pdf_url'), sqlc.arg('date'), sqlc.arg('updated_by'), sqlc.arg('created_by'))
RETURNING id;

-- name: GetNewsLetter :one
SELECT * FROM news_letters
WHERE id = $1;

-- name: GetPublishedNewsLetter :one
SELECT * FROM news_letters
WHERE id = $1 AND published = TRUE AND deleted_at IS NULL;

-- name: UpdateNewsLetter :exec
UPDATE news_letters
SET title = COALESCE(sqlc.narg('title'), title),
    description = COALESCE(sqlc.narg('description'), description),
    pdf_url = COALESCE(sqlc.narg('pdf_url'), pdf_url),
    date = COALESCE(sqlc.narg('date'), date),
    updated_by = sqlc.arg('updated_by'),
    updated_at = NOW()
WHERE id = sqlc.arg('id');

-- name: DeleteNewsLetter :exec
UPDATE news_letters
SET deleted_at = NOW(),
    deleted_by = sqlc.arg('deleted_by')
WHERE id = sqlc.arg('id');

-- name: PublishNewsLetter :exec
UPDATE news_letters
SET published = TRUE,
    published_at = NOW(),
    updated_by = sqlc.arg('updated_by'),
    updated_at = NOW()
WHERE id = sqlc.arg('id');

-- name: ListNewsLetters :many
SELECT * FROM news_letters
WHERE 
    deleted_at IS NULL
    AND (
        COALESCE(sqlc.narg('search')::text, '') = ''
        OR LOWER(title) LIKE sqlc.narg('search')
        OR LOWER(description) LIKE sqlc.narg('search')
    )
    AND (
        sqlc.narg('published')::boolean IS NULL 
        OR published = sqlc.narg('published')
    )
    AND (
        sqlc.narg('start_date')::timestamptz IS NULL 
        OR date >= sqlc.narg('start_date')
    )
    AND (
        sqlc.narg('end_date')::timestamptz IS NULL 
        OR date <= sqlc.narg('end_date')
    )
ORDER BY created_at DESC
LIMIT sqlc.arg('limit') OFFSET sqlc.arg('offset');

-- name: CountNewsLetters :one
SELECT COUNT(*) FROM news_letters
WHERE 
    deleted_at IS NULL
    AND (
        COALESCE(sqlc.narg('search')::text, '') = ''
        OR LOWER(title) LIKE sqlc.narg('search')
        OR LOWER(description) LIKE sqlc.narg('search')
    )
    AND (
        sqlc.narg('published')::boolean IS NULL 
        OR published = sqlc.narg('published')
    )
    AND (
        sqlc.narg('start_date')::timestamptz IS NULL 
        OR date >= sqlc.narg('start_date')
    )
    AND (
        sqlc.narg('end_date')::timestamptz IS NULL 
        OR date <= sqlc.narg('end_date')
    );