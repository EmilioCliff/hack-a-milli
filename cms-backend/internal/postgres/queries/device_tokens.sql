-- name: CreateDeviceToken :one
INSERT INTO device_tokens (user_id, device_token, platform)
VALUES ($1, $2, $3)
RETURNING id;

-- name: UserHasActiveDeviceToken :one
SELECT EXISTS (SELECT 1 FROM device_tokens WHERE user_id = $1 AND active IS TRUE);

-- name: GetDeviceTokenByID :one
SELECT dt.*,
       u.email AS user_email,
       u.full_name AS user_full_name,
       u.role AS user_role
FROM device_tokens dt
JOIN users u ON dt.user_id = u.id
WHERE dt.id = $1;

-- name: GetDeviceTokenByUserID :many
SELECT dt.*,
       u.email AS user_email,
       u.full_name AS user_full_name,
       u.role AS user_role
FROM device_tokens dt
JOIN users u ON dt.user_id = u.id
WHERE dt.active IS TRUE AND dt.user_id = $1;

-- name: UpdateDeviceToken :exec
UPDATE device_tokens
SET active = $1
WHERE user_id = $2 AND active IS TRUE;

-- name: ListDeviceTokens :many
SELECT 
    dt.*,
    u.email AS user_email,
    u.full_name AS user_full_name,
    u.role AS user_role
FROM device_tokens dt
JOIN users u ON dt.user_id = u.id
WHERE
    dt.active IS TRUE
    AND (
        sqlc.narg('is_active')::boolean IS NULL 
        OR dt.active = sqlc.narg('is_active')
    )
    AND (
        sqlc.narg('platform')::text IS NULL 
        OR dt.platform = sqlc.narg('platform')
    )
ORDER BY dt.created_at DESC
LIMIT sqlc.arg('limit') OFFSET sqlc.arg('offset'); 

-- name: CountDeviceTokens :one
SELECT COUNT(*) AS total_device_tokens
FROM device_tokens
WHERE
    active IS TRUE
    AND (
        sqlc.narg('is_active')::boolean IS NULL 
        OR active = sqlc.narg('is_active')
    )
    AND (
        sqlc.narg('platform')::text IS NULL 
        OR platform = sqlc.narg('platform')
    );
