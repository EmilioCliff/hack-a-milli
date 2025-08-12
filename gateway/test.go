package main

// import (
// 	"context"
// 	"encoding/json"
// 	"fmt"
// 	"io"
// 	"log"
// 	"net/http"
// 	"net/http/httputil"
// 	"net/url"
// 	"strconv"
// 	"strings"
// 	"sync"
// 	"time"

// 	"github.com/EmilioCliff/hack-a-milli/gateway/pkg"
// 	"github.com/gin-gonic/gin"

// 	"github.com/casbin/casbin/v2"
// 	"github.com/golang-jwt/jwt/v5"
// )

// // AuthContext holds authentication information for a request
// type AuthContext struct {
// 	User        *User
// 	Token       string
// 	Permissions []string
// 	IsPublic    bool
// }

// // ============================================================================
// // Gateway Core Structure
// // ============================================================================

// // Gateway represents the API gateway
// type Gateway struct {
// 	config   *pkg.Config
// 	enforcer *casbin.Enforcer
// 	// router         *mux.Router
// 	router      gin.Engine
// 	pathMatcher map[string]*pkg.Path // Cache for compiled path patterns
// 	// rateLimiter    *RateLimiter
// 	// circuitBreaker *CircuitBreaker
// 	mu sync.RWMutex
// }

// // ============================================================================
// // Rate Limiting
// // ============================================================================

// // type RateLimiter struct {
// // 	clients map[string]*ClientLimiter
// // 	mu      sync.RWMutex
// // }

// // type ClientLimiter struct {
// // 	tokens    int
// // 	lastSeen  time.Time
// // 	maxTokens int
// // }

// // func NewRateLimiter() *RateLimiter {
// // 	rl := &RateLimiter{
// // 		clients: make(map[string]*ClientLimiter),
// // 	}

// // 	// Cleanup routine
// // 	go func() {
// // 		ticker := time.NewTicker(time.Minute)
// // 		defer ticker.Stop()
// // 		for range ticker.C {
// // 			rl.cleanup()
// // 		}
// // 	}()

// // 	return rl
// // }

// // func (rl *RateLimiter) Allow(clientID string, limit int) bool {
// // 	rl.mu.Lock()
// // 	defer rl.mu.Unlock()

// // 	now := time.Now()
// // 	client, exists := rl.clients[clientID]

// // 	if !exists {
// // 		rl.clients[clientID] = &ClientLimiter{
// // 			tokens:    limit - 1,
// // 			lastSeen:  now,
// // 			maxTokens: limit,
// // 		}
// // 		return true
// // 	}

// // 	// Refill tokens based on time passed (token bucket algorithm)
// // 	elapsed := now.Sub(client.lastSeen)
// // 	tokensToAdd := int(elapsed.Seconds()) // 1 token per second
// // 	client.tokens = min(client.maxTokens, client.tokens+tokensToAdd)
// // 	client.lastSeen = now

// // 	if client.tokens > 0 {
// // 		client.tokens--
// // 		return true
// // 	}

// // 	return false
// // }

// // func (rl *RateLimiter) cleanup() {
// // 	rl.mu.Lock()
// // 	defer rl.mu.Unlock()

// // 	cutoff := time.Now().Add(-10 * time.Minute)
// // 	for clientID, client := range rl.clients {
// // 		if client.lastSeen.Before(cutoff) {
// // 			delete(rl.clients, clientID)
// // 		}
// // 	}
// // }

// // func min(a, b int) int {
// // 	if a < b {
// // 		return a
// // 	}
// // 	return b
// // }

// // ============================================================================
// // Circuit Breaker
// // ============================================================================

// // type CircuitBreaker struct {
// // 	backends map[string]*BackendState
// // 	mu       sync.RWMutex
// // }

// // type BackendState struct {
// // 	failures    int
// // 	lastFailure time.Time
// // 	state       string // closed, open, half-open
// // 	threshold   int
// // }

// // func NewCircuitBreaker() *CircuitBreaker {
// // 	return &CircuitBreaker{
// // 		backends: make(map[string]*BackendState),
// // 	}
// // }

