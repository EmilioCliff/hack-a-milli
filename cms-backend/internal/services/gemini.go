package services

import "context"

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type IChatService interface {
	GenerateText(ctx context.Context, msg string, history []Message, companyDocs []string) (string, string, error)
}
