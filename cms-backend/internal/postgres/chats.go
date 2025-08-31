package postgres

import (
	"context"
	"encoding/json"
	"log"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/internal/postgres/generated"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/internal/repository"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
	"github.com/jackc/pgx/v5/pgtype"
)

var _ repository.ChatRepository = (*ChatRepository)(nil)

type ChatRepository struct {
	queries *generated.Queries
}

func NewChatRepository(queries *generated.Queries) *ChatRepository {
	return &ChatRepository{queries: queries}
}

func (c *ChatRepository) CreateChat(ctx context.Context, chat *repository.Chat) (*repository.Chat, error) {
	createParams := generated.CreateUserChatParams{
		UserID:   chat.UserID,
		Title:    chat.Title,
		Messages: nil,
	}

	messagesJSON, err := json.Marshal(chat.Messages)
	if err != nil {
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error marshaling chat messages: %s", err.Error())
	}

	log.Println(createParams)

	createParams.Messages = messagesJSON

	createdChat, err := c.queries.CreateUserChat(ctx, createParams)
	if err != nil {
		if pkg.PgxErrorCode(err) == pkg.UNIQUE_VIOLATION {
			return nil, pkg.Errorf(pkg.ALREADY_EXISTS_ERROR, "chat with title %s already exists for user %d", chat.Title, chat.UserID)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error creating chat: %s", err.Error())
	}

	cc := repository.Chat{
		ID:        createdChat.ID,
		UserID:    chat.UserID,
		Title:     chat.Title,
		CreatedAt: chat.CreatedAt,
	}

	var messages []repository.ChatMessage
	if chat.Messages != nil {
		if err := json.Unmarshal(createdChat.Messages, &messages); err != nil {
			return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error unmarshaling chat messages: %s", err.Error())
		}
	}

	cc.Messages = messages

	return &cc, nil
}

func (c *ChatRepository) AddMessageToChat(ctx context.Context, chatID int64, history []repository.ChatMessage) error {
	messagesJSON, err := json.Marshal(history)
	if err != nil {
		return pkg.Errorf(pkg.INTERNAL_ERROR, "error marshaling chat messages: %s", err.Error())
	}

	if err := c.queries.AddMessageToChat(ctx, generated.AddMessageToChatParams{
		ID:       chatID,
		Messages: messagesJSON,
	}); err != nil {
		return pkg.Errorf(pkg.INTERNAL_ERROR, "error updating chat messages: %s", err.Error())
	}

	return nil
}

func (c *ChatRepository) GetChatByID(ctx context.Context, chatID int64) (*repository.Chat, error) {
	chat, err := c.queries.GetChatByID(ctx, chatID)
	if err != nil {
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error getting chat by ID: %s", err.Error())
	}

	var messages []repository.ChatMessage
	if chat.Messages != nil {
		if err := json.Unmarshal(chat.Messages, &messages); err != nil {
			return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error unmarshaling chat messages: %s", err.Error())
		}
	}

	return &repository.Chat{
		ID:        chat.ID,
		UserID:    chat.UserID,
		Title:     chat.Title,
		Messages:  messages,
		CreatedAt: chat.CreatedAt,
	}, nil
}

func (c *ChatRepository) GetChatsByUserID(ctx context.Context, userID int64, pagination *pkg.Pagination) ([]repository.Chat, *pkg.Pagination, error) {
	chats, err := c.queries.GetUserChats(ctx, generated.GetUserChatsParams{
		UserID: userID,
		Offset: pkg.Offset(pagination.Page, pagination.PageSize),
		Limit:  int32(pagination.PageSize),
	})
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error getting chats by user ID: %s", err.Error())
	}

	count, err := c.queries.CountUserChats(ctx, userID)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error counting user chats: %s", err.Error())
	}

	var result []repository.Chat
	for _, chat := range chats {
		var messages []repository.ChatMessage
		if chat.Messages != nil {
			if err := json.Unmarshal(chat.Messages, &messages); err != nil {
				return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error unmarshaling chat messages: %s", err.Error())
			}
		}

		result = append(result, repository.Chat{
			ID:        chat.ID,
			UserID:    chat.UserID,
			Title:     chat.Title,
			Messages:  messages,
			CreatedAt: chat.CreatedAt,
		})
	}

	return result, pkg.CalculatePagination(uint32(count), pagination.PageSize, pagination.Page), nil
}

func (c *ChatRepository) DeleteChat(ctx context.Context, chatID int64) error {
	if err := c.queries.DeleteChat(ctx, chatID); err != nil {
		return pkg.Errorf(pkg.INTERNAL_ERROR, "error deleting chat: %s", err.Error())
	}
	return nil
}

func (c *ChatRepository) CreateCompanyDoc(ctx context.Context, doc *repository.CompanyDoc) (*repository.CompanyDoc, error) {
	companyDocs, err := c.queries.CreateCompanyDoc(ctx, generated.CreateCompanyDocParams{
		Title:   doc.Title,
		Content: doc.Content,
	})
	if err != nil {
		if pkg.PgxErrorCode(err) == pkg.UNIQUE_VIOLATION {
			return nil, pkg.Errorf(pkg.ALREADY_EXISTS_ERROR, "company document with title %s already exists", doc.Title)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error creating company document: %s", err.Error())
	}
	return &repository.CompanyDoc{
		ID:        companyDocs.ID,
		Title:     companyDocs.Title,
		Content:   companyDocs.Content,
		DeletedAt: nil,
		CreatedAt: companyDocs.CreatedAt,
	}, nil
}

func (c *ChatRepository) GetAllCompanyDocs(ctx context.Context) ([]repository.CompanyDoc, error) {
	docs, err := c.queries.GetCompanyDocs(ctx)
	if err != nil {
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error getting all company documents: %s", err.Error())
	}

	var result []repository.CompanyDoc
	for _, doc := range docs {
		result = append(result, repository.CompanyDoc{
			ID:        doc.ID,
			Title:     doc.Title,
			Content:   doc.Content,
			DeletedAt: nil,
			CreatedAt: doc.CreatedAt,
		})
	}

	return result, nil
}

func (c *ChatRepository) UpdateCompanyDoc(ctx context.Context, doc *repository.CompanyDoc) error {
	params := generated.UpdateCompanyDocParams{
		ID:      doc.ID,
		Title:   pgtype.Text{Valid: false},
		Content: pgtype.Text{Valid: false},
	}

	if doc.Title != "" {
		params.Title = pgtype.Text{String: doc.Title, Valid: true}
	}
	if doc.Content != "" {
		params.Content = pgtype.Text{String: doc.Content, Valid: true}
	}

	_, err := c.queries.UpdateCompanyDoc(ctx, params)
	if err != nil {
		return pkg.Errorf(pkg.INTERNAL_ERROR, "error updating company document: %s", err.Error())
	}

	return nil
}

func (c *ChatRepository) GetCompanyDocByID(ctx context.Context, docID int64) (*repository.CompanyDoc, error) {
	doc, err := c.queries.GetCompanyDocByID(ctx, docID)
	if err != nil {
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error getting company document by ID: %s", err.Error())
	}

	return &repository.CompanyDoc{
		ID:        doc.ID,
		Title:     doc.Title,
		Content:   doc.Content,
		CreatedAt: doc.CreatedAt,
	}, nil
}

func (c *ChatRepository) DeleteCompanyDoc(ctx context.Context, docID int64) error {
	if err := c.queries.DeleteCompanyDoc(ctx, docID); err != nil {
		return pkg.Errorf(pkg.INTERNAL_ERROR, "error deleting company document: %s", err.Error())
	}
	return nil
}
