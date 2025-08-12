SET timezone = 'Africa/Nairobi';

CREATE TABLE "departments" (
  "id" bigserial PRIMARY KEY,
  "name" text NOT NULL
);

CREATE TABLE "users" (
  "id" bigserial PRIMARY KEY,
  "email" varchar(50) UNIQUE NOT NULL,
  "full_name" varchar(100) NOT NULL,
  "phone_number" varchar(50) NOT NULL,
  "address" text NOT NULL,
  "password_hash" text NOT NULL,
  "role" text[] NOT NULL, -- ('guest, 'staff', 'admin')
  "department_id" bigint NULL,
  "active" boolean NOT NULL DEFAULT true,
  "account_verified" boolean NOT NULL DEFAULT false,
  "multifactor_authentication" bool NOT NULL DEFAULT false,
  "updated_by" bigint NULL,
  "created_by" bigint NULL,
  "updated_at" timestamptz NOT NULL DEFAULT (now()),
  "created_at" timestamptz NOT NULL DEFAULT (now()),

  CONSTRAINT "users_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments" ("id"),
  CONSTRAINT "users_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users" ("id"),
  CONSTRAINT "users_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users" ("id")
);

CREATE TABLE "device_tokens" (
  "id" bigserial PRIMARY KEY,
  "user_id" bigint NOT NULL,
  "device_token" text NOT NULL,
  "platform" text NOT NULL,
  "active" boolean NOT NULL DEFAULT true, -- change to inactive after logout
  "created_at" timestamptz NOT NULL DEFAULT (now()),

  CONSTRAINT "device_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id")
);

CREATE TABLE "user_preferences" (
  "user_id" bigint NOT NULL PRIMARY KEY,
  "notify_news" boolean NOT NULL DEFAULT true,
  "notify_events" boolean NOT NULL DEFAULT true,
  "notify_training" boolean NOT NULL DEFAULT true,
  "notify_policy" boolean NOT NULL DEFAULT true,
  "updated_at" timestamptz NOT NULL DEFAULT (now()),
  "created_at" timestamptz NOT NULL DEFAULT (now()),

  CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id")
);

CREATE TABLE "registrars" (
  "id" bigserial PRIMARY KEY,
  "email" varchar(50) UNIQUE NOT NULL,
  "name" varchar(100) NOT NULL,
  "logo_url" text NOT NULL,
  "address" text NOT NULL,
  "specialities" text[] NOT NULL DEFAULT '{}',
  "phone_number" varchar(50) NOT NULL,
  "website_url" text NOT NULL,
  "updated_by" bigint NOT NULL,
  "created_by" bigint NOT NULL,
  "deleted_by" bigint,
  "deleted_at" timestamptz,
  "updated_at" timestamptz NOT NULL DEFAULT (now()),
  "created_at" timestamptz NOT NULL DEFAULT (now()),

  CONSTRAINT "registrars_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users" ("id"),
  CONSTRAINT "registrars_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "users" ("id"),
  CONSTRAINT "registrars_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users" ("id")
);

CREATE TABLE "products" (
  "id" bigserial PRIMARY KEY,
  "name" varchar(255) NOT NULL,
  "price" decimal(10,2) NOT NULL DEFAULT 0,
  "image_url" text[] NOT NULL,
  "description" text,
  "items_sold" int NOT NULL DEFAULT 0,
  "updated_by" bigint NOT NULL,
  "created_by" bigint NOT NULL,
  "deleted_by" bigint,
  "deleted_at" timestamptz,
  "updated_at" timestamptz NOT NULL DEFAULT (now()),
  "created_at" timestamptz NOT NULL DEFAULT (now()),

  CONSTRAINT "products_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users" ("id"),
  CONSTRAINT "products_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "users" ("id"),
  CONSTRAINT "products_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users" ("id")
);

