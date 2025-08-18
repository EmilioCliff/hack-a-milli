package repository

import (
	"context"
	"time"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
)

type Resource struct {
	ID          int64     `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type Action struct {
	ID          int64     `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type Role struct {
	ID           int64     `json:"id"`
	Name         string    `json:"name"`
	Description  string    `json:"description"`
	IsSystemRole bool      `json:"is_system_role"`
	IsActive     bool      `json:"is_active"`
	CreatedBy    int64     `json:"created_by"`
	UpdatedBy    int64     `json:"updated_by"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`

	// expanded fields
	Permissions []Permission `json:"permissions,omitempty"`
}

type Permission struct {
	ID          int64     `json:"id"`
	ResourceID  int64     `json:"resource_id"`
	ActionID    int64     `json:"action_id"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`

	// expanded fields
	ResourceData Resource `json:"resource_data,omitempty"`
	ActionData   Action   `json:"action_data,omitempty"`
}

type RolePermission struct {
	RoleID       int64     `json:"role_id"`
	PermissionID int64     `json:"permission_id"`
	GrantedAt    time.Time `json:"granted_at"`
	GrantedBy    int64     `json:"granted_by"`
}

type UserRole struct {
	UserID     int64     `json:"user_id"`
	RoleID     int64     `json:"role_id"`
	AssignedAt time.Time `json:"assigned_at"`
	AssignedBy int64     `json:"assigned_by"`
	ExpiresAt  time.Time `json:"expires_at,omitempty"`

	// expanded fields
	RoleData Role `json:"role_data,omitempty"`
}

type RoleAuditLog struct {
	ID          int64     `json:"id"`
	Action      string    `json:"action"`
	EntityType  string    `json:"entity_type"`
	EntityID    int64     `json:"entity_id"`
	OldValues   any       `json:"old_values,omitempty"`
	NewValues   any       `json:"new_values,omitempty"`
	PerformedBy int64     `json:"performed_by"`
	PerformedAt time.Time `json:"performed_at"`
}

type RoleRepository interface {
	CreateRole(ctx context.Context, role Role, permissionIDs []int64) (Role, error)
	UpdateRole(ctx context.Context, role Role, permissionIDs []int64) (Role, error)
	ListRoles(ctx context.Context, filter pkg.Pagination) ([]Role, *pkg.Pagination, error)
	ListRolePermissionsByRoleID(ctx context.Context, roleID int64) ([]Permission, error)
	PrepareDeleteRole(ctx context.Context, id int64) ([]User, error)
	DeleteRole(ctx context.Context, id int64) error

	ListResources() ([]Resource, error)
	ListPermissionsByResource(resourceID int64) ([]Permission, error)

	UpdateUserRoles(ctx context.Context, userID int64, roleIDs []int64) (UserRole, error)

	LogRoleAudit(ctx context.Context, auditLog RoleAuditLog) (RoleAuditLog, *pkg.Pagination, error)
}
