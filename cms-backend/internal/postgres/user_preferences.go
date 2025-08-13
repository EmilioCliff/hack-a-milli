package postgres

import (
	"context"
	"database/sql"
	"errors"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/internal/postgres/generated"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/internal/repository"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
	"github.com/jackc/pgx/v5/pgtype"
)

func (ur *UserRepository) CreateUserPreferences(ctx context.Context, userPreferences *repository.UserPreferences) (*repository.UserPreferences, error) {
	if exists, _ := ur.queries.UserExists(ctx, userPreferences.UserID); !exists {
		return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "user with ID %d not found", userPreferences.UserID)
	}
	userPreferenceID, err := ur.queries.CreateUserPreferences(ctx, generated.CreateUserPreferencesParams{
		UserID:         userPreferences.UserID,
		NotifyNews:     userPreferences.NotifyNews,
		NotifyEvents:   userPreferences.NotifyEvents,
		NotifyTraining: userPreferences.NotifyTraining,
		NotifyPolicy:   userPreferences.NotifyPolicy,
	})
	if err != nil {
		if pkg.PgxErrorCode(err) == pkg.UNIQUE_VIOLATION {
			return nil, pkg.Errorf(pkg.ALREADY_EXISTS_ERROR, "%s", err.Error())
		}

		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error creating user_preference: %s", err.Error())
	}

	userPreferences.CreatedAt = userPreferenceID.CreatedAt
	userPreferences.UpdatedAt = userPreferenceID.UpdatedAt

	return userPreferences, nil
}

func (ur *UserRepository) GetUserPreference(ctx context.Context, userID int64) (*repository.UserPreferences, error) {
	userPreference, err := ur.queries.GetUserPreferences(ctx, userID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "user with ID %d not found", userID)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error fetching user by ID: %s", err.Error())
	}

	return &repository.UserPreferences{
		UserID:         userPreference.UserID,
		NotifyNews:     userPreference.NotifyNews,
		NotifyEvents:   userPreference.NotifyEvents,
		NotifyTraining: userPreference.NotifyTraining,
		NotifyPolicy:   userPreference.NotifyPolicy,
		UpdatedAt:      userPreference.UpdatedAt,
		CreatedAt:      userPreference.CreatedAt,
		User: &repository.User{
			Email:    userPreference.UserEmail,
			FullName: userPreference.UserFullName,
			Role:     userPreference.UserRole,
		},
	}, nil
}

func (ur *UserRepository) ListUserPreferences(ctx context.Context, filter *repository.UserPreferencesFilter) ([]*repository.UserPreferences, *pkg.Pagination, error) {
	listParams := generated.ListUserPreferencesParams{
		Limit:  int32(filter.Pagination.PageSize),
		Offset: pkg.Offset(filter.Pagination.Page, filter.Pagination.PageSize),
	}

	up, err := ur.queries.ListUserPreferences(ctx, listParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error listing user preferences: %s", err.Error())
	}

	count, err := ur.queries.CountUserPreferences(ctx)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error counting user preferences: %s", err.Error())
	}

	userPreferences := make([]*repository.UserPreferences, len(up))
	for i, userPreference := range up {
		userPreferences[i] = &repository.UserPreferences{
			UserID:         userPreference.UserID,
			NotifyNews:     userPreference.NotifyNews,
			NotifyEvents:   userPreference.NotifyEvents,
			NotifyTraining: userPreference.NotifyTraining,
			NotifyPolicy:   userPreference.NotifyPolicy,
			UpdatedAt:      userPreference.UpdatedAt,
			CreatedAt:      userPreference.CreatedAt,
			User: &repository.User{
				Email:    userPreference.UserEmail,
				FullName: userPreference.UserFullName,
				Role:     userPreference.UserRole,
			},
		}
	}

	return userPreferences, pkg.CalculatePagination(uint32(count), filter.Pagination.PageSize, filter.Pagination.Page), nil
}

func (ur *UserRepository) UpdateUserPreference(ctx context.Context, userPreferences *repository.UpdateUserPreferences) (*repository.UserPreferences, error) {
	updateParams := generated.UpdateUserPreferencesParams{
		UserID:         userPreferences.UserID,
		NotifyNews:     pgtype.Bool{Valid: false},
		NotifyEvents:   pgtype.Bool{Valid: false},
		NotifyTraining: pgtype.Bool{Valid: false},
		NotifyPolicy:   pgtype.Bool{Valid: false},
	}

	if userPreferences.NotifyNews != nil {
		updateParams.NotifyNews = pgtype.Bool{Bool: *userPreferences.NotifyNews, Valid: true}
	}
	if userPreferences.NotifyEvents != nil {
		updateParams.NotifyEvents = pgtype.Bool{Bool: *userPreferences.NotifyEvents, Valid: true}
	}
	if userPreferences.NotifyTraining != nil {
		updateParams.NotifyTraining = pgtype.Bool{Bool: *userPreferences.NotifyTraining, Valid: true}
	}
	if userPreferences.NotifyPolicy != nil {
		updateParams.NotifyPolicy = pgtype.Bool{Bool: *userPreferences.NotifyPolicy, Valid: true}
	}

	userPreference, err := ur.queries.UpdateUserPreferences(ctx, updateParams)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "user with ID %d not found", updateParams.UserID)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error updating user: %s", err.Error())
	}

	return &repository.UserPreferences{
		UserID:         userPreference.UserID,
		NotifyNews:     userPreference.NotifyNews,
		NotifyEvents:   userPreference.NotifyEvents,
		NotifyTraining: userPreference.NotifyTraining,
		NotifyPolicy:   userPreference.NotifyPolicy,
		UpdatedAt:      userPreference.UpdatedAt,
		CreatedAt:      userPreference.CreatedAt,
		User:           nil,
	}, nil
}
