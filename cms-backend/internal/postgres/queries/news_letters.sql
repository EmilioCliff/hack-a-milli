-- name: CreateNewsLetter :one
INSERT INTO news_letters (title, description, pdf_url, date)
VALUES (sqlc.arg('title'), sqlc.arg('description'), sqlc.arg('pdf_url'), sqlc.arg('date'))
RETURNING id;

-- name: GetNewsLetter :one
SELECT * FROM news_letters
WHERE id = $1;

-- name: UpdateNewsLetter :one
UPDATE news_letters
SET title = COALESCE(sqlc.arg('title'), title),
    description = COALESCE(sqlc.arg('description'), description),
    pdf_url = COALESCE(sqlc.arg('pdf_url'), pdf_url),
    date = COALESCE(sqlc.arg('date'), date),
    updated_by = sqlc.arg('updated_by'),
    updated_at = NOW()
WHERE id = sqlc.arg('id')
RETURNING *;

-- name: DeleteNewsLetter :exec
UPDATE news_letters
SET deleted_at = NOW(),
    deleted_by = sqlc.arg('deleted_by')
WHERE id = sqlc.arg('id');

-- name: ListNewsLetters :many
SELECT * FROM news_letters
WHERE 
    deleted_at IS NULL
    AND (
        COALESCE(sqlc.narg('search'), '') = ''
        OR LOWER(title) LIKE sqlc.narg('search')
        OR LOWER(description) LIKE sqlc.narg('search')
    )
    AND (
        sqlc.narg('published')::boolean IS NULL 
        OR published = sqlc.narg('published')
    )
    AND (
        sqlc.narg('start_date')::date IS NULL 
        OR date >= sqlc.narg('start_date')
    )
    AND (
        sqlc.narg('end_date')::date IS NULL 
        OR date <= sqlc.narg('end_date')
    )
ORDER BY created_at DESC
LIMIT sqlc.arg('limit') OFFSET sqlc.arg('offset');

-- name: CountNewsLetters :one
SELECT * FROM news_letters
WHERE 
    deleted_at IS NULL
    AND (
        COALESCE(sqlc.narg('search'), '') = ''
        OR LOWER(title) LIKE sqlc.narg('search')
        OR LOWER(description) LIKE sqlc.narg('search')
    )
    AND (
        sqlc.narg('published')::boolean IS NULL 
        OR published = sqlc.narg('published')
    )
    AND (
        sqlc.narg('start_date')::date IS NULL 
        OR date >= sqlc.narg('start_date')
    )
    AND (
        sqlc.narg('end_date')::date IS NULL 
        OR date <= sqlc.narg('end_date')
    );