package repository

import (
	"context"
	"time"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
)

type DeviceToken struct {
	ID          int64     `json:"id"`
	UserID      int64     `json:"user_id"`
	DeviceToken string    `json:"device_token"`
	Platform    string    `json:"platform"`
	Active      bool      `json:"active"`
	CreatedAt   time.Time `json:"created_at"`
}

type DeviceTokenFilter struct {
	Pagination *pkg.Pagination
	Active     *bool
}

type DeviceTokenRepository interface {
	CreateDeviceToken(ctx context.Context, deviceToken *DeviceToken) (*DeviceToken, error)
	GetDeviceToken(ctx context.Context, id int64) (*DeviceToken, error)
	ListDeviceToken(ctx context.Context, filter *DeviceTokenFilter) ([]*DeviceToken, error)
	UpdateDeviceToken(ctx context.Context, active bool, deviceTokenID int64) (*DeviceToken, error)
}
