package postgres

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"strings"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/internal/postgres/generated"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/internal/repository"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
	"github.com/jackc/pgx/v5/pgtype"
)

var _ repository.UserRepositort = (*UserRepository)(nil)

type UserRepository struct {
	queries *generated.Queries
	db      *Store
}

func NewUserRepository(db *Store) *UserRepository {
	return &UserRepository{
		queries: generated.New(db.pool),
		db:      db,
	}
}

func (ur *UserRepository) CreateUser(ctx context.Context, user *repository.User, roleIDs []int64, assignedBy int64) (*repository.User, error) {
	err := ur.db.ExecTx(ctx, func(q *generated.Queries) error {
		createParams := generated.CreateUserParams{
			Email:        user.Email,
			FullName:     user.FullName,
			PhoneNumber:  user.PhoneNumber,
			Address:      pgtype.Text{Valid: false},
			PasswordHash: *user.PasswordHash,
			Role:         nil,
			DepartmentID: pgtype.Int8{Valid: false},
			RefreshToken: pgtype.Text{Valid: true, String: ""},
			CreatedBy:    assignedBy,
		}

		if user.DepartmentID != nil {
			if exists, _ := q.DepartmentExists(ctx, *user.DepartmentID); !exists {
				return pkg.Errorf(pkg.NOT_FOUND_ERROR, "department with ID %d not found", *user.DepartmentID)
			}
			createParams.DepartmentID = pgtype.Int8{Int64: *user.DepartmentID, Valid: true}
		}
		if user.Address != nil {
			createParams.Address = pgtype.Text{String: *user.Address, Valid: true}
		}
		if user.RefreshToken != nil {
			createParams.RefreshToken = pgtype.Text{String: *user.RefreshToken, Valid: true}
		}

		roleNames := []string{}
		if len(roleIDs) == 0 {
			roleNames = append(roleNames, "guest")
		} else {
			for _, roleID := range roleIDs {
				role, err := q.GetRole(ctx, roleID)
				if err != nil {
					if errors.Is(err, sql.ErrNoRows) {
						return pkg.Errorf(pkg.AUTHENTICATION_ERROR, "no role with ID %d found", roleID)
					}
					return pkg.Errorf(pkg.INTERNAL_ERROR, "error fetching role by ID: %s", err.Error())
				}

				roleNames = append(roleNames, role.Name)
			}
		}

		createParams.Role = roleNames

		userID, err := q.CreateUser(ctx, createParams)
		if err != nil {
			if pkg.PgxErrorCode(err) == pkg.UNIQUE_VIOLATION {
				return pkg.Errorf(pkg.ALREADY_EXISTS_ERROR, "%s", err.Error())
			}

			return pkg.Errorf(pkg.INTERNAL_ERROR, "error creating user: %s", err.Error())
		}

		// grant role and log action
		if len(roleIDs) == 0 {
			role, err := q.GetRoleByName(ctx, "guest")
			if err != nil {
				if errors.Is(err, sql.ErrNoRows) {
					return pkg.Errorf(pkg.AUTHENTICATION_ERROR, "no role with name guest found")
				}
				return pkg.Errorf(pkg.INTERNAL_ERROR, "error fetching role by ID: %s", err.Error())
			}

			if err := q.GrantRole(ctx, generated.GrantRoleParams{
				UserID:     userID,
				RoleID:     role.ID,
				AssignedBy: assignedBy,
			}); err != nil {
				if pkg.PgxErrorCode(err) == pkg.UNIQUE_VIOLATION {
					return pkg.Errorf(pkg.ALREADY_EXISTS_ERROR, "%s", err.Error())
				}

				return pkg.Errorf(pkg.INTERNAL_ERROR, "error granting user role guest: %s", err.Error())
			}

			if err := q.LogAuditLog(ctx, generated.LogAuditLogParams{
				Action:      "account_creation",
				EntityType:  "user_role",
				EntityID:    userID,
				PerformedBy: assignedBy,
			}); err != nil {
				return pkg.Errorf(pkg.INTERNAL_ERROR, "failed logging action: %s", err.Error())
			}
		} else {
			for _, roleID := range roleIDs {
				if err := q.GrantRole(ctx, generated.GrantRoleParams{
					UserID:     userID,
					RoleID:     roleID,
					AssignedBy: assignedBy,
				}); err != nil {
					if pkg.PgxErrorCode(err) == pkg.UNIQUE_VIOLATION {
						return pkg.Errorf(pkg.ALREADY_EXISTS_ERROR, "%s", err.Error())
					}

					return pkg.Errorf(pkg.INTERNAL_ERROR, "error granting user role guest: %s", err.Error())
				}

				if err := q.LogAuditLog(ctx, generated.LogAuditLogParams{
					Action:      "account_creation",
					EntityType:  "user_role",
					EntityID:    userID,
					PerformedBy: assignedBy,
				}); err != nil {
					return pkg.Errorf(pkg.INTERNAL_ERROR, "failed logging action: %s", err.Error())
				}
			}
		}

		// add group policy
		for _, roleName := range roleNames {
			if _, err := ur.db.casbin.enforcer.AddGroupingPolicy(fmt.Sprintf("user:%d", userID), roleName); err != nil {
				return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to add user role mapping: %s", err.Error())
			}
		}

		if err := ur.db.casbin.enforcer.SavePolicy(); err != nil {
			return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to load policy: %s", err.Error())
		}

		user.ID = userID
		user.PasswordHash = nil
		user.RefreshToken = nil
		user.Active = true
		user.AccountVerified = false
		user.MultifactorAuthentication = true

		return nil
	})
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (ur *UserRepository) GetUserInternal(ctx context.Context, email string) (*repository.User, error) {
	user, err := ur.queries.GetUserInternal(ctx, email)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, pkg.Errorf(pkg.AUTHENTICATION_ERROR, "check login credentials")
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error fetching user by ID: %s", err.Error())
	}

	rslt := &repository.User{
		ID:                        user.ID,
		PasswordHash:              &user.PasswordHash,
		RefreshToken:              &user.RefreshToken,
		Role:                      user.Role,
		MultifactorAuthentication: user.MultifactorAuthentication,
	}

	return rslt, nil
}