// // func (cb *CircuitBreaker) CanExecute(backend string) bool {
// // 	cb.mu.Lock()
// // 	defer cb.mu.Unlock()

// // 	state, exists := cb.backends[backend]
// // 	if !exists {
// // 		cb.backends[backend] = &BackendState{
// // 			state:     "closed",
// // 			threshold: 5,
// // 		}
// // 		return true
// // 	}

// // 	switch state.state {
// // 	case "closed":
// // 		return true
// // 	case "open":
// // 		if time.Since(state.lastFailure) > 30*time.Second {
// // 			state.state = "half-open"
// // 			return true
// // 		}
// // 		return false
// // 	case "half-open":
// // 		return true
// // 	}

// // 	return false
// // }

// // func (cb *CircuitBreaker) RecordSuccess(backend string) {
// // 	cb.mu.Lock()
// // 	defer cb.mu.Unlock()

// // 	if state, exists := cb.backends[backend]; exists {
// // 		state.failures = 0
// // 		state.state = "closed"
// // 	}
// // }

// // func (cb *CircuitBreaker) RecordFailure(backend string) {
// // 	cb.mu.Lock()
// // 	defer cb.mu.Unlock()

// // 	state, exists := cb.backends[backend]
// // 	if !exists {
// // 		state = &BackendState{threshold: 5}
// // 		cb.backends[backend] = state
// // 	}

// // 	state.failures++
// // 	state.lastFailure = time.Now()

// // 	if state.failures >= state.threshold {
// // 		state.state = "open"
// // 	}
// // }

// // ============================================================================
// // Gateway Implementation
// // ============================================================================

// // NewGateway creates a new API gateway instance
// func NewGateway(config *pkg.Config, enforcer *casbin.Enforcer) (*Gateway, error) {
// 	gateway := &Gateway{
// 		config:      config,
// 		enforcer:    enforcer,
// 		router:      gin.Default(),
// 		pathMatcher: make(map[string]*pkg.Path),
// 		// rateLimiter:    NewRateLimiter(),
// 		// circuitBreaker: NewCircuitBreaker(),
// 	}

// 	// Setup routes
// 	if err := gateway.setupRoutes(); err != nil {
// 		return nil, fmt.Errorf("failed to setup routes: %w", err)
// 	}

// 	return gateway, nil
// }

// // setupRoutes configures all routes from the configuration
// func (g *Gateway) setupRoutes() error {
// 	for _, route := range g.config.Routes {
// 		// Compile path pattern for parameter extraction
// 		pathPattern := pkg.Matcher(route.Path)
// 		routeKey := fmt.Sprintf("%s:%s", route.Method, route.Path)
// 		g.pathMatcher[routeKey] = &pathPattern

// 		// Create handler for this route
// 		handler := g.createRouteHandler(route)

// 		// Register with mux router
// 		g.router.HandleFunc(route.Path, handler).Methods(route.Method)
// 	}

// 	// Add health check endpoint
// 	g.router.HandleFunc("/health", g.healthCheckHandler).Methods("GET")

// 	// Add user permissions endpoint for frontend
// 	g.router.HandleFunc("/api/user/permissions", g.userPermissionsHandler).Methods("GET")

// 	return nil
// }

// // createRouteHandler creates a handler function for a specific route
// func (g *Gateway) createRouteHandler(route Route) http.HandlerFunc {
// 	return func(w http.ResponseWriter, r *http.Request) {
// 		// Apply middleware chain
// 		ctx := r.Context()

// 		// Rate limiting
// 		if route.RateLimit > 0 {
// 			clientID := g.getClientID(r)
// 			if !g.rateLimiter.Allow(clientID, route.RateLimit) {
// 				g.writeErrorResponse(w, http.StatusTooManyRequests, "Rate limit exceeded")
// 				return
// 			}
// 		}

// 		// Authentication and Authorization
// 		authCtx, err := g.authenticate(r, route)
// 		if err != nil {
// 			g.writeErrorResponse(w, http.StatusUnauthorized, err.Error())
// 			return
// 		}

