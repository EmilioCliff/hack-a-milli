-- name: CreatePayment :one
INSERT INTO payments (user_id, order_id, amount, payment_method, status, updated_by, created_by)
VALUES (sqlc.narg('user_id'), sqlc.arg('order_id'), sqlc.arg('amount'), sqlc.arg('payment_method'), sqlc.arg('status'), sqlc.narg('updated_by'), sqlc.narg('created_by'))
RETURNING id;

-- name: GetPayment :one
SELECT * FROM payments
WHERE id = $1;

-- name: GetUserPayment :one
SELECT * FROM payments
WHERE id = $1 and user_id = $2;

-- name: UpdatePayment :one
UPDATE payments
SET user_id = COALESCE(sqlc.narg('user_id'), user_id),
    status = COALESCE(sqlc.narg('status'), status),
    updated_by = sqlc.narg('updated_by'),
    updated_at = NOW()
WHERE id = sqlc.arg('id')
RETURNING *;

-- name: ListPayments :many
SELECT 
    p.*,
    o.id AS order_id,
    o.status AS order_status,
    o.payment_status AS order_payment_status,
    u.id AS user_id,
    u.email AS user_email,
    u.full_name AS user_full_name
FROM payments p
JOIN orders o ON p.order_id = o.id
LEFT JOIN users u ON p.user_id = u.id
WHERE
    (
        sqlc.narg('order_id')::bigint IS NULL 
        OR p.order_id = sqlc.narg('order_id')
    )
    AND (
        sqlc.narg('user_id')::bigint IS NULL 
        OR p.user_id = sqlc.narg('user_id')
    )
    AND (
        COALESCE(sqlc.narg('payment_method')::text, '') = '' 
        OR LOWER(p.payment_method) LIKE sqlc.narg('payment_method')
    )
    AND (
        sqlc.narg('status')::boolean IS NULL 
        OR p.status = sqlc.narg('status')
    )
    AND (
        sqlc.narg('start_date')::timestamptz IS NULL 
        OR p.created_at BETWEEN sqlc.narg('start_date') AND sqlc.narg('end_date')::timestamptz
    )
ORDER BY p.created_at DESC
LIMIT sqlc.arg('limit') OFFSET sqlc.arg('offset');

-- name: CountPayments :one
SELECT COUNT(*) AS total_payments
FROM payments
WHERE
    (
        sqlc.narg('order_id')::bigint IS NULL 
        OR order_id = sqlc.narg('order_id')
    )
    AND (
        sqlc.narg('user_id')::bigint IS NULL 
        OR user_id = sqlc.narg('user_id')
    )
    AND (
        COALESCE(sqlc.narg('payment_method')::text, '') = '' 
        OR LOWER(payment_method) LIKE sqlc.narg('payment_method')
    )
    AND (
        sqlc.narg('status')::boolean IS NULL 
        OR status = sqlc.narg('status')
    )
    AND (
        sqlc.narg('start_date')::timestamptz IS NULL 
        OR created_at BETWEEN sqlc.narg('start_date') AND sqlc.narg('end_date')::timestamptz
    );