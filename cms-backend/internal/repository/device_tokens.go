package repository

import (
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
	// Search     *string
	Active   *bool
	Platform *string
}
