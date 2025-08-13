-- name: CreateProduct :one
INSERT INTO products (category_id, name, price, image_url, description)
VALUES (sqlc.arg('category_id'), sqlc.arg('name'), sqlc.arg('price'), sqlc.narg('image_url'), sqlc.narg('description'))
RETURNING id;

-- name: GetProduct :one
SELECT p.*,
       c.name AS category_name
FROM products p
JOIN product_categories c ON p.category_id = c.id
WHERE p.id = $1;

-- name: UpdateProduct :one
UPDATE products
SET category_id = COALESCE(sqlc.arg('category_id'), category_id),
    name = COALESCE(sqlc.arg('name'), name),
    price = COALESCE(sqlc.arg('price'), price),
    image_url = COALESCE(sqlc.narg('image_url'), image_url),
    description = COALESCE(sqlc.narg('description'), description),
    items_sold = COALESCE(sqlc.arg('items_sold'), items_sold),
    updated_by = sqlc.arg('updated_by'),
    updated_at = NOW()
WHERE id = sqlc.arg('id')
RETURNING *;

-- name: DeleteProduct :exec
UPDATE products
SET 
    deleted_at = NOW(), 
    deleted_by = sqlc.arg('deleted_by')
WHERE id = sqlc.arg('id');

-- name: ListProducts :many
SELECT p.*,
       c.name AS category_name
FROM products p
JOIN product_categories c ON p.category_id = c.id
WHERE 
    p.deleted_at IS NULL
    AND (
        COALESCE(sqlc.narg('search'), '') = '' 
        OR LOWER(p.name) LIKE sqlc.narg('search')
        OR LOWER(c.name) LIKE sqlc.narg('search')
    )
    AND (
        sqlc.arg('category_id')::bigint IS NULL 
        OR p.category_id = sqlc.arg('category_id')
    )
ORDER BY p.created_at DESC
LIMIT sqlc.arg('limit') OFFSET sqlc.arg('offset');

-- name: CountProducts :one
SELECT COUNT(*) AS total_products
FROM products p
JOIN product_categories c ON p.category_id = c.id
WHERE 
    p.deleted_at IS NULL
    AND (
        COALESCE(sqlc.narg('search'), '') = '' 
        OR LOWER(p.name) LIKE sqlc.narg('search')
        OR LOWER(c.name) LIKE sqlc.narg('search')
    )
    AND (
        sqlc.arg('category_id')::bigint IS NULL 
        OR p.category_id = sqlc.arg('category_id')
    );