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

var _ repository.DepartmentRepository = (*DepartmentRepository)(nil)

type DepartmentRepository struct {
	queries *generated.Queries
}

func NewDepartmentRepository(queries *generated.Queries) *DepartmentRepository {
	return &DepartmentRepository{queries: queries}
}

func (dr *DepartmentRepository) CreateDepartment(ctx context.Context, name string) (*repository.Department, error) {
	departmentId, err := dr.queries.CreateDepartment(ctx, name)
	if err != nil {
		if pkg.PgxErrorCode(err) == pkg.UNIQUE_VIOLATION {
			return nil, pkg.Errorf(pkg.ALREADY_EXISTS_ERROR, "department with name %s already exists", name)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error creating department: %s", err.Error())
	}
	return &repository.Department{
		ID:   departmentId,
		Name: name,
	}, nil
}

func (dr *DepartmentRepository) GetDepartment(ctx context.Context, id int64) (*repository.Department, error) {
	department, err := dr.queries.GetDepartment(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "department with ID %d not found", id)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error retrieving department: %s", err.Error())
	}
	return &repository.Department{
		ID:   department.ID,
		Name: department.Name,
	}, nil
}

func (dr *DepartmentRepository) UpdateDeparment(ctx context.Context, id int64, name string, pagination *pkg.Pagination) (*repository.Department, *pkg.Pagination, error) {
	if err := dr.queries.UpdateDepartment(ctx, generated.UpdateDepartmentParams{
		ID:   id,
		Name: name,
	}); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "department with ID %d not found", id)
		}
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error updating department: %s", err.Error())
	}

	return &repository.Department{ID: id, Name: name}, pagination, nil

}

func (dr *DepartmentRepository) ListDepartment(ctx context.Context, filter *repository.DepartmentFilter) ([]*repository.Department, *pkg.Pagination, error) {
	listParams := generated.ListDepartmentsParams{
		Limit:  int32(filter.Pagination.PageSize),
		Offset: pkg.Offset(filter.Pagination.Page, filter.Pagination.PageSize),
		Search: pgtype.Text{Valid: false},
	}

	countParams := pgtype.Text{Valid: false}
	if filter.Search != nil {
		search := "%" + *filter.Search + "%"
		listParams.Search = pgtype.Text{String: search, Valid: true}
		countParams = pgtype.Text{String: search, Valid: true}
	}

	departments, err := dr.queries.ListDepartments(ctx, listParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error listing departments: %s", err.Error())
	}
	count, err := dr.queries.CountDepartments(ctx, countParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error counting departments: %s", err.Error())
	}

	rslt := make([]*repository.Department, len(departments))
	for i, department := range departments {
		rslt[i] = &repository.Department{
			ID:   department.ID,
			Name: department.Name,
		}
	}

	return rslt, pkg.CalculatePagination(uint32(count), filter.Pagination.PageSize, filter.Pagination.Page), nil
}
