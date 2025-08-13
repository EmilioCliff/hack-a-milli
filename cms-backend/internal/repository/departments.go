package repository

import (
	"context"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
)

type Department struct {
	ID   int64  `json:"id"`
	Name string `json:"name"`
}

type DepartmentFilter struct {
	Pagination *pkg.Pagination
	Search     *string
}

type DepartmentRepository interface {
	CreateDepartment(ctx context.Context, name string) (*Department, error)
	GetDepartment(ctx context.Context, id int64) (*Department, error)
	UpdateDeparment(ctx context.Context, id int64, name string, pagination *pkg.Pagination) (*Department, *pkg.Pagination, error)
	ListDepartment(ctx context.Context, filter *DepartmentFilter) ([]*Department, *pkg.Pagination, error)
}
