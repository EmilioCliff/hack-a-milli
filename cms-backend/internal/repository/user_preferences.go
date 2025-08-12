package repository

import (
	"context"
	"time"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
)

type UserPreferences struct {
	UserID         int64     `json:"user_id"`
	NotifyNews     bool      `json:"notify_news"`
	NotifyEvents   bool      `json:"notify_events"`
	NotifyTraining bool      `json:"notify_training"`
	NotifyPolicy   bool      `json:"notify_policy"`
	UpdatedAt      time.Time `json:"updated_at"`
	CreatedAt      time.Time `json:"created_at"`
}

type UpdateUserPreferences struct {
	UserID         int64 `json:"user_id"`
	NotifyNews     bool  `json:"notify_news"`
	NotifyEvents   bool  `json:"notify_events"`
	NotifyTraining bool  `json:"notify_training"`
	NotifyPolicy   bool  `json:"notify_policy"`
}

type UserPreferencesFilter struct {
	Pagination *pkg.Pagination
	UserID     *int64
}

type UserPreferencesRepository interface {
	CreateUserPreferences(ctx context.Context, userPreferences *UserPreferences) (*UserPreferences, error)
	GetUserPreference(ctx context.Context, id int64) (*UserPreferences, error)
	ListUserPreferences(ctx context.Context, filter *UserPreferencesFilter) ([]*UserPreferences, error)
	UpdateUserPreference(ctx context.Context, userPreferences *UpdateUserPreferences) (*UserPreferences, error)
}
