package handlers

import (
	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
	"github.com/gin-gonic/gin"
)

var (
	requestContextKey = "request_context"
	refreshTokenKey   = "refresh_token"
)

type requestContext struct {
	UserID   int64    `json:"user_id"`
	Email    string   `json:"email"`
	Roles    []string `json:"roles"`
	Platform string   `json:"platform"`
}

func SetRequestContextMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		userID := ctx.GetHeader("X-User-ID")
		email := ctx.GetHeader("X-User-Email")
		roles := ctx.GetHeader("X-User-Roles")
		platform := ctx.GetHeader("X-User-Device")

		reqCtx := requestContext{
			Email:    email,
			Roles:    pkg.StringToArray(roles, ","),
			Platform: platform,
		}

		if userID != "" {
			reqCtx.UserID, _ = pkg.StringToInt64(userID)
		}

		ctx.Set("request_context", reqCtx)

		ctx.Next()
	}
}

func getRequestContext(ctx *gin.Context) (requestContext, error) {
	value, exists := ctx.Get(requestContextKey)
	if !exists {
		return requestContext{}, pkg.Errorf(pkg.INVALID_ERROR, "request context not found")
	}

	reqCtx, ok := value.(requestContext)
	if !ok {
		return requestContext{}, pkg.Errorf(pkg.INVALID_ERROR, "invalid request context type")
	}

	return reqCtx, nil
}
