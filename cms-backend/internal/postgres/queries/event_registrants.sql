-- name: CreateEventRegistrant :one
INSERT INTO event_registrants (event_id, name, email)
VALUES (sqlc.arg('event_id'), sqlc.arg('name'), sqlc.arg('email'))
RETURNING id;

-- name: CheckEventRegistrantExists :one
SELECT EXISTS(SELECT 1 FROM event_registrants WHERE event_id = sqlc.arg('event_id') AND email = sqlc.arg('email')) AS exists;

-- name: ListEventRegistrants :many
SELECT * FROM event_registrants
WHERE event_id = sqlc.arg('event_id')
ORDER BY registered_at DESC
LIMIT sqlc.arg('limit') OFFSET sqlc.arg('offset');

-- name: CountEventRegistrants :one
SELECT COUNT(*) 
FROM event_registrants
WHERE event_id = $1;