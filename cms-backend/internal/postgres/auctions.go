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

var _ repository.AuctionRepository = (*AuctionRepository)(nil)

type AuctionRepository struct {
	queries *generated.Queries
	db      *Store
}

func NewAuctionRepository(db *Store) *AuctionRepository {
	return &AuctionRepository{queries: generated.New(db.pool), db: db}
}

func (a *AuctionRepository) CreateAuction(ctx context.Context, auction *repository.Auction) (*repository.Auction, error) {
	exists, err := a.queries.CheckAuctionDomainExistsAndActive(ctx, auction.Domain)
	if err != nil {
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to check auction domain existence: %s", err)
	}
	if exists {
		return nil, pkg.Errorf(pkg.ALREADY_EXISTS_ERROR, "auction with domain %s already exists and is active", auction.Domain)
	}

	createdAuction, err := a.queries.CreateAuction(ctx, generated.CreateAuctionParams{
		Domain:      auction.Domain,
		Category:    auction.Category,
		Description: auction.Description,
		CurrentBid:  pkg.Float64ToPgTypeNumeric(auction.CurrentBid),
		StartPrice:  pkg.Float64ToPgTypeNumeric(auction.StartPrice),
		StartTime:   auction.StartTime,
		EndTime:     auction.EndTime,
		CreatedBy:   auction.CreatedBy,
		UpdatedBy:   auction.UpdatedBy,
	})
	if err != nil {
		if pkg.PgxErrorCode(err) == pkg.UNIQUE_VIOLATION {
			return nil, pkg.Errorf(pkg.ALREADY_EXISTS_ERROR, "auction with domain %s already exists", auction.Domain)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to create auction: %s", err.Error())
	}

	auction.ID = createdAuction.ID
	auction.Watchers = createdAuction.Watchers
	auction.BidsCount = createdAuction.BidsCount
	auction.CreatedAt = createdAuction.CreatedAt
	auction.UpdatedAt = createdAuction.UpdatedAt
	auction.Status = createdAuction.Status

	return auction, nil
}

func (a *AuctionRepository) UpdateAuction(ctx context.Context, auction *repository.UpdateAuction) (*repository.Auction, error) {
	params := generated.UpdateAuctionParams{
		ID:          auction.ID,
		UpdatedBy:   auction.UpdatedBy,
		Domain:      pgtype.Text{Valid: false},
		Category:    pgtype.Text{Valid: false},
		Description: pgtype.Text{Valid: false},
		StartPrice:  pgtype.Numeric{Valid: false},
		StartTime:   pgtype.Timestamptz{Valid: false},
		EndTime:     pgtype.Timestamptz{Valid: false},
		Status:      pgtype.Text{Valid: false},
	}

	if auction.Domain != nil {
		params.Domain = pgtype.Text{String: *auction.Domain, Valid: true}
	}
	if auction.Category != nil {
		params.Category = pgtype.Text{String: *auction.Category, Valid: true}
	}
	if auction.Description != nil {
		params.Description = pgtype.Text{String: *auction.Description, Valid: true}
	}
	if auction.StartPrice != nil {
		params.StartPrice = pkg.Float64ToPgTypeNumeric(*auction.StartPrice)
	}
	if auction.StartTime != nil {
		params.StartTime = pgtype.Timestamptz{Time: *auction.StartTime, Valid: true}
	}
	if auction.EndTime != nil {
		params.EndTime = pgtype.Timestamptz{Time: *auction.EndTime, Valid: true}
	}
	if auction.Status != nil {
		params.Status = pgtype.Text{String: *auction.Status, Valid: true}
	}

	updatedAuction, err := a.queries.UpdateAuction(ctx, params)
	if err != nil {
		if pkg.PgxErrorCode(err) == pkg.UNIQUE_VIOLATION {
			return nil, pkg.Errorf(pkg.ALREADY_EXISTS_ERROR, "auction with domain %s already exists", *auction.Domain)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to update auction: %s", err.Error())
	}

	return generationAuctionToRepository(updatedAuction), nil
}

func (a *AuctionRepository) GetAuctionByID(ctx context.Context, id int64) (*repository.Auction, error) {
	auction, err := a.queries.GetAuctionByID(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "auction with id %d not found", id)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to get auction by id: %s", err.Error())
	}

	return generationAuctionToRepository(auction), nil
}

func (a *AuctionRepository) GetAuctions(ctx context.Context, filter *repository.AuctionFilter) ([]*repository.Auction, *pkg.Pagination, error) {
	listParams := generated.ListAuctionsParams{
		Limit:    int32(filter.Pagination.PageSize),
		Offset:   pkg.Offset(filter.Pagination.Page, filter.Pagination.PageSize),
		Search:   pgtype.Text{Valid: false},
		Category: pgtype.Text{Valid: false},
		Status:   pgtype.Text{Valid: false},
	}

	countParams := generated.CountAuctionsParams{
		Search:   pgtype.Text{Valid: false},
		Category: pgtype.Text{Valid: false},
		Status:   pgtype.Text{Valid: false},
	}

	if filter.Search != nil {
		listParams.Search = pgtype.Text{String: *filter.Search, Valid: true}
		countParams.Search = pgtype.Text{String: *filter.Search, Valid: true}
	}
	if filter.Category != nil {
		listParams.Category = pgtype.Text{String: *filter.Category, Valid: true}
		countParams.Category = pgtype.Text{String: *filter.Category, Valid: true}
	}
	if filter.Status != nil {
		listParams.Status = pgtype.Text{String: *filter.Status, Valid: true}
		countParams.Status = pgtype.Text{String: *filter.Status, Valid: true}
	}

	auctions, err := a.queries.ListAuctions(ctx, listParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to list auctions: %s", err.Error())
	}

	count, err := a.queries.CountAuctions(ctx, countParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to count auctions: %s", err.Error())
	}

	result := make([]*repository.Auction, len(auctions))
	for i, auction := range auctions {
		rsp := &repository.Auction{
			ID:          auction.ID,
			Domain:      auction.Domain,
			Category:    auction.Category,
			Description: auction.Description,
			CurrentBid:  pkg.PgTypeNumericToFloat64(auction.CurrentBid),
			StartPrice:  pkg.PgTypeNumericToFloat64(auction.StartPrice),
			StartTime:   auction.StartTime,
			EndTime:     auction.EndTime,
			Watchers:    auction.Watchers,
			BidsCount:   auction.BidsCount,
			Status:      auction.Status,
			CreatedBy:   auction.CreatedBy,
			CreatedAt:   auction.CreatedAt,
			UpdatedBy:   auction.UpdatedBy,
			UpdatedAt:   auction.UpdatedAt,
		}

		if err := json.Unmarshal(auction.TopFourBids, &rsp.TopFourBids); err != nil {
			return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error unmarshalling top four bids: %s", err.Error())
		}

		result[i] = rsp
	}

	return result, pkg.CalculatePagination(uint32(count), filter.Pagination.PageSize, filter.Pagination.Page), nil
}

func (a *AuctionRepository) DeleteAuction(ctx context.Context, id int64, userId int64) error {
	err := a.queries.DeleteAuction(ctx, generated.DeleteAuctionParams{
		ID:        id,
		UpdatedBy: userId,
	})
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return pkg.Errorf(pkg.NOT_FOUND_ERROR, "auction with id %d not found", id)
		}
		return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to delete auction: %s", err.Error())
	}
	return nil
}

func generationAuctionToRepository(ga generated.Auction) *repository.Auction {
	return &repository.Auction{
		ID:          ga.ID,
		Domain:      ga.Domain,
		Category:    ga.Category,
		Description: ga.Description,
		CurrentBid:  pkg.PgTypeNumericToFloat64(ga.CurrentBid),
		StartPrice:  pkg.PgTypeNumericToFloat64(ga.StartPrice),
		StartTime:   ga.StartTime,
		EndTime:     ga.EndTime,
		Watchers:    ga.Watchers,
		BidsCount:   ga.BidsCount,
		Status:      ga.Status,
		CreatedBy:   ga.CreatedBy,
		CreatedAt:   ga.CreatedAt,
		UpdatedBy:   ga.UpdatedBy,
		UpdatedAt:   ga.UpdatedAt,
	}
}
