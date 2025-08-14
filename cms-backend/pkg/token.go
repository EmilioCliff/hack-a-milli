package pkg

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

const TokenIssuer = "BACKEND_APP"

type JWTMaker struct {
	jwtSecret string
}

type Payload struct {
	ID     uuid.UUID `json:"id"`
	UserID uint32    `json:"user_id"`
	Email  string    `json:"email"`
	Roles  []string  `json:"roles"`
	jwt.RegisteredClaims
}

func NewJWTMaker(jwtSecret string) JWTMaker {
	return JWTMaker{jwtSecret: jwtSecret}
}

func (maker *JWTMaker) CreateToken(email string, userID uint32, role []string, duration time.Duration) (string, error) {
	id, err := uuid.NewUUID()
	if err != nil {
		return "", Errorf(INTERNAL_ERROR, "failed to create uuid: %v", err)
	}

	claims := Payload{
		id,
		userID,
		email,
		role,
		jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(duration)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    TokenIssuer,
		},
	}

	jwtToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	signedToken, err := jwtToken.SignedString([]byte(maker.jwtSecret))
	if err != nil {
		return "", Errorf(INTERNAL_ERROR, "error signing token: %v", err)
	}

	return signedToken, nil
}

func (maker *JWTMaker) VerifyToken(token string) (*Payload, error) {
	jwtToken, err := jwt.ParseWithClaims(token, &Payload{}, func(token *jwt.Token) (any, error) {
		_, ok := token.Method.(*jwt.SigningMethodHMAC)
		if !ok {
			return nil, Errorf(INTERNAL_ERROR, "unexpected signing method")
		}

		return []byte(maker.jwtSecret), nil
	})
	if err != nil {
		return nil, Errorf(INTERNAL_ERROR, "failed to parse token: %v", err)
	}

	payload, ok := jwtToken.Claims.(*Payload)
	if !ok {
		return nil, Errorf(INTERNAL_ERROR, "failed to parse token is invalid")
	}

	if payload.RegisteredClaims.Issuer != TokenIssuer {
		return nil, Errorf(INTERNAL_ERROR, "invalid issuer")
	}

	if payload.RegisteredClaims.ExpiresAt.Time.Before(time.Now()) {
		return nil, Errorf(INTERNAL_ERROR, "token is expired")
	}

	return payload, nil
}
