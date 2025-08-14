package repository

import (
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

	// Expandable
	User       *User       `json:"user,omitempty"`
	OrderItems []OrderItem `json:"order_items,omitempty"`
}

type OrderDetails struct {
	FirstName     string `json:"first_name" binding:"required"`
	LastName      string `json:"last_name" binding:"required"`
	Email         string `json:"email" binding:"required"`
	PhoneNumber   string `json:"phone_number" binding:"required"`
	Address       string `json:"address" binding:"required"`
	City          string `json:"city" binding:"required"`
	PostalCode    string `json:"postal_code" binding:"required"`
	PaymentMethod string `json:"payment_method" binding:"required"`
}

type UpdateOrder struct {
	ID            int64   `json:"id"`
	UpdatedBy     int64   `json:"updated_by"`
	UserID        *int64  `json:"user_id"`
	Status        *string `json:"status"`
	PaymentStatus *bool   `json:"payment_status"`
}

type OrderFilter struct {
	Pagination *pkg.Pagination
	// Search        *string
	UserID        *int64
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

	// Expandable
	Product *Product `json:"product,omitempty"`
}
