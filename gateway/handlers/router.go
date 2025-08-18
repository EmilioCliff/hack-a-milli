package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/http/httputil"
	"net/url"
	"strings"
	"sync"
	"time"

	"github.com/EmilioCliff/hack-a-milli/gateway/pkg"
	"github.com/gin-gonic/gin"
)

func (s *Server) handleProxyRequest(ctx *gin.Context, route pkg.Route, authCtx *AuthContext) {
	baseURL, ok := s.config.Backends[route.Host]
	if !ok {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Unknown backend host"})
		return
	}

	// Parse backend URL
	target, err := url.Parse(baseURL)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid backend URL"})
		return
	}

	// Create reverse proxy
	proxy := httputil.NewSingleHostReverseProxy(target)

	// Customize the request
	originalDirector := proxy.Director
	proxy.Director = func(req *http.Request) {
		originalDirector(req)

		if authCtx.Payload != nil {
			req.Header.Set("X-User-ID", fmt.Sprintf("%v", authCtx.Payload.UserID))
			req.Header.Set("X-User-Email", authCtx.Payload.Email)
			req.Header.Set("X-User-Roles", strings.Join(authCtx.Payload.Roles, ","))
		}

		// Check if published-only header should be set
		if publishedOnly, exists := ctx.Get("X-Published-Only"); exists && publishedOnly == "true" {
			req.Header.Set("X-Published-Only", "true")
		}

		// Add original host header
		req.Header.Set("X-Forwarded-Host", ctx.Request.Host)
		req.Header.Set("X-Forwarded-Proto", "http")
		if ctx.Request.TLS != nil {
			req.Header.Set("X-Forwarded-Proto", "https")
		}
	}

	// Handle proxy errors
	proxy.ErrorHandler = func(w http.ResponseWriter, r *http.Request, err error) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadGateway)

		errorResponse := map[string]interface{}{
			"status_code": http.StatusBadGateway,
			"message":     fmt.Sprintf("Backend service error: %s", err.Error()),
		}

		json.NewEncoder(w).Encode(errorResponse)
	}

	proxy.ServeHTTP(ctx.Writer, ctx.Request)
}

func (s *Server) handleComposedRequest(ctx *gin.Context, route pkg.Route, authCtx *AuthContext) {
	type ServiceResponse struct {
		URL  string      `json:"url"`
		Data interface{} `json:"data"`
		Err  error       `json:"-"`
	}

	responses := make([]ServiceResponse, len(route.Compose))
	var wg sync.WaitGroup

	// Make concurrent requests to all backend services
	for i, serviceURL := range route.Compose {
		wg.Add(1)
		go func(index int, composeBackend pkg.ComposeBackends) {
			defer wg.Done()

			baseURL, ok := s.config.Backends[composeBackend.Host]
			if !ok {
				ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Unknown backend host"})
				return
			}

			backendPath := replacePathParams(composeBackend.URLPattern, ctx.Params)
			backendURL := baseURL + backendPath

			req, err := http.NewRequest("GET", backendURL, nil)
			if err != nil {
				responses[index] = ServiceResponse{URL: backendURL, Err: err}
				return
			}

			if authCtx.Payload != nil {
				req.Header.Set("X-User-ID", fmt.Sprintf("%v", authCtx.Payload.UserID))
				req.Header.Set("X-User-Email", authCtx.Payload.Email)
				req.Header.Set("X-User-Roles", strings.Join(authCtx.Payload.Roles, ","))
			}

			// Execute request
			client := &http.Client{Timeout: 10 * time.Second}
			resp, err := client.Do(req)
			if err != nil {
				responses[index] = ServiceResponse{URL: backendURL, Err: err}
				return
			}
			defer resp.Body.Close()

			// Read response
			body, err := io.ReadAll(resp.Body)
			if err != nil {
				responses[index] = ServiceResponse{URL: backendURL, Err: err}
				return
			}

			// Parse JSON response
			var data interface{}
			if err := json.Unmarshal(body, &data); err != nil {
				responses[index] = ServiceResponse{URL: backendURL, Err: err}
				return
			}

			responses[index] = ServiceResponse{URL: backendURL, Data: data}
		}(i, serviceURL)
	}

	wg.Wait()

	// Prepare composed response
	composedResponse := make(map[string]interface{})
	hasErrors := false

	for _, resp := range responses {
		if resp.Err != nil {
			hasErrors = true
			composedResponse[resp.URL] = map[string]string{"error": resp.Err.Error()}
		} else {
			composedResponse[resp.URL] = resp.Data
		}
	}

	// Set appropriate status code
	statusCode := http.StatusOK
	if hasErrors {
		statusCode = http.StatusPartialContent
	}

	ctx.JSON(statusCode, composedResponse)
}

func replacePathParams(pattern string, params gin.Params) string {
	result := pattern

	for _, param := range params {
		placeholder := fmt.Sprintf(":%s", param.Key)

		result = strings.ReplaceAll(result, placeholder, param.Value)
	}

	return result
}