func (ur *UserRepository) UpdateUserCredentialsInternal(ctx context.Context, id int64, passwordHash string, refreshToken string) error {
	updateParams := generated.UpdateUserCredentialsInternalParams{
		ID:           id,
		PasswordHash: pgtype.Text{Valid: false},
		RefreshToken: pgtype.Text{Valid: false},
	}

	if passwordHash != "" {
		updateParams.PasswordHash = pgtype.Text{String: passwordHash, Valid: true}
	}
	if refreshToken != "" {
		updateParams.RefreshToken = pgtype.Text{String: refreshToken, Valid: true}
	}

	if err := ur.queries.UpdateUserCredentialsInternal(ctx, updateParams); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return pkg.Errorf(pkg.NOT_FOUND_ERROR, "user with ID %d not found", id)
		}
		return pkg.Errorf(pkg.INTERNAL_ERROR, "error updating user credentials: %s", err.Error())
	}

	return nil
}

func (ur *UserRepository) GetUser(ctx context.Context, id int64) (*repository.User, error) {
	user, err := ur.queries.GetUser(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "user with ID %d not found", id)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error fetching user by ID: %s", err.Error())
	}

	rslt := &repository.User{
		ID:                        user.ID,
		Email:                     user.Email,
		FullName:                  user.FullName,
		PhoneNumber:               user.PhoneNumber,
		Address:                   nil,
		PasswordHash:              nil,
		RefreshToken:              nil,
		Role:                      user.Role,
		DepartmentID:              nil,
		DepartmentName:            nil,
		Active:                    user.Active,
		AccountVerified:           user.AccountVerified,
		MultifactorAuthentication: user.MultifactorAuthentication,
		UpdatedBy:                 nil,
		UpdatedAt:                 user.UpdatedAt,
		CreatedAt:                 user.CreatedAt,
		CreatedBy:                 user.CreatedBy,
	}

	if user.Address.Valid {
		rslt.Address = &user.Address.String
	}
	if user.DepartmentID.Valid {
		rslt.DepartmentID = &user.DepartmentID.Int64
	}
	if user.DepartmentName.Valid {
		rslt.DepartmentName = &user.DepartmentName.String
	}
	if user.UpdatedBy.Valid {
		rslt.UpdatedBy = &user.UpdatedBy.Int64
	}

	return rslt, nil
}

