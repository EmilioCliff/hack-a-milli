package repository

import "time"

type Watcher struct {
	ID        int64     `json:"id"`
	UserID    int64     `json:"user_id"`
	AuctionID int64     `json:"auction_id"`
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"created_at"`
}
