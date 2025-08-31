package services

import (
	"context"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
)

type CloudMessage struct {
	Token string            `json:"token,omitempty"`
	Topic string            `json:"topic,omitempty"`
	Title string            `json:"title"`
	Body  string            `json:"body"`
	Data  map[string]string `json:"data,omitempty"`
}

type IFirebaseService interface {
	// auth
	CreateCustomToken(ctx context.Context, userId int64, claims map[string]interface{}) (string, error)
	VerifyIDToken(ctx context.Context, idToken string) (*pkg.Payload, error)

	// storage
	TransferFile(ctx context.Context, srcObjectName, destObjectName string) (string, error)
	DeleteFile(ctx context.Context, bucketName, objectName string) error

	// cloud messaging
	SendMessageToTopic(ctx context.Context, msg CloudMessage) error
	SendMessageToToken(ctx context.Context, msg CloudMessage) error
	SendMessageToTokens(ctx context.Context, msg CloudMessage, tokens []string) error
}
