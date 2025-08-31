package repository

import (
	"context"
	"time"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
)

type Chat struct {
	ID        int64         `json:"id"`
	UserID    int64         `json:"user_id"`
	Title     string        `json:"title"`
	Messages  []ChatMessage `json:"message"`
	DeletedAt *time.Time    `json:"deleted_at,omitempty"`
	CreatedAt time.Time     `json:"created_at"`
}

type ChatMessage struct {
	Role    string `json:"role" binding:"required"`
	Content string `json:"content" binding:"required"`
}

type CompanyDoc struct {
	ID        int64      `json:"id"`
	Title     string     `json:"title"`
	Content   string     `json:"content"`
	DeletedAt *time.Time `json:"deleted_at,omitempty"`
	CreatedAt time.Time  `json:"created_at"`
}

type ChatRepository interface {
	CreateChat(ctx context.Context, chat *Chat) (*Chat, error)
	AddMessageToChat(ctx context.Context, chatID int64, history []ChatMessage) error
	GetChatByID(ctx context.Context, chatID int64) (*Chat, error)
	GetChatsByUserID(ctx context.Context, userID int64, pagination *pkg.Pagination) ([]Chat, *pkg.Pagination, error)
	DeleteChat(ctx context.Context, chatID int64) error

	CreateCompanyDoc(ctx context.Context, doc *CompanyDoc) (*CompanyDoc, error)
	GetAllCompanyDocs(ctx context.Context) ([]CompanyDoc, error)
	UpdateCompanyDoc(ctx context.Context, doc *CompanyDoc) error
	GetCompanyDocByID(ctx context.Context, docID int64) (*CompanyDoc, error)
	DeleteCompanyDoc(ctx context.Context, docID int64) error
}