func (ur *UserRepository) UpdateUser(ctx context.Context, user *repository.UpdateUser) (*repository.User, error) {
	updateParams := generated.UpdateUserParams{
		ID:                        user.ID,
		UpdatedBy:                 pgtype.Int8{Valid: true, Int64: user.UpdatedBy},
		FullName:                  pgtype.Text{Valid: false},
		PhoneNumber:               pgtype.Text{Valid: false},
		Address:                   pgtype.Text{Valid: false},
		PasswordHash:              pgtype.Text{Valid: false},
		Role:                      nil,
		DepartmentID:              pgtype.Int8{Valid: false},
		Active:                    pgtype.Bool{Valid: false},
		AccountVerified:           pgtype.Bool{Valid: false},
		MultifactorAuthentication: pgtype.Bool{Valid: false},
		RefreshToken:              pgtype.Text{Valid: false},
	}

	if user.FullName != nil {
		updateParams.FullName = pgtype.Text{String: *user.FullName, Valid: true}
	}
	if user.PhoneNumber != nil {
		updateParams.PhoneNumber = pgtype.Text{String: *user.PhoneNumber, Valid: true}
	}
	if user.Address != nil {
		updateParams.Address = pgtype.Text{String: *user.Address, Valid: true}
	}
	if user.PasswordHash != nil {
		updateParams.PasswordHash = pgtype.Text{String: *user.PasswordHash, Valid: true}
	}
	if user.Role != nil {
		updateParams.Role = *user.Role
	}
	if user.DepartmentID != nil {
		if exists, _ := ur.queries.DepartmentExists(ctx, *user.DepartmentID); !exists {
			return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "department with ID %d not found", *user.DepartmentID)
		}
		updateParams.DepartmentID = pgtype.Int8{Int64: *user.DepartmentID, Valid: true}
	}
	if user.Active != nil {
		updateParams.Active = pgtype.Bool{Bool: *user.Active, Valid: true}
	}
	if user.AccountVerified != nil {
		updateParams.AccountVerified = pgtype.Bool{Bool: *user.AccountVerified, Valid: true}
	}
	if user.MultifactorAuthentication != nil {
		updateParams.MultifactorAuthentication = pgtype.Bool{Bool: *user.MultifactorAuthentication, Valid: true}
	}
	if user.RefreshToken != nil {
		updateParams.RefreshToken = pgtype.Text{String: *user.RefreshToken, Valid: true}
	}

	updatedUser, err := ur.queries.UpdateUser(ctx, updateParams)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "user with ID %d not found", updateParams.ID)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error updating user: %s", err.Error())
	}

	rslt := &repository.User{
		ID:                        updatedUser.ID,
		Email:                     updatedUser.Email,
		FullName:                  updatedUser.FullName,
		PhoneNumber:               updatedUser.PhoneNumber,
		Address:                   nil,
		PasswordHash:              nil,
		RefreshToken:              nil,
		Role:                      updatedUser.Role,
		DepartmentID:              nil,
		DepartmentName:            nil,
		Active:                    updatedUser.Active,
		AccountVerified:           updatedUser.AccountVerified,
		MultifactorAuthentication: updatedUser.MultifactorAuthentication,
		UpdatedBy:                 nil,
		CreatedBy:                 updatedUser.CreatedBy,
		UpdatedAt:                 updatedUser.UpdatedAt,
		CreatedAt:                 updatedUser.CreatedAt,
	}

	if updatedUser.Address.Valid {
		rslt.Address = &updatedUser.Address.String
	}
	if updatedUser.DepartmentID.Valid {
		department, _ := ur.queries.GetDepartment(ctx, updatedUser.DepartmentID.Int64)
		rslt.DepartmentID = &updatedUser.DepartmentID.Int64
		rslt.DepartmentName = &department.Name
	}
	if updatedUser.UpdatedBy.Valid {
		rslt.UpdatedBy = &updatedUser.UpdatedBy.Int64
	}

	return rslt, nil
}

