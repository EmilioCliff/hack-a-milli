package handlers

import (
	"fmt"
	"log"
	"strings"

	"github.com/EmilioCliff/hack-a-milli/gateway/pkg"
	"github.com/gin-gonic/gin"
)

// authorize checks if the user has permission to access the resource
func (s *Server) authorize(ctx *gin.Context, authCtx *AuthContext, route pkg.Route) bool {
	if authCtx.Payload == nil {
		return false
	}

	if route.Permission == "" {
		return true
	}

	// Extract resource and action from permission string (e.g., "create:blog" -> "blog", "create")
	parts := strings.Split(route.Permission, ":")
	if len(parts) != 2 {
		log.Printf("Invalid permission format: %s", route.Permission)
		return false
	}

	resource := parts[1]
	action := parts[0]

	status := "published" // Default status
	if queryStatus := ctx.Query("status"); queryStatus != "" {
		status = queryStatus
	}

	// Check permission for each user role
	for _, role := range authCtx.Payload.Roles {
		allowed, err := s.enforcer.Enforce(role, resource, action, status)
		if err != nil {
			log.Printf("Error checking permission for role %s: %v", role, err)
			continue // Skip this role if there's an error
		}
		if allowed {
			return true
		}
	}

	return false
}

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

	payload, err := pkg.VerifyToken(token, s.config.Auth.JWTSecret)
	if err != nil {
		return nil, fmt.Errorf("invalid token: %w", err)
	}

	authCtx.Payload = payload
	authCtx.Token = token

	return authCtx, nil
}
