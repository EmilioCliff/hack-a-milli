-- name: CreateUser :one
INSERT INTO users (email, full_name, phone_number, address, password_hash, role, department_id, refresh_token)
VALUES (sqlc.arg('email'), sqlc.arg('full_name'), sqlc.arg('phone_number'), sqlc.narg('address'), sqlc.arg('password_hash'), sqlc.arg('role'), sqlc.narg('department_id'), sqlc.narg('refresh_token'))
RETURNING id;

-- name: GetUser :one
SELECT 
    u.*,
    d.name AS department_name
FROM users u
LEFT JOIN departments d ON u.department_id = d.id
WHERE u.id = sqlc.arg('id');

-- name: UserExists :one
SELECT EXISTS (SELECT 1 FROM users WHERE id = sqlc.arg('id')) AS exists;

-- name: GetUserInternal :one
SELECT id, password_hash, refresh_token, role, multifactor_authentication
FROM users
WHERE email = sqlc.arg('email');

-- name: UpdateUserCredentialsInternal :exec
UPDATE users
SET
    password_hash = sqlc.narg('password_hash'),
    refresh_token = sqlc.narg('refresh_token')
WHERE id = sqlc.arg('id');

-- name: UpdateUser :one
UPDATE users
SET
    full_name = COALESCE(sqlc.narg('full_name'), full_name),
    phone_number = COALESCE(sqlc.narg('phone_number'), phone_number),
    address = COALESCE(sqlc.narg('address'), address),
    password_hash = COALESCE(sqlc.narg('password_hash'), password_hash),
    role = COALESCE(sqlc.narg('role'), role),
    department_id = COALESCE(sqlc.narg('department_id'), department_id),
    active = COALESCE(sqlc.narg('active'), active),
    account_verified = COALESCE(sqlc.narg('account_verified'), account_verified),
    multifactor_authentication = COALESCE(sqlc.narg('multifactor_authentication'), multifactor_authentication),
    refresh_token = COALESCE(sqlc.narg('refresh_token'), refresh_token),
    updated_by = sqlc.arg('updated_by'),
    updated_at = NOW()
WHERE id = sqlc.arg('id')
RETURNING *;

-- name: DeleteUser :exec
UPDATE users
SET active = FALSE, 
    updated_by = sqlc.arg('deleted_by'), 
    updated_at = NOW()
WHERE id = sqlc.arg('id');

-- name: ListUsers :many
SELECT 
    u.*,
    d.name AS department_name
FROM users u
LEFT JOIN departments d ON u.department_id = d.id
WHERE
    (
        sqlc.narg('search')::text IS NULL 
        OR LOWER(u.email) LIKE sqlc.narg('search')
        OR LOWER(u.full_name) LIKE sqlc.narg('search')
        OR LOWER(u.phone_number) LIKE sqlc.narg('search')
    )
    AND (
        sqlc.narg('role')::text[] IS NULL 
        OR u.role = ANY(sqlc.narg('role')::text[])
    )
    AND (
        sqlc.narg('department_id')::bigint IS NULL 
        OR u.department_id = sqlc.narg('department_id')
    )
    AND (
        sqlc.narg('active')::boolean IS NULL 
        OR u.active = sqlc.narg('active')
    )
ORDER BY u.created_at DESC
LIMIT sqlc.arg('limit') OFFSET sqlc.arg('offset');

-- name: CountUsers :one
SELECT COUNT(*) AS total_users
FROM users
WHERE
    (
        sqlc.narg('search')::text IS NULL 
        OR LOWER(email) LIKE sqlc.narg('search')
        OR LOWER(full_name) LIKE sqlc.narg('search')
        OR LOWER(phone_number) LIKE sqlc.narg('search')
    )
    AND (
        sqlc.narg('role')::text[] IS NULL 
        OR role = ANY(sqlc.narg('role')::text[])
    )
    AND (
        sqlc.narg('department_id')::bigint IS NULL 
        OR department_id = sqlc.narg('department_id')
    )
    AND (
        sqlc.narg('active')::boolean IS NULL 
        OR active = sqlc.narg('active')
    );