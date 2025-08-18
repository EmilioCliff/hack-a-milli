package postgres

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/internal/postgres/generated"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/internal/repository"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
	"github.com/jackc/pgx/v5/pgtype"
)

var _ repository.BlogRepository = (*BlogRepository)(nil)

type BlogRepository struct {
	queries *generated.Queries
}

func NewBlogRepository(queries *generated.Queries) *BlogRepository {
	return &BlogRepository{queries: queries}
}

func (br *BlogRepository) CreateBlog(ctx context.Context, blog *repository.Blog) (*repository.Blog, error) {
	if exists, _ := br.queries.UserExists(ctx, blog.Author); !exists {
		return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "author with ID %d does not exist", blog.Author)
	}

	blogId, err := br.queries.CreateBlog(ctx, generated.CreateBlogParams{
		Title:       blog.Title,
		Author:      blog.Author,
		CoverImg:    blog.CoverImg,
		Topic:       blog.Topic,
		Description: blog.Description,
		Content:     blog.Content,
		MinRead:     blog.MinRead,
		UpdatedBy:   blog.UpdatedBy,
		CreatedBy:   blog.CreatedBy,
	})
	if err != nil {
		if pkg.PgxErrorCode(err) == pkg.UNIQUE_VIOLATION {
			return nil, pkg.Errorf(pkg.ALREADY_EXISTS_ERROR, "blog with title %s already exists", blog.Title)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error creating blog: %s", err.Error())
	}

	return br.GetBlog(ctx, blogId)
}

func (br *BlogRepository) GetBlog(ctx context.Context, id int64) (*repository.Blog, error) {
	blog, err := br.queries.GetBlog(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "blog with ID %d not found", id)
		}
		return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "blog with ID %d not found", id)
	}

	rslt := &repository.Blog{
		ID:            blog.ID,
		Title:         blog.Title,
		Author:        blog.Author,
		CoverImg:      blog.CoverImg,
		Topic:         blog.Topic,
		Description:   blog.Description,
		Content:       blog.Content,
		Views:         blog.Views,
		MinRead:       blog.MinRead,
		Published:     blog.Published,
		PublishedAt:   nil,
		UpdatedBy:     blog.UpdatedBy,
		UpdatedAt:     blog.UpdatedAt,
		DeletedBy:     nil,
		DeletedAt:     nil,
		CreatedBy:     blog.CreatedBy,
		CreatedAt:     blog.CreatedAt,
		AuthorDetails: &repository.User{},
	}

	if blog.PublishedAt.Valid {
		rslt.PublishedAt = &blog.PublishedAt.Time
	}
	if blog.DeletedBy.Valid {
		rslt.DeletedBy = &blog.DeletedBy.Int64
	}
	if blog.DeletedAt.Valid {
		rslt.DeletedAt = &blog.DeletedAt.Time
	}

	if err := json.Unmarshal(blog.AuthorDetails, &rslt.AuthorDetails); err != nil {
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error unmarshalling author details: %s", err.Error())
	}

	return rslt, nil
}

func (br *BlogRepository) GetPublishedBlog(ctx context.Context, id int64) (*repository.Blog, error) {
	blog, err := br.queries.GetPublishedBlog(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "blog with ID %d not found or isnt published yet", id)
		}
		return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "blog with ID %d fetch error", id)
	}

	rslt := &repository.Blog{
		ID:            blog.ID,
		Title:         blog.Title,
		Author:        blog.Author,
		CoverImg:      blog.CoverImg,
		Topic:         blog.Topic,
		Description:   blog.Description,
		Content:       blog.Content,
		Views:         blog.Views,
		MinRead:       blog.MinRead,
		Published:     blog.Published,
		PublishedAt:   nil,
		UpdatedBy:     blog.UpdatedBy,
		UpdatedAt:     blog.UpdatedAt,
		DeletedBy:     nil,
		DeletedAt:     nil,
		CreatedBy:     blog.CreatedBy,
		CreatedAt:     blog.CreatedAt,
		AuthorDetails: &repository.User{},
	}

	if blog.PublishedAt.Valid {
		rslt.PublishedAt = &blog.PublishedAt.Time
	}
	if blog.DeletedBy.Valid {
		rslt.DeletedBy = &blog.DeletedBy.Int64
	}
	if blog.DeletedAt.Valid {
		rslt.DeletedAt = &blog.DeletedAt.Time
	}

	if err := json.Unmarshal(blog.AuthorDetails, &rslt.AuthorDetails); err != nil {
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error unmarshalling author details: %s", err.Error())
	}

	return rslt, nil
}

