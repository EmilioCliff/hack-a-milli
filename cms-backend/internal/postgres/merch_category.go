package postgres

import (
	"context"
	"database/sql"
	"errors"
	"strings"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/internal/postgres/generated"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/internal/repository"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
	"github.com/jackc/pgx/v5/pgtype"
)

func (mr *MerchRepository) CreateCategory(ctx context.Context, category *repository.Category) (*repository.Category, error) {
	createParams := generated.CreateProductCategoryParams{
		Name:        category.Name,
		Description: pgtype.Text{Valid: false},
		CreatedBy:   category.CreatedBy,
		UpdatedBy:   category.UpdatedBy,
	}

	if category.Description != nil {
		createParams.Description = pgtype.Text{Valid: true, String: *category.Description}
	}

	categoryID, err := mr.queries.CreateProductCategory(ctx, createParams)
	if err != nil {
		if pkg.PgxErrorCode(err) == pkg.UNIQUE_VIOLATION {
			return nil, pkg.Errorf(pkg.ALREADY_EXISTS_ERROR, "category with name %s already exists", category.Name)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error creating category: %s", err.Error())
	}

	category.ID = categoryID

	return category, nil
}

func (mr *MerchRepository) GetCategory(ctx context.Context, id int64) (*repository.Category, error) {
	category, err := mr.queries.GetProductCategory(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "category with ID %d not found", id)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error retrieving category: %s", err.Error())
	}

	rslt := &repository.Category{
		ID:          category.ID,
		Name:        category.Name,
		Description: nil,
		CreatedBy:   category.CreatedBy,
		UpdatedBy:   category.UpdatedBy,
	}

	if category.Description.Valid {
		rslt.Description = &category.Description.String
	}
	return rslt, nil
}

func (mr *MerchRepository) UpdateCategory(ctx context.Context, category *repository.UpdateCategory) (*repository.Category, error) {
	updateParams := generated.UpdateProductCategoryParams{
		ID:          category.ID,
		UpdatedBy:   category.UpdatedBy,
		Name:        pgtype.Text{Valid: false},
		Description: pgtype.Text{Valid: false},
	}

	if category.Name != nil {
		updateParams.Name = pgtype.Text{String: *category.Name, Valid: true}
	}
	if category.Description != nil {
		updateParams.Description = pgtype.Text{String: *category.Description, Valid: true}
	}

	updatedCategory, err := mr.queries.UpdateProductCategory(ctx, updateParams)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "category with ID %d not found", category.ID)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error updating category: %s", err.Error())
	}

	rslt := &repository.Category{
		ID:          updatedCategory.ID,
		Name:        updatedCategory.Name,
		Description: nil,
		CreatedBy:   updatedCategory.CreatedBy,
		UpdatedBy:   updatedCategory.UpdatedBy,
	}

	if updatedCategory.Description.Valid {
		rslt.Description = &updatedCategory.Description.String
	}

	return rslt, nil
}

func (mr *MerchRepository) ListCategories(ctx context.Context, filter *repository.CategoryFilter) ([]*repository.Category, *pkg.Pagination, error) {
	listParams := generated.ListProductCategoriesParams{
		Limit:  int32(filter.Pagination.PageSize),
		Offset: pkg.Offset(filter.Pagination.Page, filter.Pagination.PageSize),
		Search: pgtype.Text{Valid: false},
	}

	countParams := pgtype.Text{Valid: false}
	if filter.Search != nil {
		search := strings.ToLower(*filter.Search)
		listParams.Search = pgtype.Text{String: "%" + search + "%", Valid: true}
		countParams = pgtype.Text{String: "%" + search + "%", Valid: true}
	}

	productCategories, err := mr.queries.ListProductCategories(ctx, listParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error listing categories: %s", err.Error())
	}

	count, err := mr.queries.CountProductCategories(ctx, countParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error counting categories: %s", err.Error())
	}

	categories := make([]*repository.Category, len(productCategories))
	for i, category := range productCategories {
		categories[i] = &repository.Category{
			ID:          category.ID,
			Name:        category.Name,
			Description: nil,
			CreatedBy:   category.CreatedBy,
			UpdatedBy:   category.UpdatedBy,
		}

		if category.Description.Valid {
			categories[i].Description = &category.Description.String
		}
	}

	return categories, pkg.CalculatePagination(uint32(count), filter.Pagination.PageSize, filter.Pagination.Page), nil
}

func (mr *MerchRepository) DeleteCategory(ctx context.Context, categoryID int64, userID int64) error {
	if err := mr.queries.DeleteProductCategory(ctx, generated.DeleteProductCategoryParams{
		ID:        categoryID,
		DeletedBy: pgtype.Int8{Int64: userID, Valid: true},
	}); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return pkg.Errorf(pkg.NOT_FOUND_ERROR, "category with ID %d not found", categoryID)
		}
		return pkg.Errorf(pkg.INTERNAL_ERROR, "error deleting category: %s", err.Error())
	}

	return nil
}
