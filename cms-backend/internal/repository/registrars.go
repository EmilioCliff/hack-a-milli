package repository

import (
	"context"
	"time"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
)

type Registrar struct {
	ID           int64      `json:"id"`
	Email        string     `json:"email"`
	Name         string     `json:"name"`
	LogoUrl      string     `json:"logo_url"`
	Address      string     `json:"address"`
	Specialities []string   `json:"specialities"`
	PhoneNumber  string     `json:"phone_number"`
	WebsiteUrl   string     `json:"website_url"`
	UpdatedBy    int64      `json:"updated_by"`
	CreatedBy    int64      `json:"created_by"`
	UpdatedAt    time.Time  `json:"updated_at"`
	CreatedAt    time.Time  `json:"created_at"`
	DeletedBy    *int64     `json:"deleted_by,omitempty"`
	DeletedAt    *time.Time `json:"deleted_at,omitempty"`
}

type UpdateRegistrar struct {
	ID           int64    `json:"id"`
	UpdatedBy    int64    `json:"updated_by"`
	Email        *string  `json:"email"`
	Name         *string  `json:"name"`
	LogoUrl      *string  `json:"logo_url"`
	Address      *string  `json:"address"`
	Specialities []string `json:"specialities"`
	PhoneNumber  *string  `json:"phone_number"`
	WebsiteUrl   *string  `json:"website_url"`
	DeletedBy    *int64   `json:"deleted_by"`
}

type RegistrarFilter struct {
	Pagination   *pkg.Pagination
	Search       *string
	Specialities []string
}

type RegistrarRepository interface {
	CreateRegistrar(ctx context.Context, registrar *Registrar) (*Registrar, error)
	GetRegistrar(ctx context.Context, id int64) (*Registrar, error)
	UpdateRegistrar(ctx context.Context, registrar *UpdateRegistrar) (*Registrar, error)
	ListRegistrars(ctx context.Context, filter *RegistrarFilter) ([]*Registrar, *pkg.Pagination, error)
	DeleteRegistrar(ctx context.Context, registrarID int64, userID int64) error
}
