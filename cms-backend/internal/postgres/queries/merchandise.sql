-- name: CreateProduct :one
INSERT INTO products (category_id, name, price, image_url, description, updated_by, created_by)
VALUES (sqlc.arg('category_id'), sqlc.arg('name'), sqlc.arg('price'), sqlc.narg('image_url'), sqlc.narg('description'), sqlc.arg('updated_by'), sqlc.arg('created_by'))
RETURNING id;

-- name: GetProduct :one
SELECT p.*,
       c.name AS category_name
FROM products p
JOIN product_categories c ON p.category_id = c.id
WHERE p.id = $1;

-- name: UpdateProduct :one
UPDATE products
SET category_id = COALESCE(sqlc.narg('category_id'), category_id),
    name = COALESCE(sqlc.narg('name'), name),
    price = COALESCE(sqlc.narg('price'), price),
    image_url = COALESCE(sqlc.narg('image_url'), image_url),
    description = COALESCE(sqlc.narg('description'), description),
    items_sold = COALESCE(sqlc.narg('items_sold'), items_sold),
    updated_by = sqlc.arg('updated_by'),
    updated_at = NOW()
WHERE id = sqlc.arg('id')
RETURNING *;

-- name: ProductExists :one
SELECT EXISTS (SELECT 1 FROM products WHERE id = $1 AND deleted_at IS NULL);

-- name: UpdateProductItemSold :one
UPDATE products
SET items_sold = sqlc.arg('items_sold')
WHERE id = sqlc.arg('id')
RETURNING id;

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
        COALESCE(sqlc.narg('search')::text, '') = '' 
        OR LOWER(p.name) LIKE sqlc.narg('search')
        OR LOWER(c.name) LIKE sqlc.narg('search')
    )
    AND (
        sqlc.narg('category_id')::bigint IS NULL 
        OR p.category_id = sqlc.narg('category_id')
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
        sqlc.narg('category_id')::bigint IS NULL 
        OR p.category_id = sqlc.narg('category_id')
    );