CREATE TABLE "orders" (
  "id" bigserial PRIMARY KEY,
  "user_id" bigint NULL,
  "amount" decimal(10,2) NOT NULL,
  "status" varchar(50) NOT NULL CHECK (status IN ('pending', 'delivering', 'delivered', 'cancelled')),
  "payment_status" boolean NOT NULL DEFAULT false,
  "order_details" jsonb NOT NULL,
  "updated_by" bigint,
  "updated_at" timestamptz NOT NULL DEFAULT (now()),
  "created_at" timestamptz NOT NULL DEFAULT (now()),

  CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id"),
  CONSTRAINT "orders_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users" ("id")
);

CREATE TABLE "order_items" (
  "order_id" bigint NOT NULL,
  "product_id" bigint NOT NULL,
  "size" varchar(255) NOT NULL,
  "color" varchar(255) NOT NULL,
  "quantity" int NOT NULL DEFAULT 1,
  "amount" decimal(10,2) NOT NULL,

  CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders" ("id"),
  CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id")
);

CREATE TABLE "payments" (
  "id" bigserial PRIMARY KEY,
  "order_id" bigint NOT NULL,
  "payment_method" varchar(50) NOT NULL CHECK (payment_method IN ('mpesa', 'card', 'bank')),
  "amount" decimal(10,2) NOT NULL DEFAULT 0,
  "status" boolean NOT NULL DEFAULT false,
  "updated_by" bigint,
  "created_by" bigint,
  "updated_at" timestamptz NOT NULL DEFAULT (now()),
  "created_at" timestamptz NOT NULL DEFAULT (now()),

  CONSTRAINT "payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders" ("id"),
  CONSTRAINT "payments_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users" ("id"),
  CONSTRAINT "payments_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users" ("id")
);

CREATE TABLE "blogs" (
  "id" bigserial PRIMARY KEY,
  "title" varchar(255) NOT NULL,
  "author" bigint NOT NULL,
  "cover_img" text NOT NULL,
  "topic" varchar(100) NOT NULL,
  "description" text NOT NULL,
  "content" text NOT NULL,
  "views" int NOT NULL DEFAULT 0,
  "min_read" int NOT NULL,
  "published" boolean NOT NULL DEFAULT false,
  "published_at" timestamptz,
  "updated_by" bigint NOT NULL,
  "created_by" bigint NOT NULL,
  "deleted_by" bigint,
  "deleted_at" timestamptz,
  "updated_at" timestamptz NOT NULL DEFAULT (now()),
  "created_at" timestamptz NOT NULL DEFAULT (now()),

  CONSTRAINT "blogs_author_fkey" FOREIGN KEY ("author") REFERENCES "users" ("id"),
  CONSTRAINT "blogs_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users" ("id"),
  CONSTRAINT "blogs_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "users" ("id"),
  CONSTRAINT "blogs_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users" ("id")
);

CREATE TABLE "events" (
  "id" bigserial PRIMARY KEY,
  "title" varchar(255) NOT NULL,
  "topic" varchar(255) NOT NULL,
  "content" text NOT NULL,
  "cover_img" text NOT NULL,
  "start_time" timestamptz NOT NULL,
  "end_time" timestamptz NOT NULL,
  "status" varchar(255) NOT NULL CHECK (status IN ('upcoming', 'live', 'completed')),
  "venue" jsonb NOT NULL,
  "price" varchar(255) NOT NULL DEFAULT 'free',
  "agenda" jsonb NOT NULL,
  "tags" text[] NOT NULL DEFAULT '{}',
  "organizers" jsonb NOT NULL,
  "partners" jsonb NOT NULL,
  "speakers" jsonb NOT NULL,
  "published" boolean NOT NULL DEFAULT false,
  "published_at" timestamptz,
  "updated_by" bigint NOT NULL,
  "created_by" bigint NOT NULL,
  "max_attendees" int NOT NULL DEFAULT 500,
  "registered_attendees" int NOT NULL DEFAULT 0,
  "deleted_by" bigint,
  "deleted_at" timestamptz,
  "updated_at" timestamptz NOT NULL DEFAULT (now()),
  "created_at" timestamptz NOT NULL DEFAULT (now()),

  CONSTRAINT "events_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users" ("id"),
  CONSTRAINT "events_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "users" ("id"),
  CONSTRAINT "events_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users" ("id")
);

