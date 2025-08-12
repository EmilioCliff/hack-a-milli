package repository

import (
	"context"
	"time"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
)

type Order struct {
	ID            int64        `json:"id"`
	UserID        *int64       `json:"user_id"`
	Amount        float64      `json:"amount"`
	OrderDetails  OrderDetails `json:"order_details"`
	Status        string       `json:"status"`
	PaymentStatus bool         `json:"payment_status"`
	UpdatedBy     *int64       `json:"updated_by"`
	UpdatedAt     time.Time    `json:"updated_at"`
	CreatedAt     time.Time    `json:"created_at"`
}

type OrderDetails struct {
	FirstName     string `json:"first_name"`
	LastName      string `json:"last_name"`
	Email         string `json:"email"`
	PhoneNumber   string `json:"phone_number"`
	Address       string `json:"address"`
	City          string `json:"city"`
	PostalCode    string `json:"postal_code"`
	PaymentMethod string `json:"payment_method"`
}

type UpdateOrder struct {
	ID            int64   `json:"id"`
	UpdatedBy     int64   `json:"updated_by"`
	UserID        *int64  `json:"user_id"`
	Status        *string `json:"status"`
	PaymentStatus *bool   `json:"payment_status"`
}

type OrderFilter struct {
	Pagination    *pkg.Pagination
	Search        *string
	PaymentStatus *bool
	Status        *string
}

type OrderItem struct {
	OrderID   int64   `json:"order_id"`
	ProductID int64   `json:"product_id"`
	Size      string  `json:"size"`
	Color     string  `json:"color"`
	Quantity  int32   `json:"quantity"`
	Amount    float64 `json:"amount"`
}

type OrderRepository interface {
	CreateOrder(ctx context.Context, order *Order) (*Order, error)
	GetOrder(ctx context.Context, id int64) (*Order, error)
	UpdateOrder(ctx context.Context, order *UpdateOrder) (*Order, error)
	ListOrders(ctx context.Context, filter *OrderFilter) ([]*Order, *pkg.Pagination, error)
	DeleteOrder(ctx context.Context, orderID int64, userID int64) error
}