// 		if !route.Public {
// 			if !g.authorize(authCtx, route, r) {
// 				g.writeErrorResponse(w, http.StatusForbidden, "Access denied")
// 				return
// 			}
// 		}

// 		// Add auth context to request context
// 		ctx = context.WithValue(ctx, "auth", authCtx)
// 		r = r.WithContext(ctx)

// 		// Handle the request based on route type
// 		if len(route.Compose) > 0 {
// 			g.handleComposedRequest(w, r, route, authCtx)
// 		} else {
// 			g.handleProxyRequest(w, r, route, authCtx)
// 		}
// 	}
// }

// // authenticate verifies the user's identity and extracts user information
// func (g *Gateway) authenticate(r *http.Request, route Route) (*AuthContext, error) {
// 	authCtx := &AuthContext{
// 		IsPublic: route.Public,
// 	}

// 	// For public routes without authentication requirements, return early
// 	if route.Public && route.Permission == "" {
// 		return authCtx, nil
// 	}

// 	// Extract token from header
// 	authHeader := r.Header.Get(g.config.Auth.TokenHeader)
// 	if authHeader == "" {
// 		if route.Public {
// 			return authCtx, nil
// 		}
// 		return nil, fmt.Errorf("missing authorization token")
// 	}

// 	// Remove "Bearer " prefix if present
// 	token := strings.TrimPrefix(authHeader, "Bearer ")
// 	authCtx.Token = token

// 	// Parse and validate JWT token
// 	claims := &Claims{}
// 	tkn, err := jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (interface{}, error) {
// 		return []byte(g.config.Auth.JWTSecret), nil
// 	})

// 	if err != nil || !tkn.Valid {
// 		if route.Public {
// 			return authCtx, nil
// 		}
// 		return nil, fmt.Errorf("invalid token")
// 	}

// 	authCtx.User = &claims.User
// 	authCtx.Permissions = claims.User.Permissions

// 	return authCtx, nil
// }

// // authorize checks if the user has permission to access the resource
// func (g *Gateway) authorize(authCtx *AuthContext, route Route, r *http.Request) bool {
// 	if authCtx.User == nil {
// 		return false
// 	}

// 	// If no specific permission is required, just check if user is authenticated
// 	if route.Permission == "" {
// 		return true
// 	}

// 	// Extract resource and action from permission string (e.g., "create:blog" -> "blog", "create")
// 	parts := strings.Split(route.Permission, ":")
// 	if len(parts) != 2 {
// 		log.Printf("Invalid permission format: %s", route.Permission)
// 		return false
// 	}

// 	resource := parts[1]
// 	action := parts[0]

// 	// Get resource status from request (published/unpublished)
// 	status := g.getResourceStatus(r, resource)

// 	// Check permission for each user role
// 	for _, role := range authCtx.User.Roles {
// 		allowed, err := g.enforcer.Enforce(role, resource, action, status)
// 		if err != nil {
// 			log.Printf("Authorization error: %v", err)
// 			continue
// 		}
// 		if allowed {
// 			return true
// 		}
// 	}

// 	return false
// }

// // getResourceStatus determines the status of the resource being accessed
// func (g *Gateway) getResourceStatus(r *http.Request, resource string) string {
// 	// For GET requests, check query parameters for status filter
// 	if r.Method == "GET" {
// 		if status := r.URL.Query().Get("status"); status != "" {
// 			return status
// 		}
// 		// Default to published for read operations by non-privileged users
// 		return "published"
// 	}

// 	// For POST/PUT requests, you might need to inspect the body
// 	// This is a simplified approach - in practice, you might need more sophisticated logic
// 	return "any"
// }

// // handleProxyRequest handles standard proxy requests to backend services
// func (g *Gateway) handleProxyRequest(
// 	w http.ResponseWriter,
// 	r *http.Request,
// 	route Route,
// 	authCtx *AuthContext,
// ) {
// 	backendURL := route.BackendURL

