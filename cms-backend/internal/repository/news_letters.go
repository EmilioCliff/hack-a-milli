package repository

import (
	"context"
	"time"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
)

type NewsLetter struct {
	ID          int64      `json:"id"`
	Title       string     `json:"title"`
	Description string     `json:"description"`
	PdfUrl      string     `json:"pdf_url"`
	Date        time.Time  `json:"date"`
	Published   bool       `json:"published"`
	PublishedAt *time.Time `json:"published_at"`
	UpdatedBy   int64      `json:"updated_by"`
	CreatedBy   int64      `json:"created_by"`
	UpdatedAt   time.Time  `json:"updated_at"`
	CreatedAt   time.Time  `json:"created_at"`
	DeletedBy   *int64     `json:"deleted_by,omitempty"`
	DeletedAt   *time.Time `json:"deleted_at,omitempty"`
}

type UpdateNewsLetter struct {
	ID          int64      `json:"id"`
	UpdatedBy   int64      `json:"updated_by"`
	Title       *string    `json:"title"`
	Description *string    `json:"description"`
	PdfUrl      *string    `json:"pdf_url"`
	Date        *time.Time `json:"date"`
	Published   *bool      `json:"published"`
	DeletedBy   *int64     `json:"deleted_by,omitempty"`
}

type NewsLetterFilter struct {
	Pagination *pkg.Pagination
	Search     *string
	StartDate  *time.Time
	EndDate    *time.Time
	Published  *bool
}

type NewsLetterRepository interface {
	CreateNewsLetter(ctx context.Context, newsLetter *NewsLetter) (*NewsLetter, error)
	GetNewsLetter(ctx context.Context, id int64) (*NewsLetter, error)
	ListNewsLetters(ctx context.Context, filter *NewsLetterFilter) ([]*NewsLetter, error)
	PublishNewsLetter(ctx context.Context, newsLetterID int64, userID int64) (*NewsLetter, error)
	UpdateNewsLetter(ctx context.Context, newsLetter *UpdateNewsLetter) (*NewsLetter, error)
	DeleteNewsLetter(ctx context.Context, newsLetterID int64, userID int64) error
}
