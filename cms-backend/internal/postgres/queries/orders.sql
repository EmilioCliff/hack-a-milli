-- name: CreateOrder :one
INSERT INTO orders (user_id, amount, status, payment_status, order_details)
VALUES (sqlc.narg('user_id'), sqlc.arg('amount'), sqlc.arg('status'), sqlc.arg('payment_status'), sqlc.arg('order_details'))
RETURNING id;

-- name: GetOrder :one
SELECT 
    o.*,
    COALESCE(p1.order_items_json, '[]') as order_items,
    COALESCE(p2.user_json, '{}') as user
FROM orders o
LEFT JOIN LATERAL (
    SELECT json_agg(json_build_object(
        'product_id', oi.product_id,
        'size', oi.size,
        'color', oi.color,
        'quantity', oi.quantity,
        'amount', oi.amount,
        'product', json_build_object(
            'id', p.id,
            'name', p.name,
            'price', p.price,
            'image_url', p.image_url
        )
    )) AS order_items_json
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = o.id
) p1 ON true
LEFT JOIN LATERAL (
    SELECT json_build_object(
        'id', u.id,
        'email', u.email,
        'full_name', u.full_name,
        'role', u.role
    ) AS user_json
    FROM users u
    WHERE u.id = o.user_id
) p2 ON true
WHERE o.id = $1;

-- name: UpdateOrder :one
UPDATE orders
SET user_id = COALESCE(sqlc.narg('user_id'), user_id),
    status = COALESCE(sqlc.narg('status'), status),
    payment_status = COALESCE(sqlc.narg('payment_status'), payment_status),
    updated_by = sqlc.arg('updated_by'),
    updated_at = NOW()
WHERE id = sqlc.arg('id')
RETURNING *;

-- name: ListOrders :many
SELECT * FROM orders
WHERE 
    (
        sqlc.narg('payment_status')::boolean IS NULL 
        OR payment_status = sqlc.narg('payment_status')
    )
    AND (
        sqlc.narg('status')::text IS NULL 
        OR status = sqlc.narg('status')
    )
    AND (
        sqlc.narg('user_id')::bigint IS NULL 
        OR user_id = sqlc.narg('user_id')
    )
ORDER BY created_at DESC
LIMIT sqlc.arg('limit') OFFSET sqlc.arg('offset');

-- name: CountOrders :one
SELECT COUNT(*) AS total_orders
FROM orders
WHERE 
    (
        sqlc.narg('payment_status')::boolean IS NULL 
        OR payment_status = sqlc.narg('payment_status')
    )
    AND (
        sqlc.narg('status')::text IS NULL 
        OR status = sqlc.narg('status')
    )
    AND (
        sqlc.narg('user_id')::bigint IS NULL 
        OR user_id = sqlc.narg('user_id')
    );