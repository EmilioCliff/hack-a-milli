package repository

import (
	"time"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
)

type Payment struct {
	ID            int64     `json:"id"`
	OrderID       int64     `json:"order_id"`
	UserID        *int64    `json:"user_id,omitempty"`
	PaymentMethod string    `json:"payment_method"`
	Amount        float64   `json:"amount"`
	Status        bool      `json:"status"`
	UpdatedBy     *int64    `json:"updated_by"`
	CreatedBy     *int64    `json:"created_by"`
	UpdatedAt     time.Time `json:"updated_at"`
	CreatedAt     time.Time `json:"created_at"`

	// Expandable
	Order *Order `json:"order,omitempty"`
	User  *User  `json:"user,omitempty"`
}

type UpdatePayment struct {
	ID        int64  `json:"id"`
	UpdatedBy int64  `json:"updated_by"`
	Status    *bool  `json:"status"`
	UserID    *int64 `json:"user_id,omitempty"`
}

type PaymentFilter struct {
	Pagination    *pkg.Pagination
	OrderID       *int64
	UserID        *int64
	PaymentMethod *string
	Status        *bool
	StartDate     *time.Time
	EndDate       *time.Time
}
