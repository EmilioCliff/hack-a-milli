-- name: CreateRegistrar :one
INSERT INTO registrars (email, name, logo_url, address, specialities, phone_number, website_url, updated_by, created_by)
VALUES (sqlc.arg('email'), sqlc.arg('name'), sqlc.arg('logo_url'), sqlc.arg('address'), sqlc.narg('specialities'), sqlc.arg('phone_number'), sqlc.arg('website_url'), sqlc.arg('updated_by'), sqlc.arg('created_by'))
RETURNING id;

-- name: GetRegistrar :one
SELECT * FROM registrars
WHERE id = $1;

-- name: UpdateRegistrar :one
UPDATE registrars
SET email = COALESCE(sqlc.narg('email'), email),
    name = COALESCE(sqlc.narg('name'), name),
    logo_url = COALESCE(sqlc.narg('logo_url'), logo_url),
    address = COALESCE(sqlc.narg('address'), address),
    specialities = COALESCE(sqlc.narg('specialities'), specialities),
    phone_number = COALESCE(sqlc.narg('phone_number'), phone_number),
    website_url = COALESCE(sqlc.narg('website_url'), website_url),
    updated_by = sqlc.arg('updated_by'),
    updated_at = NOW()
WHERE id = sqlc.arg('id')
RETURNING *;

-- name: DeleteRegistrar :exec
UPDATE registrars
SET 
    deleted_at = NOW(), 
    deleted_by = sqlc.arg('deleted_by')
WHERE id = sqlc.arg('id');

-- name: ListRegistrars :many
SELECT * FROM registrars
WHERE 
    deleted_at IS NULL
    AND (
        COALESCE(sqlc.narg('search'), '') = '' 
        OR LOWER(name) LIKE sqlc.narg('search')
        OR LOWER(email) LIKE sqlc.narg('search')
        OR LOWER(address) LIKE sqlc.narg('search')
        OR LOWER(website_url) LIKE sqlc.narg('search')
    )
    AND (
        sqlc.narg('specialities')::text[] IS NULL 
        OR specialities && sqlc.narg('specialities')::text[]
    )
ORDER BY created_at DESC
LIMIT sqlc.arg('limit') OFFSET sqlc.arg('offset');

-- name: CountRegistrars :one
SELECT COUNT(*) AS total_registrars
FROM registrars
WHERE 
    deleted_at IS NULL
    AND (
        COALESCE(sqlc.narg('search'), '') = '' 
        OR LOWER(name) LIKE sqlc.narg('search')
        OR LOWER(email) LIKE sqlc.narg('search')
        OR LOWER(address) LIKE sqlc.narg('search')
        OR LOWER(website_url) LIKE sqlc.narg('search')
    )
    AND (
        sqlc.narg('specialities')::text[] IS NULL 
        OR specialities && sqlc.narg('specialities')::text[]
    );
