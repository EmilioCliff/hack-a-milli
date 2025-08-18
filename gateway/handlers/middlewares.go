package handlers

import (
	"fmt"
	"log"
	"strings"

	"github.com/EmilioCliff/hack-a-milli/gateway/pkg"
	"github.com/gin-gonic/gin"
)

// authenticate verifies the user's identity and extracts user information
func (s *Server) authenticate(ctx *gin.Context, route pkg.Route) (*AuthContext, error) {
	authCtx := &AuthContext{
		IsPublic: route.Public,
	}

	authHeader := ctx.GetHeader(s.config.Auth.TokenHeader)
	if authHeader == "" {
		return nil, fmt.Errorf("missing authorization header")
	}

	fields := strings.Fields(authHeader)
	if len(fields) != 2 {
		return nil, fmt.Errorf("invalid authorization header format")
	}

	authType := fields[0]
	if strings.ToLower(authType) != "bearer" {
		return nil, fmt.Errorf("unsupported authentication type: %s", authType)
	}

	token := fields[1]

	payload, err := pkg.VerifyToken(token, s.config.Auth.JWTSecret, s.config.Auth.TokenIssuer)
	if err != nil {
		return nil, fmt.Errorf("invalid token: %w", err)
	}

	authCtx.Payload = payload
	authCtx.Token = token

	return authCtx, nil
}

// authorize checks if the user has permission to access the resource
func (s *Server) authorize(ctx *gin.Context, authCtx *AuthContext, route pkg.Route) bool {
	if authCtx.Payload == nil {
		return false
	}

	subject := fmt.Sprintf("user:%d", authCtx.Payload.UserID)

	owner := ""
	if route.UserScoped {
		owner = fmt.Sprintf("user:%s", ctx.Param("id"))
	}

	log.Println(subject, route.Resource, route.Action, owner)

	allowed, err := s.enforcer.Enforcer.Enforce(subject, route.Resource, route.Action, owner)
	if err != nil {
		log.Println("Error checking permissions:", err)
		return false
	}

	if route.PublishedScoped {
		for _, role := range authCtx.Payload.Roles {
			hasPublishPermission, err := s.enforcer.Enforcer.HasPermissionForUser(role, route.Resource, "read:publish")
			if err != nil {
				log.Println("Error checking published scoped permissions:", err)
				return false
			}

			if hasPublishPermission {
				ctx.Set("X-Published-Only", "true")
				break
			}
		}
	}

	return allowed
}
