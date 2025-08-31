CREATE TABLE "user_chats" (
    "id" bigserial NOT NULL PRIMARY KEY,
    "title" text NOT NULL,
    "user_id" bigint NOT NULL,
    "messages" jsonb NOT NULL,
    "deleted_at" timestamptz,
    "created_at" timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT "user_chats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id")
);

CREATE TABLE "company_docs" (
    "id" bigserial NOT NULL PRIMARY KEY,
    "title" text NOT NULL,
    "content" text NOT NULL,
    "deleted_at" timestamptz,
    "created_at" timestamptz NOT NULL DEFAULT now()
);