// 	// Check circuit breaker
// 	if !g.circuitBreaker.CanExecute(backendURL) {
// 		g.writeErrorResponse(w, http.StatusServiceUnavailable, "Service temporarily unavailable")
// 		return
// 	}

// 	// Parse backend URL
// 	target, err := url.Parse(backendURL)
// 	if err != nil {
// 		g.circuitBreaker.RecordFailure(backendURL)
// 		g.writeErrorResponse(w, http.StatusInternalServerError, "Invalid backend URL")
// 		return
// 	}

// 	// Create reverse proxy
// 	proxy := httputil.NewSingleHostReverseProxy(target)

// 	// Customize the request
// 	originalDirector := proxy.Director
// 	proxy.Director = func(req *http.Request) {
// 		originalDirector(req)

// 		// Add user context headers for backend services
// 		if authCtx.User != nil {
// 			req.Header.Set("X-User-ID", authCtx.User.ID)
// 			req.Header.Set("X-User-Email", authCtx.User.Email)
// 			req.Header.Set("X-User-Roles", strings.Join(authCtx.User.Roles, ","))
// 			req.Header.Set("X-User-Organization", authCtx.User.Organization)
// 		}

// 		// Add original host header
// 		req.Header.Set("X-Forwarded-Host", r.Host)
// 		req.Header.Set("X-Forwarded-Proto", "http")
// 		if r.TLS != nil {
// 			req.Header.Set("X-Forwarded-Proto", "https")
// 		}
// 	}

// 	// Handle proxy errors
// 	proxy.ErrorHandler = func(w http.ResponseWriter, r *http.Request, err error) {
// 		g.circuitBreaker.RecordFailure(backendURL)
// 		log.Printf("Proxy error for %s: %v", backendURL, err)
// 		g.writeErrorResponse(w, http.StatusBadGateway, "Backend service error")
// 	}

// 	// Execute request with timeout
// 	timeout := time.Duration(route.Timeout) * time.Second
// 	if timeout == 0 {
// 		timeout = 30 * time.Second
// 	}

// 	ctx, cancel := context.WithTimeout(r.Context(), timeout)
// 	defer cancel()

// 	proxy.ServeHTTP(w, r.WithContext(ctx))
// 	g.circuitBreaker.RecordSuccess(backendURL)
// }

// // handleComposedRequest handles requests that need to be composed from multiple backend services
// func (g *Gateway) handleComposedRequest(
// 	w http.ResponseWriter,
// 	r *http.Request,
// 	route Route,
// 	authCtx *AuthContext,
// ) {
// 	type ServiceResponse struct {
// 		URL  string      `json:"url"`
// 		Data interface{} `json:"data"`
// 		Err  error       `json:"-"`
// 	}

// 	responses := make([]ServiceResponse, len(route.Compose))
// 	var wg sync.WaitGroup

// 	// Make concurrent requests to all backend services
// 	for i, serviceURL := range route.Compose {
// 		wg.Add(1)
// 		go func(index int, url string) {
// 			defer wg.Done()

// 			// Check circuit breaker
// 			if !g.circuitBreaker.CanExecute(url) {
// 				responses[index] = ServiceResponse{
// 					URL: url,
// 					Err: fmt.Errorf("service unavailable"),
// 				}
// 				return
// 			}

// 			// Create request to backend service
// 			req, err := http.NewRequest("GET", url, nil)
// 			if err != nil {
// 				responses[index] = ServiceResponse{URL: url, Err: err}
// 				return
// 			}

// 			// Add user context headers
// 			if authCtx.User != nil {
// 				req.Header.Set("X-User-ID", authCtx.User.ID)
// 				req.Header.Set("X-User-Email", authCtx.User.Email)
// 				req.Header.Set("X-User-Roles", strings.Join(authCtx.User.Roles, ","))
// 				req.Header.Set("X-User-Organization", authCtx.User.Organization)
// 			}

// 			// Execute request
// 			client := &http.Client{Timeout: 10 * time.Second}
// 			resp, err := client.Do(req)
// 			if err != nil {
// 				g.circuitBreaker.RecordFailure(url)
// 				responses[index] = ServiceResponse{URL: url, Err: err}
// 				return
// 			}
// 			defer resp.Body.Close()

