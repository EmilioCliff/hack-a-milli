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

var _ repository.NewsUpdateRepository = (*NewsUpdateRepository)(nil)

type NewsUpdateRepository struct {
	queries *generated.Queries
}

func NewNewsUpdateRepository(queries *generated.Queries) *NewsUpdateRepository {
	return &NewsUpdateRepository{queries: queries}
}

func (nr *NewsUpdateRepository) CreateNewsUpdate(ctx context.Context, newsUpdate *repository.NewsUpdate) (*repository.NewsUpdate, error) {
	newsUpdateID, err := nr.queries.CreateNewsUpdate(ctx, generated.CreateNewsUpdateParams{
		Title:     newsUpdate.Title,
		Topic:     newsUpdate.Topic,
		Date:      newsUpdate.Date,
		MinRead:   newsUpdate.MinRead,
		Content:   newsUpdate.Content,
		CoverImg:  newsUpdate.CoverImg,
		UpdatedBy: newsUpdate.UpdatedBy,
		CreatedBy: newsUpdate.CreatedBy,
	})
	if err != nil {
		if pkg.PgxErrorCode(err) == pkg.UNIQUE_VIOLATION {
			return nil, pkg.Errorf(pkg.ALREADY_EXISTS_ERROR, "news update with title %s already exists", newsUpdate.Title)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error creating news update: %s", err.Error())
	}

	return nr.GetNewsUpdate(ctx, newsUpdateID)
}

func (nr *NewsUpdateRepository) GetNewsUpdate(ctx context.Context, id int64) (*repository.NewsUpdate, error) {
	newsUpdate, err := nr.queries.GetNewsUpdate(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "news update with ID %d not found", id)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error retrieving news update: %s", err.Error())
	}

	rslt := &repository.NewsUpdate{
		ID:          newsUpdate.ID,
		Title:       newsUpdate.Title,
		Topic:       newsUpdate.Topic,
		Date:        newsUpdate.Date,
		MinRead:     newsUpdate.MinRead,
		Content:     newsUpdate.Content,
		CoverImg:    newsUpdate.CoverImg,
		Published:   newsUpdate.Published,
		PublishedAt: nil,
		UpdatedBy:   newsUpdate.UpdatedBy,
		UpdatedAt:   newsUpdate.UpdatedAt,
		CreatedAt:   newsUpdate.CreatedAt,
		CreatedBy:   newsUpdate.CreatedBy,
		DeletedBy:   nil,
		DeletedAt:   nil,
	}

	if newsUpdate.PublishedAt.Valid {
		rslt.PublishedAt = &newsUpdate.PublishedAt.Time
	}
	if newsUpdate.DeletedBy.Valid {
		rslt.DeletedBy = &newsUpdate.DeletedBy.Int64
	}
	if newsUpdate.DeletedAt.Valid {
		rslt.DeletedAt = &newsUpdate.DeletedAt.Time
	}

	return rslt, nil
}

