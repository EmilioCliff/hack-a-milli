package postgres

import (
	"context"
	"database/sql"
	"errors"
	"strings"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/internal/postgres/generated"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/internal/repository"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
	"github.com/jackc/pgx/v5/pgtype"
)

var _ repository.UserRepositort = (*UserRepository)(nil)

type UserRepository struct {
	queries generated.Queries
}

func NewUserRepository(queries generated.Queries) *UserRepository {
	return &UserRepository{
		queries: queries,
	}
}

func (ur *UserRepository) CreateUser(ctx context.Context, user *repository.User) (*repository.User, error) {
	createParams := generated.CreateUserParams{
		Email:        user.Email,
		FullName:     user.FullName,
		PhoneNumber:  user.PhoneNumber,
		Address:      pgtype.Text{Valid: false},
		PasswordHash: *user.PasswordHash,
		Role:         user.Role,
		DepartmentID: pgtype.Int8{Valid: false},
	}

	if user.DepartmentID != nil {
		if exists, _ := ur.queries.DepartmentExists(ctx, *user.DepartmentID); !exists {
			return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "department with ID %d not found", *user.DepartmentID)
		}
		createParams.DepartmentID = pgtype.Int8{Int64: *user.DepartmentID, Valid: true}
	}
	if user.Address != nil {
		createParams.Address = pgtype.Text{String: *user.Address, Valid: true}
	}

	userID, err := ur.queries.CreateUser(ctx, createParams)
	if err != nil {
		if pkg.PgxErrorCode(err) == pkg.UNIQUE_VIOLATION {
			return nil, pkg.Errorf(pkg.ALREADY_EXISTS_ERROR, "%s", err.Error())
		}

		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error creating user: %s", err.Error())
	}

	user.ID = userID
	user.PasswordHash = nil
	user.RefreshToken = nil
	user.Active = true
	user.AccountVerified = false
	user.MultifactorAuthentication = true

	return user, nil
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
		CreatedBy:                 nil,
		UpdatedAt:                 user.UpdatedAt,
		CreatedAt:                 user.CreatedAt,
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
	if user.CreatedBy.Valid {
		rslt.CreatedBy = &user.CreatedBy.Int64
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
		updateParams.Role = user.Role
	}
	if user.DepartmentID != nil {
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
		CreatedBy:                 nil,
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
	if updatedUser.CreatedBy.Valid {
		rslt.CreatedBy = &updatedUser.CreatedBy.Int64
	}

	return rslt, nil
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

	if len(filter.Role) > 0 {
		listParams.Role = filter.Role
		countParams.Role = filter.Role
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
			CreatedBy:                 nil,
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
		if user.CreatedBy.Valid {
			userList[i].CreatedBy = &user.CreatedBy.Int64
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