func (ur *UserRepository) UpdateUserRole(ctx context.Context, userID int64, roleIDs []int64, updatedBy int64) error {
	err := ur.db.ExecTx(ctx, func(q *generated.Queries) error {
		// Remove existing roles
		userPreviousRoles, err := q.GetUserRoles(ctx, userID)
		if err != nil {
			if errors.Is(err, sql.ErrNoRows) {
				return pkg.Errorf(pkg.NOT_FOUND_ERROR, "user with ID %d not found", userID)
			}
			return pkg.Errorf(pkg.INTERNAL_ERROR, "error fetching user roles: %s", err.Error())
		}

		log.Println(userPreviousRoles)

		if err := q.RemoveUserRoles(ctx, userID); err != nil {
			return pkg.Errorf(pkg.INTERNAL_ERROR, "error removing user roles: %s", err.Error())
		}

		roleNames := []string{}
		userNewRoles := make([]generated.RbacRole, len(roleIDs))
		for idx, roleID := range roleIDs {
			role, err := q.GetRole(ctx, roleID)
			if err != nil {
				if errors.Is(err, sql.ErrNoRows) {
					return pkg.Errorf(pkg.AUTHENTICATION_ERROR, "no role with ID %d found", roleID)
				}
				return pkg.Errorf(pkg.INTERNAL_ERROR, "error fetching role by ID: %s", err.Error())
			}

			if err := q.GrantRole(ctx, generated.GrantRoleParams{
				UserID:     userID,
				RoleID:     role.ID,
				AssignedBy: updatedBy,
			}); err != nil {
				if pkg.PgxErrorCode(err) == pkg.UNIQUE_VIOLATION {
					return pkg.Errorf(pkg.ALREADY_EXISTS_ERROR, "%s", err.Error())
				}

				return pkg.Errorf(pkg.INTERNAL_ERROR, "error granting user role %s: %s", role.Name, err.Error())
			}

			roleNames = append(roleNames, role.Name)
			userNewRoles[idx] = role
		}

		oldRoles, err := json.Marshal(userPreviousRoles)
		if err != nil {
			return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to marshal old roles: %s", err.Error())
		}
		newRoles, err := json.Marshal(userNewRoles)
		if err != nil {
			return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to marshal new roles: %s", err.Error())
		}

		if err := q.LogAuditLog(ctx, generated.LogAuditLogParams{
			Action:      "role_update",
			EntityType:  "user_role",
			EntityID:    userID,
			PerformedBy: updatedBy,
			OldValues:   oldRoles,
			NewValues:   newRoles,
		}); err != nil {
			return pkg.Errorf(pkg.INTERNAL_ERROR, "failed logging action: %s", err.Error())
		}

		// update user roles
		if _, err = q.UpdateUser(ctx, generated.UpdateUserParams{
			UpdatedBy: pgtype.Int8{Valid: true, Int64: updatedBy},
			ID:        userID,
			Role:      roleNames,
		}); err != nil {
			return pkg.Errorf(pkg.INTERNAL_ERROR, "error updating user roles: %s", err.Error())
		}

		// remove group policy for previous roles
		for _, role := range userPreviousRoles {
			if _, err := ur.db.casbin.enforcer.RemoveGroupingPolicy(fmt.Sprintf("user:%d", userID), role.Name); err != nil {
				return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to remove user role mapping: %s", err.Error())
			}
		}

		// add group policy
		for _, roleName := range roleNames {
			if _, err := ur.db.casbin.enforcer.AddGroupingPolicy(fmt.Sprintf("user:%d", userID), roleName); err != nil {
				return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to add user role mapping: %s", err.Error())
			}
		}

		if err := ur.db.casbin.enforcer.SavePolicy(); err != nil {
			return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to load policy: %s", err.Error())
		}

		return nil
	})
	if err != nil {
		return err
	}

	return nil
}

