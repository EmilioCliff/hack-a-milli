-- name: CreateEventRegistrant :one
INSERT INTO event_registrants (event_id, name, email)
VALUES (sqlc.arg('event_id'), sqlc.arg('name'), sqlc.arg('email'))
RETURNING id;

-- name: ListEventRegistrants :many
SELECT * FROM event_registrants
WHERE event_id = $1
ORDER BY registered_at DESC
LIMIT sqlc.arg('limit') OFFSET sqlc.arg('offset');