-- name: CreateUserPreferences :one
INSERT INTO user_preferences (user_id, notify_policy, notify_news, notify_events, notify_training)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: UserHasPreferences :one
SELECT EXISTS (SELECT 1 FROM user_preferences WHERE user_id = $1);

-- name: GetUserPreferences :one
SELECT up.*,
       u.email AS user_email,
       u.full_name AS user_full_name,
       u.role AS user_role
FROM user_preferences up
JOIN users u ON up.user_id = u.id
WHERE up.user_id = $1;

-- name: UpdateUserPreferences :one
UPDATE user_preferences
SET notify_news = COALESCE(sqlc.narg('notify_news'), notify_news),
    notify_events = COALESCE(sqlc.narg('notify_events'), notify_events),
    notify_training = COALESCE(sqlc.narg('notify_training'), notify_training),
    notify_policy = COALESCE(sqlc.narg('notify_policy'), notify_policy)
WHERE user_id = $1
RETURNING *;

-- name: ListUserPreferences :many
SELECT 
    up.*,
    u.email AS user_email,
    u.full_name AS user_full_name,
    u.role AS user_role
FROM user_preferences up
JOIN users u ON up.user_id = u.id
ORDER BY up.created_at DESC
LIMIT sqlc.arg('limit') OFFSET sqlc.arg('offset'); 

-- name: CountUserPreferences :one
SELECT COUNT(*) AS total_user_preferences
FROM user_preferences; 