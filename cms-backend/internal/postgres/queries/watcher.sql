-- name: CreateWatcher :one
INSERT INTO watchers (user_id, auction_id)
VALUES ($1, $2)
RETURNING *;

-- name: UpdateWatcherStatus :one
UPDATE watchers
SET status = $3
WHERE user_id = $1 AND auction_id = $2
RETURNING *;

-- name: IsUserWatchingAuction :one
SELECT EXISTS (SELECT 1 FROM watchers
WHERE user_id = $1 AND auction_id = $2) AS is_watching;

-- name: GetWatchersByAuctionID :many
SELECT w.*,
    dt.device_token,
    dt.platform
FROM watchers w
LEFT JOIN device_tokens dt ON w.user_id = dt.user_id
WHERE w.auction_id = $1 AND w.status = 'active' AND dt.active = true
ORDER BY w.created_at DESC;

-- name: GetActiveDeviceTokenByActiveAuctionWatchers :many
SELECT dt.device_token
FROM watchers w
JOIN device_tokens dt ON w.user_id = dt.user_id
WHERE w.auction_id = $1 AND w.status = 'active' AND dt.active = true;