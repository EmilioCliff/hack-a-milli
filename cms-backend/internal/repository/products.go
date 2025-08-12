package repository

import (
	"context"
	"time"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
)

type Product struct {
	ID          int64      `json:"id"`
	Name        string     `json:"name"`
	Price       float64    `json:"price"`
	ImageUrl    []string   `json:"image_url"`
	Description *string    `json:"description"`
	ItemsSold   int32      `json:"items_sold"`
	UpdatedBy   int64      `json:"updated_by"`
	CreatedBy   int64      `json:"created_by"`
	UpdatedAt   time.Time  `json:"updated_at"`
	CreatedAt   time.Time  `json:"created_at"`
	DeletedBy   *int64     `json:"deleted_by"`
	DeletedAt   *time.Time `json:"deleted_at"`
}

type UpdateProduct struct {
	ID          int64    `json:"id"`
	UpdatedBy   int64    `json:"updated_by"`
	Name        *string  `json:"name"`
	Price       *float64 `json:"price"`
	ImageUrl    []string `json:"image_url"`
	Description *string  `json:"description"`
	ItemsSold   *int32   `json:"items_sold"`
	DeletedBy   *int64   `json:"deleted_by"`
}

type ProductFilter struct {
	Pagination *pkg.Pagination
	Search     *string
}

type ProductRepository interface {
	CreateProduct(ctx context.Context, product *Product) (*Product, error)
	GetProduct(ctx context.Context, id int64) (*Product, error)
	UpdateProduct(ctx context.Context, product *UpdateProduct) (*Product, error)
	ListProducts(ctx context.Context, filter *ProductFilter) ([]*Product, *pkg.Pagination, error)
	DeleteProduct(ctx context.Context, productID int64, userID int64) error
}