// 			// Read response
// 			body, err := io.ReadAll(resp.Body)
// 			if err != nil {
// 				g.circuitBreaker.RecordFailure(url)
// 				responses[index] = ServiceResponse{URL: url, Err: err}
// 				return
// 			}

// 			// Parse JSON response
// 			var data interface{}
// 			if err := json.Unmarshal(body, &data); err != nil {
// 				g.circuitBreaker.RecordFailure(url)
// 				responses[index] = ServiceResponse{URL: url, Err: err}
// 				return
// 			}

// 			g.circuitBreaker.RecordSuccess(url)
// 			responses[index] = ServiceResponse{URL: url, Data: data}
// 		}(i, serviceURL)
// 	}

// 	wg.Wait()

// 	// Prepare composed response
// 	composedResponse := make(map[string]interface{})
// 	hasErrors := false

// 	for _, resp := range responses {
// 		if resp.Err != nil {
// 			hasErrors = true
// 			composedResponse[resp.URL] = map[string]string{"error": resp.Err.Error()}
// 		} else {
// 			composedResponse[resp.URL] = resp.Data
// 		}
// 	}

// 	// Set appropriate status code
// 	statusCode := http.StatusOK
// 	if hasErrors {
// 		statusCode = http.StatusPartialContent
// 	}

// 	w.Header().Set("Content-Type", "application/json")
// 	w.WriteHeader(statusCode)
// 	json.NewEncoder(w).Encode(composedResponse)
// }

// // userPermissionsHandler returns user permissions and roles for frontend rendering
// func (g *Gateway) userPermissionsHandler(w http.ResponseWriter, r *http.Request) {
// 	authCtx, err := g.authenticate(r, Route{Public: false})
// 	if err != nil {
// 		g.writeErrorResponse(w, http.StatusUnauthorized, err.Error())
// 		return
// 	}

// 	if authCtx.User == nil {
// 		g.writeErrorResponse(w, http.StatusUnauthorized, "User not authenticated")
// 		return
// 	}

// 	// Get all permissions for user's roles
// 	permissions := make(map[string]map[string][]string)

// 	for _, role := range authCtx.User.Roles {
// 		rolePerms := g.getRolePermissions(role)
// 		permissions[role] = rolePerms
// 	}

// 	response := map[string]interface{}{
// 		"user":        authCtx.User,
// 		"permissions": permissions,
// 		"components":  g.getComponentPermissions(authCtx.User),
// 	}

// 	w.Header().Set("Content-Type", "application/json")
// 	json.NewEncoder(w).Encode(response)
// }

// // getRolePermissions gets all permissions for a specific role
// func (g *Gateway) getRolePermissions(role string) map[string][]string {
// 	permissions := make(map[string][]string)

// 	// This would typically query your Casbin policies
// 	// For now, we'll return a simplified structure
// 	switch role {
// 	case "admin":
// 		permissions["blogs"] = []string{"create", "read", "update", "delete"}
// 		permissions["courses"] = []string{"create", "read", "update", "delete"}
// 		permissions["events"] = []string{"create", "read", "update", "delete"}
// 		permissions["users"] = []string{"create", "read", "update", "delete"}
// 	case "editor":
// 		permissions["blogs"] = []string{
// 			"create",
// 			"read",
// 			"update",
// 			"delete",
// 		} // with status restrictions
// 		permissions["events"] = []string{"create", "read", "update"}
// 	case "teacher":
// 		permissions["courses"] = []string{"create", "read", "update"}
// 	case "hr":
// 		permissions["careers"] = []string{"create", "read", "update", "delete"}
// 		permissions["users"] = []string{"read", "update"}
// 	case "accounts":
// 		permissions["orders"] = []string{"read", "update"}
// 		permissions["payments"] = []string{"read"}
// 	case "user":
// 		permissions["blogs"] = []string{"read"}
// 		permissions["courses"] = []string{"read"}
// 		permissions["events"] = []string{"read"}
// 	}

// 	return permissions
// }

