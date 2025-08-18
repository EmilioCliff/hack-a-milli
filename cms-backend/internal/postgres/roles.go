package postgres

import (
	"github.com/EmilioCliff/hack-a-milli/cms-backend/internal/postgres/generated"
)

// var _ repository.RoleRepository = (*RoleRepository)(nil)

type RoleRepository struct {
	queries *generated.Queries
	db      *Store
}

func NewRoleRepository(db *Store) *RoleRepository {
	return &RoleRepository{
		queries: generated.New(db.pool),
		db:      db,
	}
}

// func (rr *RoleRepository) CreateRole(ctx context.Context, role repository.Role, permissionIDs []int64) (repository.Role, error) {
// }

// func (rr *RoleRepository) UpdateRole(ctx context.Context, role repository.Role, permissionIDs []int64) (repository.Role, error) {
// }

// func (rr *RoleRepository) ListRoles(ctx context.Context, filter pkg.Pagination) ([]repository.Role, *pkg.Pagination, error) {
// }

// func (rr *RoleRepository) ListRolePermissionsByRoleID(ctx context.Context, roleID int64) ([]repository.Permission, error) {
// }

// func (rr *RoleRepository) PrepareDeleteRole(ctx context.Context, id int64) ([]repository.User, error) {
// }

// func (rr *RoleRepository) DeleteRole(ctx context.Context, id int64) error {}

// func (rr *RoleRepository) ListResources() ([]repository.Resource, error) {}

// func (rr *RoleRepository) ListPermissionsByResource(resourceID int64) ([]repository.Permission, error) {
// }

// func (rr *RoleRepository) UpdateUserRoles(ctx context.Context, userID int64, roleIDs []int64) (repository.UserRole, error) {
// }

// func (rr *RoleRepository) LogRoleAudit(ctx context.Context, auditLog repository.RoleAuditLog) (repository.RoleAuditLog, *pkg.Pagination, error) {
// }
