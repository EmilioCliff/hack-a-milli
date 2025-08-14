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

var _ repository.ProductRepository = (*MerchRepository)(nil)

type MerchRepository struct {
	queries *generated.Queries
	db      *Store
}

func NewMerchRepository(store *Store) *MerchRepository {
	return &MerchRepository{queries: generated.New(store.pool), db: store}
}

func (mr *MerchRepository) CreateProduct(ctx context.Context, product *repository.Product) (*repository.Product, error) {
	if exists, _ := mr.queries.ProductCategoryExists(ctx, product.CategoryID); !exists {
		return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "category with ID %d does not exist", product.CategoryID)
	}

	createParams := generated.CreateProductParams{
		Name:        product.Name,
		CategoryID:  product.CategoryID,
		Price:       pkg.Float64ToPgTypeNumeric(product.Price),
		ImageUrl:    nil,
		Description: pgtype.Text{Valid: false},
		UpdatedBy:   product.UpdatedBy,
		CreatedBy:   product.CreatedBy,
	}

	if len(product.ImageUrl) > 0 {
		createParams.ImageUrl = product.ImageUrl
	}
	if product.Description != nil {
		createParams.Description = pgtype.Text{String: *product.Description, Valid: true}
	}

	productID, err := mr.queries.CreateProduct(ctx, createParams)
	if err != nil {
		if pkg.PgxErrorCode(err) == pkg.UNIQUE_VIOLATION {
			return nil, pkg.Errorf(pkg.ALREADY_EXISTS_ERROR, "product with name %s already exists", product.Name)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error creating product: %s", err.Error())
	}

	product.ID = productID

	return product, nil
}

func (mr *MerchRepository) GetProduct(ctx context.Context, id int64) (*repository.Product, error) {
	product, err := mr.queries.GetProduct(ctx, id)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "product with ID %d not found", id)
	}
	if err != nil {
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error retrieving product: %s", err.Error())
	}

	rslt := &repository.Product{
		ID:           product.ID,
		Name:         product.Name,
		CategoryName: &product.CategoryName,
		CategoryID:   product.CategoryID,
		Price:        pkg.PgTypeNumericToFloat64(product.Price),
		ImageUrl:     product.ImageUrl,
		Description:  nil,
		CreatedBy:    product.CreatedBy,
		UpdatedBy:    product.UpdatedBy,
		CreatedAt:    product.CreatedAt,
		UpdatedAt:    product.UpdatedAt,
		ItemsSold:    product.ItemsSold,
	}

	if product.Description.Valid {
		rslt.Description = &product.Description.String
	}

	return rslt, nil
}

func (mr *MerchRepository) UpdateProduct(ctx context.Context, product *repository.UpdateProduct) (*repository.Product, error) {
	updateParams := generated.UpdateProductParams{
		ID:          product.ID,
		UpdatedBy:   product.UpdatedBy,
		CategoryID:  pgtype.Int8{Valid: false},
		Name:        pgtype.Text{Valid: false},
		Price:       pgtype.Numeric{Valid: false},
		ImageUrl:    nil,
		Description: pgtype.Text{Valid: false},
		ItemsSold:   pgtype.Int4{Valid: false},
	}

	if product.CategoryID != nil {
		updateParams.CategoryID = pgtype.Int8{Int64: *product.CategoryID, Valid: true}
	}
	if product.Name != nil {
		updateParams.Name = pgtype.Text{String: *product.Name, Valid: true}
	}
	if product.Price != nil {
		updateParams.Price = pkg.Float64ToPgTypeNumeric(*product.Price)
	}
	if product.ImageUrl != nil {
		updateParams.ImageUrl = *product.ImageUrl
	}
	if product.Description != nil {
		updateParams.Description = pgtype.Text{String: *product.Description, Valid: true}
	}
	if product.ItemsSold != nil {
		updateParams.ItemsSold = pgtype.Int4{Int32: *product.ItemsSold, Valid: true}
	}

	updatedProduct, err := mr.queries.UpdateProduct(ctx, updateParams)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "product with ID %d not found", product.ID)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error updating product: %s", err.Error())
	}

	rslt := &repository.Product{
		ID:          updatedProduct.ID,
		Name:        updatedProduct.Name,
		CategoryID:  updatedProduct.CategoryID,
		Price:       pkg.PgTypeNumericToFloat64(updatedProduct.Price),
		ImageUrl:    updatedProduct.ImageUrl,
		Description: nil,
		CreatedBy:   updatedProduct.CreatedBy,
		UpdatedBy:   updatedProduct.UpdatedBy,
		CreatedAt:   updatedProduct.CreatedAt,
		UpdatedAt:   updatedProduct.UpdatedAt,
		ItemsSold:   updatedProduct.ItemsSold,
	}

	category, err := mr.queries.GetProductCategory(ctx, updatedProduct.CategoryID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "category with ID %d not found", updatedProduct.CategoryID)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error retrieving category: %s", err.Error())
	}

	rslt.CategoryName = &category.Name

	if updatedProduct.Description.Valid {
		rslt.Description = &updatedProduct.Description.String
	}

	return rslt, nil
}

