package repository

import (
	"context"
	"time"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
)

type Blog struct {
	ID          int64      `json:"id"`
	Title       string     `json:"title"`
	Author      int64      `json:"author"`
	CoverImg    string     `json:"cover_img"`
	Topic       string     `json:"topic"`
	Description string     `json:"description"`
	Content     string     `json:"content"`
	Views       int32      `json:"views"`
	MinRead     int32      `json:"min_read"`
	Published   bool       `json:"published"`
	PublishedAt *time.Time `json:"published_at"`
	UpdatedBy   int64      `json:"updated_by"`
	UpdatedAt   time.Time  `json:"updated_at"`
	DeletedBy   *int64     `json:"deleted_by,omitempty"`
	DeletedAt   *time.Time `json:"deleted_at,omitempty"`
	CreatedBy   int64      `json:"created_by"`
	CreatedAt   time.Time  `json:"created_at"`

	// Expandable
	AuthorDetails *User `json:"author_details,omitempty"`
}

type UpdateBlog struct {
	ID          int64   `json:"id"`
	UpdatedBy   int64   `json:"updated_by"`
	Title       *string `json:"title"`
	CoverImg    *string `json:"cover_img"`
	Topic       *string `json:"topic"`
	Description *string `json:"description"`
	Content     *string `json:"content"`
	Views       *int32  `json:"views"`
	MinRead     *int32  `json:"min_read"`
	Published   *bool   `json:"published"`
	DeletedBy   *int64  `json:"deleted_by"`
}

type BlogFilter struct {
	Pagination *pkg.Pagination
	Search     *string
	// Topic      *string
	Published *bool
	Author    *int64
}

type BlogRepository interface {
	CreateBlog(ctx context.Context, blog *Blog) (*Blog, error)
	GetBlog(ctx context.Context, id int64) (*Blog, error)
	GetPublishedBlog(ctx context.Context, id int64) (*Blog, error)
	UpdateBlog(ctx context.Context, blog *UpdateBlog) (*Blog, error)
	PublishBlog(ctx context.Context, blogID int64, userID int64) (*Blog, error)
	ListBlogs(ctx context.Context, filter *BlogFilter) ([]*Blog, *pkg.Pagination, error)
	DeleteBlog(ctx context.Context, blogID int64, userID int64) error
}
