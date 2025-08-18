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
	Published  *bool
	StartDate  *time.Time
	EndDate    *time.Time
}

type NewsRepository interface {
	// News Update methods
	CreateNewsUpdate(ctx context.Context, newsUpdate *NewsUpdate) (*NewsUpdate, error)
	GetNewsUpdate(ctx context.Context, id int64) (*NewsUpdate, error)
	GetPublishedNewsUpdate(ctx context.Context, id int64) (*NewsUpdate, error)
	ListNewsUpdate(ctx context.Context, filter *NewsUpdateFilter) ([]*NewsUpdate, *pkg.Pagination, error)
	PublishNewsUpdate(ctx context.Context, newsUpdateID int64, userID int64) (*NewsUpdate, error)
	UpdateNewsUpdate(ctx context.Context, newsUpdate *UpdateNewsUpdate) (*NewsUpdate, error)
	DeleteNewsUpdate(ctx context.Context, newsUpdateID int64, userID int64) error

	// News Letter methods
	CreateNewsLetter(ctx context.Context, newsLetter *NewsLetter) (*NewsLetter, error)
	GetNewsLetter(ctx context.Context, id int64) (*NewsLetter, error)
	GetPublishedNewsLetter(ctx context.Context, id int64) (*NewsLetter, error)
	ListNewsLetters(ctx context.Context, filter *NewsLetterFilter) ([]*NewsLetter, *pkg.Pagination, error)
	PublishNewsLetter(ctx context.Context, newsLetterID int64, userID int64) (*NewsLetter, error)
	UpdateNewsLetter(ctx context.Context, newsLetter *UpdateNewsLetter) (*NewsLetter, error)
	DeleteNewsLetter(ctx context.Context, newsLetterID int64, userID int64) error
}
