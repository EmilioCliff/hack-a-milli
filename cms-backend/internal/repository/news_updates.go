package repository

import (
	"context"
	"time"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
)

type NewsUpdate struct {
	ID          int64      `json:"id"`
	Title       string     `json:"title"`
	Topic       string     `json:"topic"`
	Date        time.Time  `json:"date"`
	MinRead     int32      `json:"min_read"`
	Content     string     `json:"content"`
	CoverImg    string     `json:"cover_img"`
	Published   bool       `json:"published"`
	PublishedAt *time.Time `json:"published_at"`
	UpdatedBy   int64      `json:"updated_by"`
	CreatedBy   int64      `json:"created_by"`
	UpdatedAt   time.Time  `json:"updated_at"`
	CreatedAt   time.Time  `json:"created_at"`
	DeletedBy   *int64     `json:"deleted_by,omitempty"`
	DeletedAt   *time.Time `json:"deleted_at,omitempty"`
}

type UpdateNewsUpdate struct {
	ID        int64      `json:"id"`
	UpdatedBy int64      `json:"updated_by"`
	Title     *string    `json:"title"`
	Topic     *string    `json:"topic"`
	Date      *time.Time `json:"date"`
	MinRead   *int32     `json:"min_read"`
	Content   *string    `json:"content"`
	CoverImg  *string    `json:"cover_img"`
	Published *bool      `json:"published"`
	DeletedBy *int64     `json:"deleted_by,omitempty"`
}

type NewsUpdateFilter struct {
	Pagination *pkg.Pagination
	Search     *string
	StartDate  *time.Time
	EndDate    *time.Time
	Published  *bool
}

type NewsUpdateRepository interface {
	CreateNewsUpdate(ctx context.Context, newsUpdate *NewsUpdate) (*NewsUpdate, error)
	GetNewsUpdate(ctx context.Context, id int64) (*NewsUpdate, error)
	ListNewsUpdate(ctx context.Context, filter *NewsUpdateFilter) ([]*NewsUpdate, error)
	UpdateNewsUpdate(ctx context.Context, newsUpdate *UpdateNewsUpdate) (*NewsUpdate, error)
	DeleteNewsUpdate(ctx context.Context, newsUpdateID int64, userID int64) error
}