// // getComponentPermissions returns which React components the user can access
// func (g *Gateway) getComponentPermissions(user *User) map[string]bool {
// 	components := make(map[string]bool)

// 	for _, role := range user.Roles {
// 		switch role {
// 		case "admin":
// 			components["AdminDashboard"] = true
// 			components["UserManagement"] = true
// 			components["ContentManagement"] = true
// 			components["Analytics"] = true
// 		case "editor":
// 			components["ContentManagement"] = true
// 			components["BlogEditor"] = true
// 			components["EventEditor"] = true
// 		case "teacher":
// 			components["CourseManagement"] = true
// 			components["CourseEditor"] = true
// 			components["StudentManagement"] = true
// 		case "hr":
// 			components["HRDashboard"] = true
// 			components["CareerManagement"] = true
// 			components["EmployeeManagement"] = true
// 		case "accounts":
// 			components["OrderManagement"] = true
// 			components["PaymentManagement"] = true
// 			components["FinancialReports"] = true
// 		case "user":
// 			components["UserProfile"] = true
// 			components["CourseViewer"] = true
// 		}
// 	}

// 	return components
// }

// // healthCheckHandler provides a health check endpoint
// func (g *Gateway) healthCheckHandler(w http.ResponseWriter, r *http.Request) {
// 	health := map[string]interface{}{
// 		"status":    "healthy",
// 		"timestamp": time.Now().Unix(),
// 		"version":   "1.0.0",
// 	}

// 	w.Header().Set("Content-Type", "application/json")
// 	json.NewEncoder(w).Encode(health)
// }

// // getClientID extracts client identifier for rate limiting
// func (g *Gateway) getClientID(r *http.Request) string {
// 	// Try to get user ID from JWT token first
// 	if authHeader := r.Header.Get("Authorization"); authHeader != "" {
// 		token := strings.TrimPrefix(authHeader, "Bearer ")
// 		claims := &Claims{}
// 		if tkn, err := jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (interface{}, error) {
// 			return []byte(g.config.Auth.JWTSecret), nil
// 		}); err == nil &&
// 			tkn.Valid {
// 			return claims.User.ID
// 		}
// 	}

// 	// Fallback to IP address
// 	return r.RemoteAddr
// }

// // writeErrorResponse writes a standardized error response
// func (g *Gateway) writeErrorResponse(w http.ResponseWriter, statusCode int, message string) {
// 	w.Header().Set("Content-Type", "application/json")
// 	w.WriteHeader(statusCode)

// 	errorResponse := map[string]interface{}{
// 		"error": map[string]interface{}{
// 			"code":      statusCode,
// 			"message":   message,
// 			"timestamp": time.Now().Unix(),
// 		},
// 	}

// 	json.NewEncoder(w).Encode(errorResponse)
// }

// // Start starts the gateway server
// func (g *Gateway) Start() error {
// 	server := &http.Server{
// 		Addr:         ":" + strconv.Itoa(g.config.Server.Port),
// 		Handler:      g.router,
// 		ReadTimeout:  time.Duration(g.config.Server.ReadTimeout) * time.Second,
// 		WriteTimeout: time.Duration(g.config.Server.WriteTimeout) * time.Second,
// 	}

// 	log.Printf("Starting API Gateway on port %d", g.config.Server.Port)
// 	return server.ListenAndServe()
// }

// // ============================================================================
// // Main Function
// // ============================================================================

// func main() {
// 	config, err := pkg.LoadConfig("config.json")
// 	if err != nil {
// 		log.Fatal("Failed to load config:", err)
// 	}

// 	enforcer, err := casbin.NewEnforcer(config.Auth.CasbinModel, config.Auth.CasbinPolicy)
// 	if err != nil {
// 		log.Fatal("failed to create casbin enforcer:", err)
// 	}

// 	gateway, err := NewGateway("config.json")
// 	if err != nil {
// 		log.Fatal("Failed to create gateway:", err)
// 	}

// 	if err := gateway.Start(); err != nil {
// 		log.Fatal("Failed to start gateway:", err)
// 	}
// }
