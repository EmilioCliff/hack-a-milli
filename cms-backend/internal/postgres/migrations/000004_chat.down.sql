ALTER TABLE "user_chats" DROP CONSTRAINT "user_chats_user_id_fkey";

DROP TABLE IF EXISTS user_chats;
DROP TABLE IF EXISTS company_docs;