package postgres

import (
	"context"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/internal/postgres/generated"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/internal/repository"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
	"github.com/jackc/pgx/v5/pgtype"
)

func (a *AuctionRepository) CreateWatcher(ctx context.Context, watcher *repository.Watcher) (*repository.Watcher, error) {
	exists, err := a.queries.IsUserWatchingAuction(ctx, generated.IsUserWatchingAuctionParams{
		UserID:    watcher.UserID,
		AuctionID: watcher.AuctionID,
	})
	if err != nil {
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to check if user is already watching auction: %s", err)
	}

	err = a.db.ExecTx(ctx, func(q *generated.Queries) error {
		status := "active"
		if exists {
			// update watch status
			updatedWatcher, err := q.UpdateWatcherStatus(ctx, generated.UpdateWatcherStatusParams{
				UserID:    watcher.UserID,
				AuctionID: watcher.AuctionID,
				Status:    watcher.Status,
			})
			if err != nil {
				return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to update watcher status: %s", err.Error())
			}
			status = updatedWatcher.Status
		} else {
			// Proceed to create watcher
			_, err := q.CreateWatcher(ctx, generated.CreateWatcherParams{
				UserID:    watcher.UserID,
				AuctionID: watcher.AuctionID,
			})
			if err != nil {
				if pkg.PgxErrorCode(err) == pkg.FOREIGN_KEY_VIOLATION {
					return pkg.Errorf(pkg.NOT_FOUND_ERROR, "user with id %d or auction with id %d not found", watcher.UserID, watcher.AuctionID)
				}
				return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to create watcher: %s", err.Error())
			}
		}

		if status != "active" {
			_, err = q.UpdateAuctionStats(ctx, generated.UpdateAuctionStatsParams{
				ID:         watcher.AuctionID,
				Watchers:   pgtype.Int8{Valid: true, Int64: 1},
				BidsCount:  pgtype.Int8{Valid: false},
				CurrentBid: pgtype.Numeric{Valid: false},
			})
			if err != nil {
				return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to update auction stats after adding watcher: %s", err.Error())
			}
		} else {
			_, err = q.UpdateAuctionStats(ctx, generated.UpdateAuctionStatsParams{
				ID:         watcher.AuctionID,
				Watchers:   pgtype.Int8{Valid: true, Int64: -1},
				BidsCount:  pgtype.Int8{Valid: false},
				CurrentBid: pgtype.Numeric{Valid: false},
			})
			if err != nil {
				return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to update auction stats after adding watcher: %s", err.Error())
			}
		}

		return nil
	})
	if err != nil {
		return nil, err
	}

	return watcher, nil
}

func (a *AuctionRepository) GetWatchersWithActiveDeviceTokens(ctx context.Context, auctionId int64) ([]string, error) {
	deviceTokens, err := a.queries.GetActiveDeviceTokenByActiveAuctionWatchers(ctx, auctionId)
	if err != nil {
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to get watchers with active device tokens: %s", err.Error())
	}

	return deviceTokens, nil
}
