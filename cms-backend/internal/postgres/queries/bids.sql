-- name: CreateBid :exec
INSERT INTO bids (user_id, auction_id, user_identifier, amount)
VALUES ($1, $2, $3, $4);

-- name: GetBidsByAuctionID :many
SELECT * FROM bids
WHERE auction_id = $1
ORDER BY created_at DESC
LIMIT 4; -- get latest 4 bids

-- name: UpdateBid :exec
UPDATE bids
SET amount = $3,
    created_at = now()
WHERE user_id = $1 AND auction_id = $2;

-- name: CheckUserBidExists :one
SELECT EXISTS (SELECT 1 FROM bids
WHERE user_id = $1 AND auction_id = $2);

-- name: GetBidsByAuctionIDFullData :many
SELECT b.*, 
    u.id AS user_id,
    u.full_name AS full_name, 
    u.email AS email
FROM bids b
JOIN users u ON b.user_id = u.id
WHERE b.auction_id = $1
ORDER BY b.created_at DESC
LIMIT $2 OFFSET $3;

-- name: CountBidsByAuctionID :one
SELECT COUNT(*) AS total_bids
FROM bids
WHERE auction_id = $1;