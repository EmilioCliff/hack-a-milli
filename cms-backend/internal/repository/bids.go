package repository

import (
	"time"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
)

type Bid struct {
	ID             int64     `json:"id"`
	UserID         int64     `json:"user_id"`
	AuctionID      int64     `json:"auction_id"`
	UserIdentifier string    `json:"user_identifier"`
	Amount         float64   `json:"amount"`
	CreatedAt      time.Time `json:"created_at"`

	// Expandable
	UserDetails struct {
		UserID   int64  `json:"user_id"`
		FullName string `json:"full_name"`
		Email    string `json:"email"`
	} `json:"user_details,omitempty"`
}

type BidFilter struct {
	AuctionID  int64
	Pagination *pkg.Pagination
}
