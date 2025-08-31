package repository

import (
	"context"
	"time"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
)

type Auction struct {
	ID          int64     `json:"id"`
	Domain      string    `json:"domain"`
	Category    string    `json:"category"`
	Description string    `json:"description"`
	CurrentBid  float64   `json:"current_bid"`
	StartPrice  float64   `json:"start_price"`
	StartTime   time.Time `json:"start_time"`
	EndTime     time.Time `json:"end_time"`
	Watchers    int64     `json:"watchers"`
	BidsCount   int64     `json:"bids_count"`
	Status      string    `json:"status"`
	CreatedBy   int64     `json:"created_by"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedBy   int64     `json:"updated_by"`
	UpdatedAt   time.Time `json:"updated_at"`

	// Expandable
	TopFourBids []Bid `json:"top_four_bids,omitempty"`
}

type UpdateAuction struct {
	ID          int64      `json:"id"`
	UpdatedBy   int64      `json:"updated_by"`
	Domain      *string    `json:"domain"`
	Category    *string    `json:"category"`
	Description *string    `json:"description"`
	StartPrice  *float64   `json:"start_price"`
	StartTime   *time.Time `json:"start_time"`
	EndTime     *time.Time `json:"end_time"`
	Status      *string    `json:"status"`
}

type AuctionFilter struct {
	Pagination *pkg.Pagination
	Search     *string
	Category   *string
	Status     *string
}

type AuctionRepository interface {
	// Auctions
	CreateAuction(ctx context.Context, auction *Auction) (*Auction, error)
	UpdateAuction(ctx context.Context, auction *UpdateAuction) (*Auction, error)
	GetAuctionByID(ctx context.Context, id int64) (*Auction, error)
	GetAuctions(ctx context.Context, filter *AuctionFilter) ([]*Auction, *pkg.Pagination, error)
	DeleteAuction(ctx context.Context, id int64, userId int64) error

	// Bids
	CreateBid(ctx context.Context, bid *Bid) (*Bid, error)
	GetBids(ctx context.Context, filter *BidFilter) ([]*Bid, *pkg.Pagination, error)

	// Watchers
	CreateWatcher(ctx context.Context, watcher *Watcher) (*Watcher, error)
	GetWatchersWithActiveDeviceTokens(ctx context.Context, auctionId int64) ([]string, error)
}
