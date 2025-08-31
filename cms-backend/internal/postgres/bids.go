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

func (a *AuctionRepository) CreateBid(ctx context.Context, bid *repository.Bid) (*repository.Bid, error) {
	exists, err := a.queries.CheckUserBidExists(ctx, generated.CheckUserBidExistsParams{
		UserID:    bid.UserID,
		AuctionID: bid.AuctionID,
	})
	if err != nil {
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to check bid user existence with auction: %s", err.Error())
	}

	err = a.db.ExecTx(ctx, func(q *generated.Queries) error {
		// check if bid greater than current highest bid
		currentAuction, err := q.GetAuctionByID(ctx, bid.AuctionID)
		if err != nil {
			if errors.Is(err, sql.ErrNoRows) {
				return pkg.Errorf(pkg.NOT_FOUND_ERROR, "auction with id %d not found", bid.AuctionID)
			}
			return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to get auction by id: %s", err.Error())
		}

		if pkg.PgTypeNumericToFloat64(currentAuction.CurrentBid) >= bid.Amount {
			return pkg.Errorf(pkg.INVALID_ERROR, "bid amount must be greater than current highest bid of %.2f", pkg.PgTypeNumericToFloat64(currentAuction.CurrentBid))
		}

		if exists {
			if err := q.UpdateBid(ctx, generated.UpdateBidParams{
				UserID:    bid.UserID,
				AuctionID: bid.AuctionID,
				Amount:    pkg.Float64ToPgTypeNumeric(bid.Amount),
			}); err != nil {
				if pkg.PgxErrorCode(err) == pkg.FOREIGN_KEY_VIOLATION {
					return pkg.Errorf(pkg.NOT_FOUND_ERROR, "user with id %d or auction with id %d not found", bid.UserID, bid.AuctionID)
				}

				return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to update bid: %s", err.Error())
			}
			_, err = q.UpdateAuctionStats(ctx, generated.UpdateAuctionStatsParams{
				ID:         bid.AuctionID,
				CurrentBid: pkg.Float64ToPgTypeNumeric(bid.Amount),
				BidsCount:  pgtype.Int8{Valid: false},
				Watchers:   pgtype.Int8{Valid: false},
			})
			if err != nil {
				return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to update auction stats after creating bid: %s", err.Error())
			}
		} else {
			user, err := q.GetUser(ctx, bid.UserID)
			if err != nil {
				if errors.Is(err, sql.ErrNoRows) {
					return pkg.Errorf(pkg.NOT_FOUND_ERROR, "user with id %d not found", bid.UserID)
				}
				return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to get user by id: %s", err.Error())
			}

			bid.UserIdentifier = user.FullName[:3] + "****" + user.PhoneNumber[len(user.PhoneNumber)-3:]

			if err := q.CreateBid(ctx, generated.CreateBidParams{
				UserID:         bid.UserID,
				AuctionID:      bid.AuctionID,
				UserIdentifier: bid.UserIdentifier,
				Amount:         pkg.Float64ToPgTypeNumeric(bid.Amount),
			}); err != nil {
				if pkg.PgxErrorCode(err) == pkg.FOREIGN_KEY_VIOLATION {
					return pkg.Errorf(pkg.NOT_FOUND_ERROR, "user with id %d or auction with id %d not found", bid.UserID, bid.AuctionID)
				}
				return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to create bid: %s", err.Error())
			}

			_, err = q.UpdateAuctionStats(ctx, generated.UpdateAuctionStatsParams{
				ID:         bid.AuctionID,
				BidsCount:  pgtype.Int8{Valid: true, Int64: 1},
				CurrentBid: pkg.Float64ToPgTypeNumeric(bid.Amount),
				Watchers:   pgtype.Int8{Valid: false},
			})
			if err != nil {
				return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to update auction stats after creating bid: %s", err.Error())
			}
		}

		return nil
	})
	if err != nil {
		return nil, err
	}

	return bid, nil
}

func (a *AuctionRepository) GetBids(ctx context.Context, filter *repository.BidFilter) ([]*repository.Bid, *pkg.Pagination, error) {
	listParams := generated.GetBidsByAuctionIDFullDataParams{
		Limit:     int32(filter.Pagination.PageSize),
		Offset:    pkg.Offset(filter.Pagination.Page, filter.Pagination.PageSize),
		AuctionID: filter.AuctionID,
	}

	bids, err := a.queries.GetBidsByAuctionIDFullData(ctx, listParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to get bids: %s", err.Error())
	}

	count, err := a.queries.CountBidsByAuctionID(ctx, filter.AuctionID)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to count bids: %s", err.Error())
	}

	result := make([]*repository.Bid, len(bids))
	for i, bid := range bids {
		result[i] = &repository.Bid{
			ID:             bid.ID,
			UserID:         bid.UserID,
			AuctionID:      bid.AuctionID,
			UserIdentifier: bid.UserIdentifier,
			Amount:         pkg.PgTypeNumericToFloat64(bid.Amount),
			CreatedAt:      bid.CreatedAt,
			UserDetails: struct {
				UserID   int64  `json:"user_id"`
				FullName string `json:"full_name"`
				Email    string `json:"email"`
			}{
				UserID:   bid.UserID,
				FullName: bid.FullName,
				Email:    bid.Email,
			},
		}
	}

	return result, pkg.CalculatePagination(uint32(count), filter.Pagination.PageSize, filter.Pagination.Page), nil
}
