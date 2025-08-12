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
	Address                   string    `json:"address"`
	PasswordHash              string    `json:"password_hash"`
	Role                      []string  `json:"role"`
	DepartmentID              *int64    `json:"department_id,omitempty"`
	DepartmentName            *string   `json:"department_name,omitempty"`
	Active                    bool      `json:"active"`
	AccountVerified           bool      `json:"account_verified"`
	MultifactorAuthentication bool      `json:"multifactor_authentication"`
	UpdatedBy                 *int64    `json:"updated_by"`
	CreatedBy                 *int64    `json:"created_by"`
	UpdatedAt                 time.Time `json:"updated_at"`
	CreatedAt                 time.Time `json:"created_at"`
}

type UpdateUser struct {
	ID                        int64    `json:"id"`
	UpdatedBy                 int64    `json:"updated_by"`
	FullName                  *string  `json:"full_name"`
	PhoneNumber               *string  `json:"phone_number"`
	Address                   *string  `json:"address"`
	PasswordHash              *string  `json:"password_hash"`
	Role                      []string `json:"role"`
	DepartmentID              *int64   `json:"department_id,omitempty"`
	DepartmentName            *string  `json:"department_name,omitempty"`
	Active                    *bool    `json:"active"`
	MultifactorAuthentication *bool    `json:"multifactor_authentication"`
}

type UserFilter struct {
	Pagination   *pkg.Pagination
	Search       *string
	Role         []string
	DepartmentID *int64
	Active       *bool
}

type UserRepositort interface {
	CreateUser(ctx context.Context, user *User) (*User, error)
	GetUser(ctx context.Context, id int64) (*User, error)
	UpdateUser(ctx context.Context, user *UpdateUser) (*User, error)
	ListUser(ctx context.Context, filter *UserFilter) ([]*User, *pkg.Pagination, error)
	DeleteUser(ctx context.Context, userToDeleteID int64, userID int64) error
}