func (br *BlogRepository) UpdateBlog(ctx context.Context, blog *repository.UpdateBlog) (*repository.Blog, error) {
	updateParams := generated.UpdateBlogParams{
		ID:          blog.ID,
		UpdatedBy:   blog.UpdatedBy,
		Title:       pgtype.Text{Valid: false},
		CoverImg:    pgtype.Text{Valid: false},
		Topic:       pgtype.Text{Valid: false},
		Description: pgtype.Text{Valid: false},
		Content:     pgtype.Text{Valid: false},
		Views:       pgtype.Int4{Valid: false},
		MinRead:     pgtype.Int4{Valid: false},
	}

	if blog.Title != nil {
		updateParams.Title = pgtype.Text{String: *blog.Title, Valid: true}
	}
	if blog.CoverImg != nil {
		updateParams.CoverImg = pgtype.Text{String: *blog.CoverImg, Valid: true}
	}
	if blog.Topic != nil {
		updateParams.Topic = pgtype.Text{String: *blog.Topic, Valid: true}
	}
	if blog.Description != nil {
		updateParams.Description = pgtype.Text{String: *blog.Description, Valid: true}
	}
	if blog.Content != nil {
		updateParams.Content = pgtype.Text{String: *blog.Content, Valid: true}
	}
	if blog.Views != nil {
		updateParams.Views = pgtype.Int4{Int32: *blog.Views, Valid: true}
	}
	if blog.MinRead != nil {
		updateParams.MinRead = pgtype.Int4{Int32: *blog.MinRead, Valid: true}
	}

	if err := br.queries.UpdateBlog(ctx, updateParams); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "blog with ID %d not found", blog.ID)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error updating blog: %s", err.Error())
	}

	return br.GetBlog(ctx, blog.ID)
}

func (br *BlogRepository) PublishBlog(ctx context.Context, blogID int64, userID int64) (*repository.Blog, error) {
	if err := br.queries.PublishBlog(ctx, generated.PublishBlogParams{
		ID:        blogID,
		UpdatedBy: userID,
	}); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "blog with ID %d not found", blogID)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error publishing blog: %s", err.Error())
	}

	return br.GetBlog(ctx, blogID)
}

func (br *BlogRepository) ListBlogs(ctx context.Context, filter *repository.BlogFilter) ([]*repository.Blog, *pkg.Pagination, error) {
	listParams := generated.ListBlogsParams{
		Limit:     int32(filter.Pagination.PageSize),
		Offset:    pkg.Offset(filter.Pagination.Page, filter.Pagination.PageSize),
		Search:    pgtype.Text{Valid: false},
		Published: pgtype.Bool{Valid: false},
		Author:    pgtype.Int8{Valid: false},
	}

	countParams := generated.CountBlogsParams{
		Search:    pgtype.Text{Valid: false},
		Published: pgtype.Bool{Valid: false},
		Author:    pgtype.Int8{Valid: false},
	}

	if filter.Search != nil {
		search := "%" + *filter.Search + "%"
		listParams.Search = pgtype.Text{String: search, Valid: true}
		countParams.Search = pgtype.Text{String: search, Valid: true}
	}

	if filter.Published != nil {
		listParams.Published = pgtype.Bool{Bool: *filter.Published, Valid: true}
		countParams.Published = pgtype.Bool{Bool: *filter.Published, Valid: true}
	}

	if filter.Author != nil {
		listParams.Author = pgtype.Int8{Int64: *filter.Author, Valid: true}
		countParams.Author = pgtype.Int8{Int64: *filter.Author, Valid: true}
	}

	blogs, err := br.queries.ListBlogs(ctx, listParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error listing blogs: %s", err.Error())
	}

	count, err := br.queries.CountBlogs(ctx, countParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error counting blogs: %s", err.Error())
	}

	result := make([]*repository.Blog, len(blogs))
	for i, blog := range blogs {
		result[i] = &repository.Blog{
			ID:          blog.ID,
			Title:       blog.Title,
			Author:      blog.Author,
			CoverImg:    blog.CoverImg,
			Topic:       blog.Topic,
			Description: blog.Description,
			Content:     blog.Content,
			Views:       blog.Views,
			MinRead:     blog.MinRead,
			Published:   blog.Published,
			PublishedAt: nil,
			UpdatedBy:   blog.UpdatedBy,
			UpdatedAt:   blog.UpdatedAt,
			DeletedBy:   nil,
			DeletedAt:   nil,
			CreatedBy:   blog.CreatedBy,
			CreatedAt:   blog.CreatedAt,
		}

		if blog.PublishedAt.Valid {
			result[i].PublishedAt = &blog.PublishedAt.Time
		}
		if blog.DeletedBy.Valid {
			result[i].DeletedBy = &blog.DeletedBy.Int64
		}
		if blog.DeletedAt.Valid {
			result[i].DeletedAt = &blog.DeletedAt.Time
		}

		if err := json.Unmarshal(blog.AuthorDetails, &result[i].AuthorDetails); err != nil {
			return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error unmarshalling author details: %s", err.Error())
		}
	}

	return result, pkg.CalculatePagination(uint32(count), filter.Pagination.PageSize, filter.Pagination.Page), nil
}

func (br *BlogRepository) DeleteBlog(ctx context.Context, blogID int64, userID int64) error {
	if err := br.queries.DeleteBlog(ctx, generated.DeleteBlogParams{
		ID:        blogID,
		DeletedBy: pgtype.Int8{Int64: userID, Valid: true},
	}); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return pkg.Errorf(pkg.NOT_FOUND_ERROR, "blog with ID %d not found", blogID)
		}
		return pkg.Errorf(pkg.INTERNAL_ERROR, "error deleting blog: %s", err.Error())
	}
	return nil
}
