package handlers

import (
	"fmt"
	"log"
	"net/http"
	"strconv"
	"sync"
	"time"

	"github.com/EmilioCliff/hack-a-milli/gateway/auth"
	"github.com/EmilioCliff/hack-a-milli/gateway/pkg"
	"github.com/gin-gonic/gin"
)

type Server struct {
	config      *pkg.Config
	enforcer    *auth.CasbinEnforcer
	router      *gin.Engine
	pathMatcher map[string]*pkg.Path // Cache for compiled path patterns
	mu          sync.RWMutex
}

type AuthContext struct {
	Payload  *pkg.Payload
	Token    string
	IsPublic bool
}

func NewServer(config *pkg.Config, enforcer *auth.CasbinEnforcer) (*Server, error) {
	gateway := &Server{
		config:      config,
		enforcer:    enforcer,
		router:      gin.Default(),
		pathMatcher: make(map[string]*pkg.Path),
	}

	if err := gateway.setupRoutes(); err != nil {
		return nil, fmt.Errorf("failed to setup routes: %w", err)
	}

	return gateway, nil
}

func (s *Server) setupRoutes() error {
	for _, route := range s.config.Routes {
		pathPattern := pkg.Matcher(route.Path)
		routeKey := fmt.Sprintf("%s:%s", route.Method, route.Path)
		s.pathMatcher[routeKey] = &pathPattern

		// Create handler for this route
		handler := s.createRouteHandler(route)

		s.router.Handle(route.Method, route.Path, handler)
		// s.router.HandleFunc(route.Path, handler).Methods(route.Method)
	}

	s.router.Handle(http.MethodGet, "/health", s.healthCheckHandler)

	return nil
}

func (s *Server) Start() error {
	server := &http.Server{
		Addr:         ":" + strconv.Itoa(s.config.Server.Port),
		Handler:      s.router,
		ReadTimeout:  time.Duration(s.config.Server.ReadTimeout) * time.Second,
		WriteTimeout: time.Duration(s.config.Server.WriteTimeout) * time.Second,
	}

	log.Printf("Starting API Gateway on port %d", s.config.Server.Port)
	return server.ListenAndServe()
}

func (s *Server) healthCheckHandler(ctx *gin.Context) {
	health := map[string]interface{}{
		"status":    "healthy",
		"timestamp": time.Now().Unix(),
		"version":   "1.0.0",
	}

	ctx.JSON(http.StatusOK, health)
}

// createRouteHandler creates a handler function for a specific route
func (s *Server) createRouteHandler(route pkg.Route) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var err error
		authCtx := &AuthContext{
			IsPublic: route.Public,
		}

		if !route.Public {
			authCtx, err = s.authenticate(ctx, route)
			if err != nil {
				ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
				return
			}

			if !s.authorize(ctx, authCtx, route) {
				ctx.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
				return
			}
		}

		// Handle the request based on route type
		if len(route.Compose) > 0 {
			s.handleComposedRequest(ctx, route, authCtx)
		} else {
			s.handleProxyRequest(ctx, route, authCtx)
		}
	}
}
