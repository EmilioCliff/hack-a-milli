-- name: CreateDepartment :one
INSERT INTO departments (name)
VALUES ($1)
RETURNING id;

-- name: GetDepartment :one
SELECT * FROM departments
WHERE id = $1;

-- name: UpdateDepartment :one
UPDATE departments
SET name = $1
WHERE id = $2
RETURNING *;

-- name: ListDepartments :many
SELECT * FROM departments
LIMIT $1 OFFSET $2;