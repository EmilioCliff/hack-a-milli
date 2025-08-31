package fbase

import (
	"context"
	"fmt"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
)

func (fb *FirebaseService) CreateCustomToken(ctx context.Context, userId int64, claims map[string]interface{}) (string, error) {
	token, err := fb.AuthClient.CustomTokenWithClaims(ctx, fmt.Sprintf("%d", userId), claims)
	if err != nil {
		return "", pkg.Errorf(pkg.INTERNAL_ERROR, "failed to create custom token: %v", err)
	}

	return token, nil
}
func (fb *FirebaseService) VerifyIDToken(ctx context.Context, idToken string) (*pkg.Payload, error) {
	token, err := fb.AuthClient.VerifyIDToken(ctx, idToken)
	if err != nil {
		return nil, pkg.Errorf(pkg.AUTHENTICATION_ERROR, "failed to verify ID token: %v", err)
	}

	// extract email from token claims
	email, ok := token.Claims["email"].(string)
	if !ok {
		return nil, pkg.Errorf(pkg.AUTHENTICATION_ERROR, "email not found in token claims")
	}

	// extract roles from token claims
	var roles []string
	if rolesClaim, ok := token.Claims["roles"].([]interface{}); ok {
		for _, role := range rolesClaim {
			if roleStr, ok := role.(string); ok {
				roles = append(roles, roleStr)
			}
		}
	}

	userId, err := pkg.StringToInt64(token.UID)
	if err != nil {
		return nil, err
	}

	payload := &pkg.Payload{
		UserID: uint32(userId),
		Email:  email,
		Roles:  roles,
	}

	return payload, nil
}
