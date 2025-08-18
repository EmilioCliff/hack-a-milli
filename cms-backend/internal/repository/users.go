package repository

import (
	"context"
	"time"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
)

type User struct {
	ID                        int64     `json:"id"`
	Email                     string    `json:"email"`
	FullName                  string    `json:"full_name"`
	PhoneNumber               string    `json:"phone_number"`
	Address                   *string   `json:"address"`
	PasswordHash              *string   `json:"password_hash,omitempty"`
	RefreshToken              *string   `json:"refresh_token,omitempty"`
	Role                      []string  `json:"role"`
	DepartmentID              *int64    `json:"department_id,omitempty"`
	DepartmentName            *string   `json:"department_name,omitempty"`
	Active                    bool      `json:"active"`
	AccountVerified           bool      `json:"account_verified"`
	MultifactorAuthentication bool      `json:"multifactor_authentication"`
	UpdatedBy                 *int64    `json:"updated_by"`
	CreatedBy                 int64     `json:"created_by"`
	UpdatedAt                 time.Time `json:"updated_at"`
	CreatedAt                 time.Time `json:"created_at"`
}

type UpdateUser struct {
	ID                        int64     `json:"id"`
	UpdatedBy                 int64     `json:"updated_by"`
	FullName                  *string   `json:"full_name"`
	PhoneNumber               *string   `json:"phone_number"`
	Address                   *string   `json:"address"`
	PasswordHash              *string   `json:"password_hash"`
	RefreshToken              *string   `json:"refresh_token"`
	AccountVerified           *bool     `json:"account_verified"`
	Role                      *[]string `json:"role"`
	DepartmentID              *int64    `json:"department_id"`
	Active                    *bool     `json:"active"`
	MultifactorAuthentication *bool     `json:"multifactor_authentication"`
}

type UserFilter struct {
	Pagination   *pkg.Pagination
	Search       *string
	Role         *[]string
	DepartmentID *int64
	Active       *bool
}

type UserRepositort interface {
	// User Methods
	CreateUser(ctx context.Context, user *User, roleIds []int64, assignedBy int64) (*User, error)
	GetUser(ctx context.Context, id int64) (*User, error)
	UpdateUser(ctx context.Context, user *UpdateUser) (*User, error)
	ListUser(ctx context.Context, filter *UserFilter) ([]*User, *pkg.Pagination, error)
	DeleteUser(ctx context.Context, userToDeleteID int64, userID int64) error

	// User roles
	UpdateUserRole(ctx context.Context, userID int64, roleIDs []int64, updatedBy int64) error

	// User Internal Methods
	GetUserInternal(ctx context.Context, email string) (*User, error)
	UpdateUserCredentialsInternal(ctx context.Context, id int64, passwordHash string, refreshToken string) error

	// User Preferences Methods
	CreateUserPreferences(ctx context.Context, userPreferences *UserPreferences) (*UserPreferences, error)
	GetUserPreference(ctx context.Context, userID int64) (*UserPreferences, error)
	ListUserPreferences(ctx context.Context, filter *UserPreferencesFilter) ([]*UserPreferences, *pkg.Pagination, error)
	UpdateUserPreference(ctx context.Context, userPreferences *UpdateUserPreferences) (*UserPreferences, error)

	// Device Token Methods
	CreateDeviceToken(ctx context.Context, deviceToken *DeviceToken) (*DeviceToken, error)
	GetDeviceTokenByID(ctx context.Context, id int64) (*DeviceToken, error)
	GetDeviceTokenByUserID(ctx context.Context, id int64) ([]DeviceToken, error)
	ListDeviceToken(ctx context.Context, filter *DeviceTokenFilter) ([]*DeviceToken, *pkg.Pagination, error)
	UpdateDeviceToken(ctx context.Context, active bool, userID int64) error
}
