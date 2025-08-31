-- name: CreateUserChat :one
 INSERT INTO user_chats (title, user_id, messages)
 VALUES ($1, $2, $3)
 RETURNING *;

-- name: GetChatByID :one
SELECT * FROM user_chats
WHERE id = $1;

-- name: AddMessageToChat :exec
UPDATE user_chats
SET messages = $2
WHERE id = $1;

-- name: GetUserChats :many
SELECT * FROM user_chats
WHERE user_id = $1 AND deleted_at IS NULL
ORDER BY created_at DESC
LIMIT $2 OFFSET $3;

-- name: CountUserChats :one
SELECT COUNT(*) FROM user_chats
WHERE user_id = $1 AND deleted_at IS NULL;

-- name: DeleteChat :exec
UPDATE user_chats
SET deleted_at = now()
WHERE id = $1;

-- name: CreateCompanyDoc :one
INSERT INTO company_docs (title, content)
VALUES ($1, $2)
RETURNING *;

-- name: GetCompanyDocs :many
SELECT * FROM company_docs
WHERE deleted_at IS NULL
ORDER BY created_at DESC;

-- name: GetCompanyDocByID :one
SELECT * FROM company_docs
WHERE id = $1;

-- name: UpdateCompanyDoc :one
UPDATE company_docs
SET title = COALESCE(sqlc.narg('title'), title), 
    content = COALESCE(sqlc.narg('content'), content)
WHERE id = sqlc.arg('id')
RETURNING *;

-- name: DeleteCompanyDoc :exec
UPDATE company_docs
SET deleted_at = now()
WHERE id = $1;