CREATE TABLE "event_registrants" (
  "id" bigserial PRIMARY KEY,
  "event_id" bigint NOT NULL,
  "name" varchar(100) NOT NULL,
  "email" varchar(100) NOT NULL,
  "registered_at" timestamptz NOT NULL DEFAULT (now()),

  CONSTRAINT "event_registrants_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events" ("id")
); 

CREATE TABLE "news_updates" (
  "id" bigserial PRIMARY KEY,
  "title" varchar(255) NOT NULL,
  "topic" varchar(255) NOT NULL,
  "date" timestamptz NOT NULL,
  "min_read" int NOT NULL,
  "content" text NOT NULL,
  "cover_img" text NOT NULL,
  "published" boolean NOT NULL DEFAULT false,
  "published_at" timestamptz,
  "updated_by" bigint NOT NULL,
  "created_by" bigint NOT NULL,
  "deleted_by" bigint,
  "deleted_at" timestamptz,
  "updated_at" timestamptz NOT NULL DEFAULT (now()),
  "created_at" timestamptz NOT NULL DEFAULT (now()),

  CONSTRAINT "news_updates_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users" ("id"),
  CONSTRAINT "news_updates_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "users" ("id"),
  CONSTRAINT "news_updates_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users" ("id")
);

CREATE TABLE "news_letters" (
  "id" bigserial PRIMARY KEY,
  "title" varchar(255) NOT NULL,
  "description" text NOT NULL,
  "pdf_url" text NOT NULL,
  "date" timestamptz NOT NULL,
  "published" boolean NOT NULL DEFAULT false,
  "published_at" timestamptz,
  "updated_by" bigint NOT NULL,
  "created_by" bigint NOT NULL,
  "deleted_by" bigint,
  "deleted_at" timestamptz,
  "updated_at" timestamptz NOT NULL DEFAULT (now()),
  "created_at" timestamptz NOT NULL DEFAULT (now()),

  CONSTRAINT "news_letters_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users" ("id"),
  CONSTRAINT "news_letters_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "users" ("id"),
  CONSTRAINT "news_letters_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users" ("id")
);

CREATE TABLE "job_postings" (
  "id" bigserial PRIMARY KEY,
  "title" varchar(255) NOT NULL,
  "department_id" bigint NOT NULL,
  "location" text NOT NULL,
  "employment_type" varchar(50) NOT NULL CHECK (employment_type IN ('full_time', 'part_time', 'contract', 'internship')),
  "content" text NOT NULL,
  "salary_range" text,
  "start_date" timestamptz NOT NULL,
  "end_date" timestamptz NOT NULL,
  "show_case" boolean NOT NULL DEFAULT false,
  "published" boolean NOT NULL DEFAULT false,
  "published_at" timestamptz,
  "updated_by" bigint NOT NULL,
  "created_by" bigint NOT NULL,
  "deleted_by" bigint,
  "deleted_at" timestamptz,
  "updated_at" timestamptz NOT NULL DEFAULT (now()),
  "created_at" timestamptz NOT NULL DEFAULT (now()),

  CONSTRAINT "job_postings_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments" ("id"),
  CONSTRAINT "job_postings_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users" ("id"),
  CONSTRAINT "job_postings_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "users" ("id"),
  CONSTRAINT "job_postings_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users" ("id")
);

CREATE TABLE "job_applications" (
  "id" bigserial PRIMARY KEY,
  "job_id" bigint NOT NULL,
  "full_name" varchar(255) NOT NULL,
  "email" varchar(255) NOT NULL,
  "phone_number" varchar(255) NOT NULL,
  "cover_letter" text NOT NULL,
  "resume_url" text NOT NULL,
  "status" varchar(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'shortlisted', 'rejected', 'hired')),
  "comment" text,
  "submitted_at" timestamptz NOT NULL DEFAULT (now()),
  "updated_by" bigint NULL,
  "updated_at" timestamptz NOT NULL DEFAULT (now()),
  "created_at" timestamptz NOT NULL DEFAULT (now()),

  CONSTRAINT "job_applications_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "job_postings" ("id"),
  CONSTRAINT "job_applications_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users" ("id")
);
