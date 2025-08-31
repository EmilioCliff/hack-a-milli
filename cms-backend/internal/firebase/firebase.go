package fbase

import (
	"context"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"
	"firebase.google.com/go/v4/messaging"
	"firebase.google.com/go/v4/storage"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/internal/services"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
	"github.com/spf13/viper"
	"google.golang.org/api/option"
)

var _ services.IFirebaseService = (*FirebaseService)(nil)

type FirebaseService struct {
	AuthClient      *auth.Client
	StorageClient   *storage.Client
	MessagingClient *messaging.Client
}

func NewFirebaseService(ctx context.Context) (*FirebaseService, error) {
	// check if service account env is set
	googleServiceAccountPath := viper.GetString("GOOGLE_APPLICATION_CREDENTIALS")
	if googleServiceAccountPath == "" {
		return nil, pkg.Errorf(pkg.INVALID_ERROR, "GOOGLE_APPLICATION_CREDENTIALS is not set, firebase service will not be initialized")
	}

	config := firebase.Config{}

	projectId := viper.GetString("FIREBASE_PROJECT_ID")
	storageBucket := viper.GetString("FIREBASE_STORAGE_BUCKET")
	if projectId != "" {
		config.ProjectID = projectId
	}
	if storageBucket != "" {
		config.StorageBucket = storageBucket
	}

	app, err := firebase.NewApp(ctx, &config, option.WithCredentialsFile(googleServiceAccountPath))
	if err != nil {
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error initializing app: %s\n", err.Error())
	}

	authClient, err := app.Auth(ctx)
	if err != nil {
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error getting Auth client: %s", err.Error())
	}

	storageClient, err := app.Storage(ctx)
	if err != nil {
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error getting Storage client: %s", err.Error())
	}

	messagingClient, err := app.Messaging(ctx)
	if err != nil {
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error getting Messaging client: %s", err.Error())
	}

	return &FirebaseService{
		AuthClient:      authClient,
		StorageClient:   storageClient,
		MessagingClient: messagingClient,
	}, nil
}