func (mr *MerchRepository) ListProducts(ctx context.Context, filter *repository.ProductFilter) ([]*repository.Product, *pkg.Pagination, error) {
	listParams := generated.ListProductsParams{
		Limit:      int32(filter.Pagination.PageSize),
		Offset:     pkg.Offset(filter.Pagination.Page, filter.Pagination.PageSize),
		Search:     pgtype.Text{Valid: false},
		CategoryID: pgtype.Int8{Valid: false},
	}

	countParams := generated.CountProductsParams{
		Search:     pgtype.Text{Valid: false},
		CategoryID: pgtype.Int8{Valid: false},
	}

	if filter.Search != nil {
		search := strings.ToLower(*filter.Search)
		listParams.Search = pgtype.Text{String: "%" + search + "%", Valid: true}
		countParams.Search = pgtype.Text{String: "%" + search + "%", Valid: true}
	}

	if filter.CategoryID != nil {
		listParams.CategoryID = pgtype.Int8{Int64: *filter.CategoryID, Valid: true}
		countParams.CategoryID = pgtype.Int8{Int64: *filter.CategoryID, Valid: true}
	}

	products, err := mr.queries.ListProducts(ctx, listParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error listing products: %s", err.Error())
	}

	count, err := mr.queries.CountProducts(ctx, countParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error counting products: %s", err.Error())
	}

	rslt := make([]*repository.Product, len(products))
	for i, product := range products {
		rslt[i] = &repository.Product{
			ID:           product.ID,
			Name:         product.Name,
			CategoryName: &product.CategoryName,
			CategoryID:   product.CategoryID,
			Price:        pkg.PgTypeNumericToFloat64(product.Price),
			ImageUrl:     product.ImageUrl,
			Description:  nil,
			CreatedBy:    product.CreatedBy,
			UpdatedBy:    product.UpdatedBy,
			CreatedAt:    product.CreatedAt,
			UpdatedAt:    product.UpdatedAt,
			ItemsSold:    product.ItemsSold,
		}

		if product.Description.Valid {
			rslt[i].Description = &product.Description.String
		}
	}

	return rslt, pkg.CalculatePagination(uint32(count), filter.Pagination.PageSize, filter.Pagination.Page), nil
}

func (mr *MerchRepository) DeleteProduct(ctx context.Context, productID int64, userID int64) error {
	if err := mr.queries.DeleteProduct(ctx, generated.DeleteProductParams{
		ID:        productID,
		DeletedBy: pgtype.Int8{Int64: userID, Valid: true},
	}); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return pkg.Errorf(pkg.NOT_FOUND_ERROR, "product with ID %d not found", productID)
		}
		return pkg.Errorf(pkg.INTERNAL_ERROR, "error deleting product: %s", err.Error())
	}

	return nil
}
