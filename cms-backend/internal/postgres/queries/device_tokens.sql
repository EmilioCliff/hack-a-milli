-- name: CreateDeviceToken :one
INSERT INTO device_tokens (user_id, device_token, platform)
VALUES ($1, $2, $3)
RETURNING id;

-- name: GetDeviceTokenByID :one
SELECT dt.*,
       u.email AS user_email,
       u.full_name AS user_full_name,
       u.role AS user_role
FROM device_tokens dt
JOIN users u ON dt.user_id = u.id
WHERE dt.active IS TRUE AND dt.id = $1;

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
WHERE user_id = $1 AND active IS TRUE;

-- name: ListDeviceTokens :many
SELECT 
    dt.*,
    COALESCE(p1.user_json, '{}') AS user
FROM device_tokens dt
LEFT JOIN LATERAL (
    SELECT json_build_object(
        'email', u.email,
        'full_name', u.full_name,
        'role', u.role
    ) AS user_json
    FROM users u
    WHERE u.id = dt.user_id
) p1 ON true
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
    dt.active IS TRUE
    AND (
        sqlc.narg('is_active')::boolean IS NULL 
        OR dt.active = sqlc.narg('is_active')
    )
    AND (
        sqlc.narg('platform')::text IS NULL 
        OR dt.platform = sqlc.narg('platform')
    );