func (nr *NewsUpdateRepository) ListNewsUpdate(ctx context.Context, filter *repository.NewsUpdateFilter) ([]*repository.NewsUpdate, *pkg.Pagination, error) {
	listParams := generated.ListNewsUpdatesParams{
		Limit:     int32(filter.Pagination.PageSize),
		Offset:    pkg.Offset(filter.Pagination.Page, filter.Pagination.PageSize),
		Search:    pgtype.Text{Valid: false},
		Published: pgtype.Bool{Valid: false},
		StartDate: pgtype.Timestamptz{Valid: false},
		EndDate:   pgtype.Timestamptz{Valid: false},
	}

	countParams := generated.CountNewsUpdatesParams{
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

	newsUpdates, err := nr.queries.ListNewsUpdates(ctx, listParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error listing news updates: %s", err.Error())
	}
	count, err := nr.queries.CountNewsUpdates(ctx, countParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error counting news updates: %s", err.Error())
	}

	rslt := make([]*repository.NewsUpdate, len(newsUpdates))
	for i, newsUpdate := range newsUpdates {
		rslt[i] = &repository.NewsUpdate{
			ID:        newsUpdate.ID,
			Title:     newsUpdate.Title,
			Topic:     newsUpdate.Topic,
			Date:      newsUpdate.Date,
			MinRead:   newsUpdate.MinRead,
			Content:   newsUpdate.Content,
			CoverImg:  newsUpdate.CoverImg,
			UpdatedBy: newsUpdate.UpdatedBy,
			UpdatedAt: newsUpdate.UpdatedAt,
			CreatedAt: newsUpdate.CreatedAt,
			CreatedBy: newsUpdate.CreatedBy,
		}
	}

	return rslt, pkg.CalculatePagination(uint32(count), filter.Pagination.PageSize, filter.Pagination.Page), nil
}

func (nr *NewsUpdateRepository) PublishNewsUpdate(ctx context.Context, newsUpdateID int64, userID int64) (*repository.NewsUpdate, error) {
	newsUpdate, err := nr.queries.PublishNewsUpdate(ctx, generated.PublishNewsUpdateParams{
		ID:        newsUpdateID,
		UpdatedBy: userID,
	})
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "news update with ID %d not found", newsUpdateID)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error publishing news update: %s", err.Error())
	}

	return &repository.NewsUpdate{
		ID:        newsUpdate.ID,
		Title:     newsUpdate.Title,
		Topic:     newsUpdate.Topic,
		Date:      newsUpdate.Date,
		MinRead:   newsUpdate.MinRead,
		Content:   newsUpdate.Content,
		CoverImg:  newsUpdate.CoverImg,
		UpdatedBy: newsUpdate.UpdatedBy,
		UpdatedAt: newsUpdate.UpdatedAt,
		CreatedAt: newsUpdate.CreatedAt,
		CreatedBy: newsUpdate.CreatedBy,
	}, nil
}

func (nr *NewsUpdateRepository) UpdateNewsUpdate(ctx context.Context, newsUpdate *repository.UpdateNewsUpdate) (*repository.NewsUpdate, error) {
	updateParams := generated.UpdateNewsUpdateParams{
		ID:        newsUpdate.ID,
		UpdatedBy: newsUpdate.UpdatedBy,
		Title:     pgtype.Text{Valid: false},
		Topic:     pgtype.Text{Valid: false},
		Date:      pgtype.Timestamptz{Valid: false},
		MinRead:   pgtype.Int4{Valid: false},
		Content:   pgtype.Text{Valid: false},
		CoverImg:  pgtype.Text{Valid: false},
	}

	if newsUpdate.Title != nil {
		updateParams.Title = pgtype.Text{String: *newsUpdate.Title, Valid: true}
	}
	if newsUpdate.Topic != nil {
		updateParams.Topic = pgtype.Text{String: *newsUpdate.Topic, Valid: true}
	}
	if newsUpdate.Date != nil {
		updateParams.Date = pgtype.Timestamptz{Time: *newsUpdate.Date, Valid: true}
	}
	if newsUpdate.MinRead != nil {
		updateParams.MinRead = pgtype.Int4{Int32: *newsUpdate.MinRead, Valid: true}
	}
	if newsUpdate.Content != nil {
		updateParams.Content = pgtype.Text{String: *newsUpdate.Content, Valid: true}
	}
	if newsUpdate.CoverImg != nil {
		updateParams.CoverImg = pgtype.Text{String: *newsUpdate.CoverImg, Valid: true}
	}

	if err := nr.queries.UpdateNewsUpdate(ctx, updateParams); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "news update with ID %d not found", newsUpdate.ID)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error updating news update: %s", err.Error())
	}

	return nr.GetNewsUpdate(ctx, newsUpdate.ID)
}

func (nr *NewsUpdateRepository) DeleteNewsUpdate(ctx context.Context, newsUpdateID int64, userID int64) error {
	if err := nr.queries.DeleteNewsUpdate(ctx, generated.DeleteNewsUpdateParams{
		ID:        newsUpdateID,
		DeletedBy: pgtype.Int8{Int64: userID, Valid: true},
	}); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return pkg.Errorf(pkg.NOT_FOUND_ERROR, "news update with ID %d not found", newsUpdateID)
		}
		return pkg.Errorf(pkg.INTERNAL_ERROR, "error deleting news update: %s", err.Error())
	}
	return nil
}
