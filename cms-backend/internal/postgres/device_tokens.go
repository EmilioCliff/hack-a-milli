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

func (ur *UserRepository) CreateDeviceToken(ctx context.Context, deviceToken *repository.DeviceToken) (*repository.DeviceToken, error) {
	deviceTokenID, err := ur.queries.CreateDeviceToken(ctx, generated.CreateDeviceTokenParams{
		UserID:      deviceToken.UserID,
		DeviceToken: deviceToken.DeviceToken,
		Platform:    deviceToken.Platform,
	})
	if err != nil {
		if pkg.PgxErrorCode(err) == pkg.UNIQUE_VIOLATION {
			return nil, pkg.Errorf(pkg.ALREADY_EXISTS_ERROR, "device token for user %d already exists", deviceToken.UserID)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error creating device token: %s", err.Error())
	}

	deviceToken.ID = deviceTokenID

	return deviceToken, nil
}

func (ur *UserRepository) GetDeviceTokenByID(ctx context.Context, id int64) (*repository.DeviceToken, error) {
	deviceToken, err := ur.queries.GetDeviceTokenByID(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "device token with ID %d not found", id)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error retrieving device token: %s", err.Error())
	}

	return &repository.DeviceToken{
		ID:          deviceToken.ID,
		UserID:      deviceToken.UserID,
		DeviceToken: deviceToken.DeviceToken,
		Platform:    deviceToken.Platform,
		Active:      deviceToken.Active,
		CreatedAt:   deviceToken.CreatedAt,
		User: &repository.User{
			Email:    deviceToken.UserEmail,
			FullName: deviceToken.UserFullName,
			Role:     deviceToken.UserRole,
		},
	}, nil
}

func (ur *UserRepository) GetDeviceTokenByUserID(ctx context.Context, id int64) (*repository.DeviceToken, error) {
	deviceTokens, err := ur.queries.GetDeviceTokenByUserID(ctx, id)
	if err != nil {
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error retrieving device token: %s", err.Error())
	}

	if len(deviceTokens) == 0 {
		return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "device token for user with ID %d not found", id)
	}

	rslt := &repository.DeviceToken{
		ID:          deviceTokens[0].ID,
		UserID:      deviceTokens[0].UserID,
		DeviceToken: deviceTokens[0].DeviceToken,
		Platform:    deviceTokens[0].Platform,
		Active:      deviceTokens[0].Active,
		CreatedAt:   deviceTokens[0].CreatedAt,
		User: &repository.User{
			Email:    deviceTokens[0].UserEmail,
			FullName: deviceTokens[0].UserFullName,
			Role:     deviceTokens[0].UserRole,
		},
	}

	return rslt, nil
}

func (ur *UserRepository) ListDeviceToken(ctx context.Context, filter *repository.DeviceTokenFilter) ([]*repository.DeviceToken, *pkg.Pagination, error) {
	listParams := generated.ListDeviceTokensParams{
		Limit:    int32(filter.Pagination.PageSize),
		Offset:   pkg.Offset(filter.Pagination.Page, filter.Pagination.PageSize),
		Platform: pgtype.Text{Valid: false},
		IsActive: pgtype.Bool{Valid: false},
	}

	countParams := generated.CountDeviceTokensParams{
		Platform: pgtype.Text{Valid: false},
		IsActive: pgtype.Bool{Valid: false},
	}

	if filter.Platform != nil {
		listParams.Platform = pgtype.Text{String: *filter.Platform, Valid: true}
		countParams.Platform = pgtype.Text{String: *filter.Platform, Valid: true}
	}
	if filter.Active != nil {
		listParams.IsActive = pgtype.Bool{Bool: *filter.Active, Valid: true}
		countParams.IsActive = pgtype.Bool{Bool: *filter.Active, Valid: true}
	}

	deviceTokens, err := ur.queries.ListDeviceTokens(ctx, listParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error listing device tokens: %s", err.Error())
	}
	count, err := ur.queries.CountDeviceTokens(ctx, countParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error counting device tokens: %s", err.Error())
	}

	rslt := make([]*repository.DeviceToken, len(deviceTokens))
	for i, token := range deviceTokens {
		rslt[i] = &repository.DeviceToken{
			ID:          token.ID,
			UserID:      token.UserID,
			DeviceToken: token.DeviceToken,
			Platform:    token.Platform,
			Active:      token.Active,
			CreatedAt:   token.CreatedAt,
			User: &repository.User{
				Email:    token.UserEmail,
				FullName: token.UserFullName,
				Role:     token.UserRole,
			},
		}
	}

	return rslt, pkg.CalculatePagination(uint32(count), filter.Pagination.PageSize, filter.Pagination.Page), nil
}

func (ur *UserRepository) UpdateDeviceToken(ctx context.Context, active bool, userID int64) error {
	if err := ur.queries.UpdateDeviceToken(ctx, generated.UpdateDeviceTokenParams{
		UserID: userID,
		Active: active,
	}); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return pkg.Errorf(pkg.NOT_FOUND_ERROR, "device token for user with ID %d not found", userID)
		}
		return pkg.Errorf(pkg.INTERNAL_ERROR, "error updating device token for user with ID %d: %s", userID, err.Error())
	}
	return nil
}
