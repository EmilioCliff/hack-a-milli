-- name: CreateUser :one
INSERT INTO users (full_name)
VALUES ($1)
RETURNING *;