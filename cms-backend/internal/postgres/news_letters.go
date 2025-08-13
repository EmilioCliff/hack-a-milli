package postgres

import (
	"context"
	"database/sql"
	"errors"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/internal/postgres/generated"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/internal/repository"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
	"github.com/jackc/pgx/v5/pgtype"
)

func (nr *NewsUpdateRepository) CreateNewsLetter(ctx context.Context, newsLetter *repository.NewsLetter) (*repository.NewsLetter, error) {
	createParams := generated.CreateNewsLetterParams{
		Title:       newsLetter.Title,
		Description: newsLetter.Description,
		PdfUrl:      newsLetter.PdfUrl,
		Date:        newsLetter.Date,
		UpdatedBy:   newsLetter.UpdatedBy,
		CreatedBy:   newsLetter.CreatedBy,
	}

	newsLetterID, err := nr.queries.CreateNewsLetter(ctx, createParams)
	if err != nil {
		if pkg.PgxErrorCode(err) == pkg.UNIQUE_VIOLATION {
			return nil, pkg.Errorf(pkg.ALREADY_EXISTS_ERROR, "newsletter with title %s already exists", newsLetter.Title)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error creating newsletter: %s", err.Error())
	}

	return nr.GetNewsLetter(ctx, newsLetterID)
}

func (nr *NewsUpdateRepository) GetNewsLetter(ctx context.Context, id int64) (*repository.NewsLetter, error) {
	newsLetter, err := nr.queries.GetNewsLetter(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "newsletter with ID %d not found", id)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error retrieving newsletter: %s", err.Error())
	}

	rslt := &repository.NewsLetter{
		ID:          newsLetter.ID,
		Title:       newsLetter.Title,
		Description: newsLetter.Description,
		PdfUrl:      newsLetter.PdfUrl,
		Date:        newsLetter.Date,
		UpdatedBy:   newsLetter.UpdatedBy,
		PublishedAt: nil,
		Published:   newsLetter.Published,
		UpdatedAt:   newsLetter.UpdatedAt,
		CreatedBy:   newsLetter.CreatedBy,
		CreatedAt:   newsLetter.CreatedAt,
		DeletedBy:   nil,
		DeletedAt:   nil,
	}

	if newsLetter.PublishedAt.Valid {
		rslt.PublishedAt = &newsLetter.PublishedAt.Time
	}
	if newsLetter.DeletedBy.Valid {
		rslt.DeletedBy = &newsLetter.DeletedBy.Int64
	}
	if newsLetter.DeletedAt.Valid {
		rslt.DeletedAt = &newsLetter.DeletedAt.Time
	}

	return rslt, nil
}

