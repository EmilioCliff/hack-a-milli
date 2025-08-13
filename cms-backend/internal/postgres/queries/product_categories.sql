-- name: CreateProductCategory :one
INSERT INTO product_categories (name, description, updated_by, created_by)
VALUES (sqlc.arg('name'), sqlc.narg('description'), sqlc.arg('updated_by'), sqlc.arg('created_by'))
RETURNING id;

-- name: GetProductCategory :one
SELECT * FROM product_categories
WHERE id = $1;

-- name: UpdateProductCategory :one
UPDATE product_categories
SET name = COALESCE(sqlc.arg('name'), name),
    description = COALESCE(sqlc.narg('description'), description),
    updated_by = sqlc.arg('updated_by'),
    updated_at = NOW()
WHERE id = sqlc.arg('id')
RETURNING *;

-- name: DeleteProductCategory :exec
UPDATE product_categories
SET 
    deleted_at = NOW(), 
    deleted_by = sqlc.arg('deleted_by')
WHERE id = sqlc.arg('id');

-- name: ListProductCategories :many
SELECT * FROM product_categories
WHERE 
    deleted_at IS NULL
    AND (
        COALESCE(sqlc.narg('search'), '') = '' 
        OR LOWER(name) LIKE sqlc.narg('search')
        OR LOWER(description) LIKE sqlc.narg('search')
    )
ORDER BY created_at DESC
LIMIT sqlc.arg('limit') OFFSET sqlc.arg('offset');

-- name: CountProductCategories :one
SELECT COUNT(*) AS total_product_categories
FROM product_categories
WHERE 
    deleted_at IS NULL
    AND (
        COALESCE(sqlc.narg('search'), '') = '' 
        OR LOWER(name) LIKE sqlc.narg('search')
        OR LOWER(description) LIKE sqlc.narg('search')
    );