func (ur *UserRepository) ListUser(ctx context.Context, filter *repository.UserFilter) ([]*repository.User, *pkg.Pagination, error) {
	listParams := generated.ListUsersParams{
		Limit:        int32(filter.Pagination.PageSize),
		Offset:       pkg.Offset(filter.Pagination.Page, filter.Pagination.PageSize),
		Search:       pgtype.Text{Valid: false},
		DepartmentID: pgtype.Int8{Valid: false},
		Active:       pgtype.Bool{Valid: false},
		Role:         nil,
	}
	countParams := generated.CountUsersParams{
		Search:       pgtype.Text{Valid: false},
		DepartmentID: pgtype.Int8{Valid: false},
		Active:       pgtype.Bool{Valid: false},
		Role:         nil,
	}

	if filter.Search != nil {
		search := strings.ToLower(*filter.Search)
		listParams.Search = pgtype.Text{String: "%" + search + "%", Valid: true}
		countParams.Search = pgtype.Text{String: "%" + search + "%", Valid: true}
	}

	if filter.DepartmentID != nil {
		listParams.DepartmentID = pgtype.Int8{Int64: *filter.DepartmentID, Valid: true}
		countParams.DepartmentID = pgtype.Int8{Int64: *filter.DepartmentID, Valid: true}
	}

	if filter.Active != nil {
		listParams.Active = pgtype.Bool{Bool: *filter.Active, Valid: true}
		countParams.Active = pgtype.Bool{Bool: *filter.Active, Valid: true}
	}

	if filter.Role != nil {
		listParams.Role = *filter.Role
		countParams.Role = *filter.Role
	}

	users, err := ur.queries.ListUsers(ctx, listParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error listing users: %s", err.Error())
	}

	count, err := ur.queries.CountUsers(ctx, countParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error counting users: %s", err.Error())
	}

	userList := make([]*repository.User, len(users))
	for i, user := range users {
		userList[i] = &repository.User{
			ID:                        user.ID,
			Email:                     user.Email,
			FullName:                  user.FullName,
			PhoneNumber:               user.PhoneNumber,
			Address:                   nil,
			PasswordHash:              nil,
			RefreshToken:              nil,
			Role:                      user.Role,
			DepartmentID:              nil,
			DepartmentName:            nil,
			Active:                    user.Active,
			AccountVerified:           user.AccountVerified,
			MultifactorAuthentication: user.MultifactorAuthentication,
			UpdatedBy:                 nil,
			CreatedBy:                 user.CreatedBy,
			UpdatedAt:                 user.UpdatedAt,
			CreatedAt:                 user.CreatedAt,
		}

		if user.Address.Valid {
			userList[i].Address = &user.Address.String
		}
		if user.DepartmentID.Valid && user.DepartmentName.Valid {
			userList[i].DepartmentID = &user.DepartmentID.Int64
			userList[i].DepartmentName = &user.DepartmentName.String
		}
		if user.UpdatedBy.Valid {
			userList[i].UpdatedBy = &user.UpdatedBy.Int64
		}
	}

	return userList, pkg.CalculatePagination(uint32(count), filter.Pagination.PageSize, filter.Pagination.Page), nil
}

func (ur *UserRepository) DeleteUser(ctx context.Context, userToDeleteID int64, userID int64) error {
	if err := ur.queries.DeleteUser(ctx, generated.DeleteUserParams{
		DeletedBy: pgtype.Int8{Valid: true, Int64: userID},
		ID:        userToDeleteID,
	}); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return pkg.Errorf(pkg.NOT_FOUND_ERROR, "user with ID %d not found", userToDeleteID)
		}
		return pkg.Errorf(pkg.INTERNAL_ERROR, "error deleting user: %s", err.Error())
	}

	return nil
}
