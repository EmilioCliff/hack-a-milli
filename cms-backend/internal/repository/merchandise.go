package repository

import (
	"context"
	"time"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
)

type Product struct {
	ID           int64      `json:"id"`
	CategoryID   int64      `json:"category_id"`
	CategoryName *string    `json:"category_name,omitempty"`
	Name         string     `json:"name"`
	Price        float64    `json:"price"`
	ImageUrl     []string   `json:"image_url"`
	Description  *string    `json:"description"`
	ItemsSold    int32      `json:"items_sold"`
	UpdatedBy    int64      `json:"updated_by"`
	CreatedBy    int64      `json:"created_by"`
	UpdatedAt    time.Time  `json:"updated_at"`
	CreatedAt    time.Time  `json:"created_at"`
	DeletedBy    *int64     `json:"deleted_by"`
	DeletedAt    *time.Time `json:"deleted_at"`
}

type UpdateProduct struct {
	ID          int64     `json:"id"`
	UpdatedBy   int64     `json:"updated_by"`
	CategoryID  *int64    `json:"category_id"`
	Name        *string   `json:"name"`
	Price       *float64  `json:"price"`
	ImageUrl    *[]string `json:"image_url"`
	Description *string   `json:"description"`
	ItemsSold   *int32    `json:"items_sold"`
	DeletedBy   *int64    `json:"deleted_by"`
}

type ProductFilter struct {
	Pagination *pkg.Pagination
	Search     *string
	CategoryID *int64
}

type Category struct {
	ID          int64      `json:"id"`
	Name        string     `json:"name"`
	Description *string    `json:"description"`
	CreatedBy   int64      `json:"created_by"`
	UpdatedBy   int64      `json:"updated_by"`
	UpdatedAt   time.Time  `json:"updated_at"`
	CreatedAt   time.Time  `json:"created_at"`
	DeletedBy   *int64     `json:"deleted_by"`
	DeletedAt   *time.Time `json:"deleted_at"`
}

type UpdateCategory struct {
	ID          int64   `json:"id"`
	UpdatedBy   int64   `json:"updated_by"`
	Name        *string `json:"name"`
	Description *string `json:"description"`
	DeletedBy   *int64  `json:"deleted_by"`
}

type CategoryFilter struct {
	Pagination *pkg.Pagination
	Search     *string
}

type ProductRepository interface {
	// Category methods
	CreateCategory(ctx context.Context, category *Category) (*Category, error)
	GetCategory(ctx context.Context, id int64) (*Category, error)
	UpdateCategory(ctx context.Context, category *UpdateCategory) (*Category, error)
	ListCategories(ctx context.Context, filter *CategoryFilter) ([]*Category, *pkg.Pagination, error)
	DeleteCategory(ctx context.Context, categoryID int64, userID int64) error

	// Product methods
	CreateProduct(ctx context.Context, product *Product) (*Product, error)
	GetProduct(ctx context.Context, id int64) (*Product, error)
	UpdateProduct(ctx context.Context, product *UpdateProduct) (*Product, error)
	ListProducts(ctx context.Context, filter *ProductFilter) ([]*Product, *pkg.Pagination, error)
	DeleteProduct(ctx context.Context, productID int64, userID int64) error

	// Order Methods
	CreateOrder(ctx context.Context, order *Order, orderItems []OrderItem) (*Order, error)
	GetOrder(ctx context.Context, id int64) (*Order, error)
	UpdateOrder(ctx context.Context, order *UpdateOrder) (*Order, error)
	ListOrders(ctx context.Context, filter *OrderFilter) ([]*Order, *pkg.Pagination, error)

	// Payment Methods
	CreatePayment(ctx context.Context, payment *Payment) (*Payment, error)
	GetPayment(ctx context.Context, id int64) (*Payment, error)
	UpdatePayment(ctx context.Context, payment *UpdatePayment) (*Payment, error)
	ListPayment(ctx context.Context, filter *PaymentFilter) ([]*Payment, *pkg.Pagination, error)
}
