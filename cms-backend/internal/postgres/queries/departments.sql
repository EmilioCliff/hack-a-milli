-- name: CreateDepartment :one
INSERT INTO departments (name)
VALUES ($1)
RETURNING id;

-- name: DepartmentExists :one
SELECT EXISTS (SELECT 1 FROM departments WHERE id = $1) AS exists;

-- name: GetDepartment :one
SELECT * FROM departments
WHERE id = $1;

-- name: UpdateDepartment :exec
UPDATE departments
SET name = $1
WHERE id = $2;

-- name: ListDepartments :many
SELECT * FROM departments
WHERE
    (
        COALESCE(sqlc.narg('search')::text, '') = ''
        OR LOWER(name) LIKE sqlc.narg('search')
    )
ORDER BY name DESC
LIMIT sqlc.arg('limit') OFFSET sqlc.arg('offset');

-- name: CountDepartments :one
SELECT COUNT(*) FROM departments
WHERE
    (
        COALESCE(sqlc.narg('search')::text, '') = ''
        OR LOWER(name) LIKE sqlc.narg('search')
    );