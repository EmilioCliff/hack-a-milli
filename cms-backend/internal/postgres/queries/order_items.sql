-- name: CreateOrderItem :exec
INSERT INTO order_items (order_id, product_id, size, color, quantity, amount)
VALUES ($1, $2, $3, $4, $5, $6);