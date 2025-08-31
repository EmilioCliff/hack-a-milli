-- name: CreateAuction :one
INSERT INTO auctions (domain, category, description, current_bid, start_price, start_time, end_time, created_by, updated_by)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
RETURNING *;

-- name: GetAuctionByID :one
SELECT * FROM auctions
WHERE id = $1;

-- name: UpdateAuction :one
UPDATE auctions
SET domain = COALESCE(sqlc.narg('domain'), domain),
    category = COALESCE(sqlc.narg('category'), category),
    description = COALESCE(sqlc.narg('description'), description),
    start_price = COALESCE(sqlc.narg('start_price'), start_price),
    start_time = COALESCE(sqlc.narg('start_time'), start_time),
    end_time = COALESCE(sqlc.narg('end_time'), end_time),
    status = COALESCE(sqlc.narg('status'), status),
    updated_by = sqlc.arg('updated_by'),
    updated_at = now()
WHERE id = sqlc.arg('id')
RETURNING *;

-- name: CheckAuctionDomainExistsAndActive :one
SELECT EXISTS(SELECT 1 FROM auctions WHERE domain = $1 AND status = 'active') AS exists;

-- name: UpdateAuctionStats :one
UPDATE auctions
SET current_bid = COALESCE(sqlc.narg('current_bid'), current_bid),
    watchers = COALESCE(watchers + sqlc.narg('watchers'), watchers),
    bids_count = COALESCE(bids_count + sqlc.narg('bids_count'), bids_count)
WHERE id = sqlc.arg('id')
RETURNING *;

-- name: DeleteAuction :exec
UPDATE auctions
SET status = 'cancelled',
    updated_by = $2,
    updated_at = now()
WHERE id = $1;

-- name: ListAuctions :many
SELECT a.*,
       COALESCE(p1.top_four_bids_json, '[]') AS top_four_bids
FROM auctions a
LEFT JOIN LATERAL (
    SELECT json_agg(json_build_object(
        'id', b.id,
        'user_id', b.user_id,
        'auction_id', b.auction_id,
        'user_identifier', b.user_identifier,
        'amount', b.amount,
        'created_at', b.created_at
    ) ORDER BY b.amount DESC) AS top_four_bids_json
    FROM bids b
    WHERE b.auction_id = a.id
    LIMIT 4
) p1 ON true
WHERE (
        COALESCE(sqlc.narg('search')::text, '') = '' 
        OR LOWER(a.domain) LIKE sqlc.narg('search')
        OR LOWER(a.description) LIKE sqlc.narg('search')
    )
  AND (
        sqlc.narg('category')::text IS NULL 
        OR a.category = sqlc.narg('category')
    )
  AND (
        sqlc.narg('status')::text IS NULL 
        OR a.status = sqlc.narg('status')
    )
ORDER BY a.created_at DESC
LIMIT sqlc.arg('limit') OFFSET sqlc.arg('offset');

-- name: CountAuctions :one
SELECT  COUNT(*) AS total_auctions
FROM auctions
WHERE (
        COALESCE(sqlc.narg('search')::text, '') = '' 
        OR LOWER(domain) LIKE sqlc.narg('search')
        OR LOWER(description) LIKE sqlc.narg('search')
    )
    AND (
        sqlc.narg('category')::text IS NULL 
        OR category = sqlc.narg('category')
    )
    AND (
        sqlc.narg('status')::text IS NULL 
        OR status = sqlc.narg('status')
    );
