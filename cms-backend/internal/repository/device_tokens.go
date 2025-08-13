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

	// Expandable
	User *User `json:"user,omitempty"`
}

type DeviceTokenFilter struct {
	Pagination *pkg.Pagination
	Active     *bool
	Platform   *string
}

type DeviceTokenRepository interface {
	CreateDeviceToken(ctx context.Context, deviceToken *DeviceToken) (*DeviceToken, error)
	GetDeviceTokenByID(ctx context.Context, id int64) (*DeviceToken, error)
	GetDeviceTokenByUserID(ctx context.Context, id int64) (*DeviceToken, error)
	ListDeviceToken(ctx context.Context, filter *DeviceTokenFilter) ([]*DeviceToken, error)
	UpdateDeviceToken(ctx context.Context, active bool, userID int64) error
}
