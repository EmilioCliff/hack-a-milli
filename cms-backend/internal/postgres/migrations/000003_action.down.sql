ALTER TABLE "auctions" DROP CONSTRAINT "auctions_created_by_fkey";
ALTER TABLE "auctions" DROP CONSTRAINT "auctions_updated_by_fkey";
ALTER TABLE "bids" DROP CONSTRAINT "bids_auction_id_fkey";
ALTER TABLE "bids" DROP CONSTRAINT "bids_user_id_fkey";

DROP TABLE IF EXISTS auctions;
DROP TABLE IF EXISTS bids;