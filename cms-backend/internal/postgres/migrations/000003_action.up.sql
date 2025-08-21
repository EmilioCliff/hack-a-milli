CREATE TABLE "auctions" (
    "id" bigserial NOT NULL PRIMARY KEY,
    "domain" varchar(255) UNIQUE NOT NULL,
    "category" varchar(50) NOT NULL CHECK (category IN ('gold', 'silver', 'platinum')),
    "description" text NOT NULL,
    "current_bid" numeric(10,2) NOT NULL,
    "start_price" numeric(10,2) NOT NULL,
    "start_time" timestamp with time zone NOT NULL,
    "end_time" timestamp with time zone NOT NULL,
    "watchers" bigint NOT NULL DEFAULT 0,
    "bids_count" bigint NOT NULL DEFAULT 0,
    "status" text NOT NULL CHECK (status IN ('active', 'completed', 'cancelled')),
    "created_by" bigint NOT NULL,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "updated_by" bigint NULL,
    "updated_at" timestamp with time zone NOT NULL DEFAULT now(),

    CONSTRAINT "auctions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users" ("id"),
    CONSTRAINT "auctions_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users" ("id")
);

CREATE TABLE "bids" (
    "id" bigserial NOT NULL PRIMARY KEY,
    "user_id" bigint NOT NULL,
    "auction_id" bigint NOT NULL,
    "user_identifier" varchar(50) NOT NULL,
    "amount" numeric(10,2) NOT NULL,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),

    CONSTRAINT "bids_unique" UNIQUE ("user_id", "auction_id"),
    CONSTRAINT "bids_auction_id_fkey" FOREIGN KEY ("auction_id") REFERENCES "auctions" ("id"),
    CONSTRAINT "bids_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id")
);
