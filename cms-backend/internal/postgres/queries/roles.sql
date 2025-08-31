-- name: GetRole :one
SELECT * FROM rbac_roles 
WHERE id = $1;

-- name: GetRoleByName :one
SELECT * FROM rbac_roles
WHERE name = $1;

-- name: GrantRole :exec
INSERT INTO rbac_user_roles (user_id, role_id, assigned_by, expires_at)
VALUES (sqlc.arg('user_id'), sqlc.arg('role_id'), sqlc.arg('assigned_by'), sqlc.narg('expires_at'));

-- name: RemoveUserRoles :exec
DELETE FROM rbac_user_roles
WHERE user_id = sqlc.arg('user_id');

-- name: GetUserRoles :many
SELECT r.*
FROM rbac_user_roles ur
JOIN rbac_roles r ON ur.role_id = r.id
WHERE ur.user_id = sqlc.arg('user_id');

-- name: LogAuditLog :exec
INSERT INTO rbac_audit_log (action, entity_type, entity_id, old_values, new_values, performed_by)
VALUES (sqlc.arg('action'), sqlc.arg('entity_type'), sqlc.arg('entity_id'), sqlc.narg('old_values'), sqlc.narg('new_values'), sqlc.arg('performed_by'));
