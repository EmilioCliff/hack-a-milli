package pkg

import (
	"errors"
	"fmt"
	"slices"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

type Payload struct {
	ID          uuid.UUID `json:"id"`
	UserID      uint32    `json:"user_id"`
	Email       string    `json:"email"`
	Roles       []string  `json:"roles"`
	Permissions []string  `json:"permissions"`
	jwt.RegisteredClaims
}

func VerifyToken(token, jwtSecret string, tokenIssuers []string) (*Payload, error) {
	jwtToken, err := jwt.ParseWithClaims(token, &Payload{}, func(token *jwt.Token) (any, error) {
		_, ok := token.Method.(*jwt.SigningMethodHMAC)
		if !ok {
			return nil, errors.New("unexpected signing method")
		}

		return []byte(jwtSecret), nil
	})
	if err != nil {
		return nil, fmt.Errorf("failed to parse token: %v", err)
	}

	payload, ok := jwtToken.Claims.(*Payload)
	if !ok {
		return nil, errors.New("failed to parse token is invalid")
	}

	issuer, err := payload.GetIssuer()
	if err != nil {
		return nil, fmt.Errorf("failed to get token issuer: %v", err)
	}

	if ok := slices.Contains(tokenIssuers, issuer); !ok {
		return nil, fmt.Errorf("token issuer is not allowed: %s", payload.Issuer)
	}

	if payload.RegisteredClaims.ExpiresAt.Time.Before(time.Now()) {
		return nil, errors.New("token is expired")
	}

	return payload, nil
}