func (nr *NewsUpdateRepository) ListNewsLetters(ctx context.Context, filter *repository.NewsLetterFilter) ([]*repository.NewsLetter, *pkg.Pagination, error) {
	listParams := generated.ListNewsLettersParams{
		Limit:     int32(filter.Pagination.PageSize),
		Offset:    pkg.Offset(filter.Pagination.Page, filter.Pagination.PageSize),
		Search:    pgtype.Text{Valid: false},
		Published: pgtype.Bool{Valid: false},
		StartDate: pgtype.Timestamptz{Valid: false},
		EndDate:   pgtype.Timestamptz{Valid: false},
	}

	countParams := generated.CountNewsLettersParams{
		Search:    pgtype.Text{Valid: false},
		Published: pgtype.Bool{Valid: false},
		StartDate: pgtype.Timestamptz{Valid: false},
		EndDate:   pgtype.Timestamptz{Valid: false},
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
	if filter.StartDate != nil && filter.EndDate != nil {
		listParams.StartDate = pgtype.Timestamptz{Time: *filter.StartDate, Valid: true}
		listParams.EndDate = pgtype.Timestamptz{Time: *filter.EndDate, Valid: true}
		countParams.StartDate = pgtype.Timestamptz{Time: *filter.StartDate, Valid: true}
		countParams.EndDate = pgtype.Timestamptz{Time: *filter.EndDate, Valid: true}
	}

	newsLetters, err := nr.queries.ListNewsLetters(ctx, listParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error listing newsletters: %s", err.Error())
	}
	count, err := nr.queries.CountNewsLetters(ctx, countParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error counting newsletters: %s", err.Error())
	}

	cmsNewsLetters := make([]*repository.NewsLetter, len(newsLetters))
	for i, newsLetter := range newsLetters {
		cmsNewsLetters[i] = &repository.NewsLetter{
			ID:          newsLetter.ID,
			Title:       newsLetter.Title,
			Description: newsLetter.Description,
			PdfUrl:      newsLetter.PdfUrl,
			Date:        newsLetter.Date,
			UpdatedBy:   newsLetter.UpdatedBy,
			PublishedAt: nil,
			Published:   newsLetter.Published,
			UpdatedAt:   newsLetter.UpdatedAt,
			CreatedBy:   newsLetter.CreatedBy,
			CreatedAt:   newsLetter.CreatedAt,
			DeletedBy:   nil,
			DeletedAt:   nil,
		}

		if newsLetter.PublishedAt.Valid {
			cmsNewsLetters[i].PublishedAt = &newsLetter.PublishedAt.Time
		}
		if newsLetter.DeletedBy.Valid {
			cmsNewsLetters[i].DeletedBy = &newsLetter.DeletedBy.Int64
		}
		if newsLetter.DeletedAt.Valid {
			cmsNewsLetters[i].DeletedAt = &newsLetter.DeletedAt.Time
		}
	}

	return cmsNewsLetters, pkg.CalculatePagination(uint32(count), filter.Pagination.PageSize, filter.Pagination.Page), nil
}

func (nr *NewsUpdateRepository) PublishNewsLetter(ctx context.Context, newsLetterID int64, userID int64) (*repository.NewsLetter, error) {
	if err := nr.queries.PublishNewsLetter(ctx, generated.PublishNewsLetterParams{
		ID:        newsLetterID,
		UpdatedBy: userID,
	}); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "newsletter with ID %d not found", newsLetterID)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error publishing newsletter: %s", err.Error())
	}

	return nr.GetNewsLetter(ctx, newsLetterID)
}

func (nr *NewsUpdateRepository) UpdateNewsLetter(ctx context.Context, newsLetter *repository.UpdateNewsLetter) (*repository.NewsLetter, error) {
	updateParams := generated.UpdateNewsLetterParams{
		ID:          newsLetter.ID,
		UpdatedBy:   newsLetter.UpdatedBy,
		Title:       pgtype.Text{Valid: false},
		Description: pgtype.Text{Valid: false},
		PdfUrl:      pgtype.Text{Valid: false},
		Date:        pgtype.Timestamptz{Valid: false},
	}

	if newsLetter.Title != nil {
		updateParams.Title = pgtype.Text{String: *newsLetter.Title, Valid: true}
	}
	if newsLetter.Description != nil {
		updateParams.Description = pgtype.Text{String: *newsLetter.Description, Valid: true}
	}
	if newsLetter.PdfUrl != nil {
		updateParams.PdfUrl = pgtype.Text{String: *newsLetter.PdfUrl, Valid: true}
	}
	if newsLetter.Date != nil {
		updateParams.Date = pgtype.Timestamptz{Time: *newsLetter.Date, Valid: true}
	}

	if err := nr.queries.UpdateNewsLetter(ctx, updateParams); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "newsletter with ID %d not found", newsLetter.ID)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error updating newsletter: %s", err.Error())
	}

	return nr.GetNewsLetter(ctx, newsLetter.ID)
}

func (nr *NewsUpdateRepository) DeleteNewsLetter(ctx context.Context, newsLetterID int64, userID int64) error {
	if err := nr.queries.DeleteNewsLetter(ctx, generated.DeleteNewsLetterParams{
		ID:        newsLetterID,
		DeletedBy: pgtype.Int8{Int64: userID, Valid: true},
	}); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return pkg.Errorf(pkg.NOT_FOUND_ERROR, "newsletter with ID %d not found", newsLetterID)
		}
		return pkg.Errorf(pkg.INTERNAL_ERROR, "error deleting newsletter: %s", err.Error())
	}

	return nil
}
