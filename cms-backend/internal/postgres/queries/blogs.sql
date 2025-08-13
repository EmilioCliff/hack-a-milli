-- name: CreateBlog :one
INSERT INTO blogs (title, author, cover_img, topic, description, content, min_read, updated_by, created_by)
VALUES (sqlc.arg('title'), sqlc.arg('author'), sqlc.narg('cover_img'), sqlc.arg('topic'), sqlc.narg('description'), sqlc.narg('content'), sqlc.arg('min_read'), sqlc.arg('updated_by'), sqlc.arg('created_by'))
RETURNING id;

-- name: GetBlog :one
SELECT b.*,
       COALESCE(p1.author_json, '{}') AS author_details
FROM blogs b
LEFT JOIN LATERAL (
    SELECT json_build_object(
        'id', u.id,
        'email', u.email,
        'full_name', u.full_name,
        'role', u.role
    ) AS author_json
    FROM users u
    WHERE u.id = b.author
) p1 ON true
WHERE b.id = $1;

-- name: UpdateBlog :one
UPDATE blogs
SET title = COALESCE(sqlc.arg('title'), title),
    cover_img = COALESCE(sqlc.narg('cover_img'), cover_img),
    topic = COALESCE(sqlc.arg('topic'), topic),
    description = COALESCE(sqlc.narg('description'), description),
    content = COALESCE(sqlc.narg('content'), content),
    min_read = COALESCE(sqlc.arg('min_read'), min_read),
    views = COALESCE(sqlc.arg('views'), views),
    updated_by = sqlc.arg('updated_by'),
    updated_at = NOW()
WHERE id = sqlc.arg('id')
RETURNING *;

-- name: PublishBlog :one
UPDATE blogs
SET published = TRUE,
    published_at = NOW(),
    updated_by = sqlc.arg('updated_by'),
    updated_at = NOW()
WHERE id = sqlc.arg('id')
RETURNING *;

-- name: DeleteBlog :exec
UPDATE blogs
SET deleted_at = NOW(),
    deleted_by = sqlc.arg('deleted_by')
WHERE id = sqlc.arg('id');

-- name: ListBlogs :many
SELECT b.*,
       COALESCE(p1.author_json, '{}') AS author_details
FROM blogs b
LEFT JOIN LATERAL (
    SELECT json_build_object(
        'id', u.id,
        'email', u.email,
        'full_name', u.full_name,
        'role', u.role
    ) AS author_json
    FROM users u
    WHERE u.id = b.author
) p1 ON true
WHERE
    deleted_at IS NULL
    AND (
        sqlc.narg('author')::bigint IS NULL 
        OR b.author = sqlc.narg('author')
    ) 
    AND (
        COALESCE(sqlc.narg('search'), '') = '' 
        OR LOWER(b.title) LIKE sqlc.narg('search')
        OR LOWER(b.topic) LIKE sqlc.narg('search')
    )
    AND (
        sqlc.narg('published')::boolean IS NULL 
        OR b.published = sqlc.narg('published')
    )
ORDER BY b.created_at DESC
LIMIT sqlc.arg('limit') OFFSET sqlc.arg('offset');

-- name: CountBlogs :one
SELECT COUNT(*) AS total_blogs
FROM blogs 
WHERE
    deleted_at IS NULL
    AND (
        sqlc.narg('author')::bigint IS NULL 
        OR b.author = sqlc.narg('author')
    ) 
    AND (
        COALESCE(sqlc.narg('search'), '') = '' 
        OR LOWER(b.title) LIKE sqlc.narg('search')
        OR LOWER(b.topic) LIKE sqlc.narg('search')
    )
    AND (
        sqlc.narg('published')::boolean IS NULL 
        OR b.published = sqlc.narg('published')
    );