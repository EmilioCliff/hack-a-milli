-- name: CreateBlog :one
INSERT INTO blogs (title, author, cover_img, topic, description, content, min_read, updated_by, created_by)
VALUES (sqlc.arg('title'), sqlc.arg('author'), sqlc.arg('cover_img'), sqlc.arg('topic'), sqlc.arg('description'), sqlc.arg('content'), sqlc.arg('min_read'), sqlc.arg('updated_by'), sqlc.arg('created_by'))
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
        'role', u.role,
        'avatar_url', u.avatar_url
    ) AS author_json
    FROM users u
    WHERE u.id = b.author
) p1 ON true
WHERE b.id = $1;

-- name: GetPublishedBlog :one
SELECT b.*,
       COALESCE(p1.author_json, '{}') AS author_details
FROM blogs b
LEFT JOIN LATERAL (
    SELECT json_build_object(
        'id', u.id,
        'email', u.email,
        'full_name', u.full_name,
        'role', u.role,
        'avatar_url', u.avatar_url
    ) AS author_json
    FROM users u
    WHERE u.id = b.author
) p1 ON true
WHERE b.id = $1 AND b.published = TRUE AND b.deleted_at IS NULL;

-- name: UpdateBlog :exec
UPDATE blogs
SET title = COALESCE(sqlc.narg('title'), title),
    cover_img = COALESCE(sqlc.narg('cover_img'), cover_img),
    topic = COALESCE(sqlc.narg('topic'), topic),
    description = COALESCE(sqlc.narg('description'), description),
    content = COALESCE(sqlc.narg('content'), content),
    min_read = COALESCE(sqlc.narg('min_read'), min_read),
    views = COALESCE(sqlc.narg('views'), views),
    updated_by = sqlc.arg('updated_by'),
    updated_at = NOW()
WHERE id = sqlc.arg('id');

-- name: PublishBlog :exec
UPDATE blogs
SET published = TRUE,
    published_at = NOW(),
    updated_by = sqlc.arg('updated_by'),
    updated_at = NOW()
WHERE id = sqlc.arg('id');

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
        'role', u.role,
        'avatar_url', u.avatar_url
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
        COALESCE(sqlc.narg('search')::text, '') = '' 
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
        OR author = sqlc.narg('author')
    ) 
    AND (
        COALESCE(sqlc.narg('search')::text, '') = '' 
        OR LOWER(title) LIKE sqlc.narg('search')
        OR LOWER(topic) LIKE sqlc.narg('search')
    )
    AND (
        sqlc.narg('published')::boolean IS NULL 
        OR published = sqlc.narg('published')
    );