package fbase

import (
	"context"
	"fmt"
	"net/url"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
	"github.com/google/uuid"
)

func (fb *FirebaseService) TransferFile(ctx context.Context, srcObjectName, destObjectName string) (string, error) {
	defaultBucket, err := fb.StorageClient.DefaultBucket()
	if err != nil {
		return "", pkg.Errorf(pkg.INTERNAL_ERROR, "failed to get source bucket: %s", err.Error())
	}

	srcObj := defaultBucket.Object(srcObjectName)
	destObj := defaultBucket.Object(destObjectName)

	key := uuid.New().String()

	copier := destObj.CopierFrom(srcObj)
	copier.Metadata = map[string]string{
		"firebaseStorageDownloadTokens": key,
	}

	_, err = copier.Run(ctx)
	if err != nil {
		return "", pkg.Errorf(pkg.INTERNAL_ERROR, "failed to copy object: %s", err.Error())
	}

	downloadURL := fmt.Sprintf(
		"https://firebasestorage.googleapis.com/v0/b/%s/o/%s?alt=media&token=%s",
		defaultBucket.BucketName(),
		url.PathEscape(destObjectName),
		key,
	)

	return downloadURL, nil
}

func (fb *FirebaseService) DeleteFile(ctx context.Context, bucketName, objectName string) error {
	bucket, err := fb.StorageClient.Bucket(bucketName)
	if err != nil {
		return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to get bucket: %s", err.Error())
	}

	if err := bucket.Object(objectName).Delete(ctx); err != nil {
		return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to delete object: %s", err.Error())
	}

	return nil
}
