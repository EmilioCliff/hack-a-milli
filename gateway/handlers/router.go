package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"strings"
	"sync"
	"time"

	"github.com/EmilioCliff/hack-a-milli/gateway/pkg"
	"github.com/gin-gonic/gin"
)

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
		go func(index int, url string) {
			defer wg.Done()

			req, err := http.NewRequest("GET", url, nil)
			if err != nil {
				responses[index] = ServiceResponse{URL: url, Err: err}
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
				responses[index] = ServiceResponse{URL: url, Err: err}
				return
			}
			defer resp.Body.Close()

			// Read response
			body, err := io.ReadAll(resp.Body)
			if err != nil {
				responses[index] = ServiceResponse{URL: url, Err: err}
				return
			}

			// Parse JSON response
			var data interface{}
			if err := json.Unmarshal(body, &data); err != nil {
				responses[index] = ServiceResponse{URL: url, Err: err}
				return
			}

			responses[index] = ServiceResponse{URL: url, Data: data}
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

func (s *Server) handleProxyRequest(ctx *gin.Context, route pkg.Route, authCtx *AuthContext) {
	backendURL := route.BackendURL

	// Parse backend URL
	target, err := url.Parse(backendURL)
	if err != nil {
		// s.writeErrorResponse(w, http.StatusInternalServerError, "Invalid backend URL")
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

		// Add original host header
		req.Header.Set("X-Forwarded-Host", ctx.Request.Host)
		req.Header.Set("X-Forwarded-Proto", "http")
		if ctx.Request.TLS != nil {
			req.Header.Set("X-Forwarded-Proto", "https")
		}
	}

	// Handle proxy errors
	proxy.ErrorHandler = func(w http.ResponseWriter, r *http.Request, err error) {
		log.Printf("Proxy error for %s: %v", backendURL, err)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadGateway)

		errorResponse := map[string]interface{}{
			"error": map[string]interface{}{
				"code":    http.StatusBadGateway,
				"message": "Backend service error",
				"error":   err.Error(),
			},
		}

		json.NewEncoder(w).Encode(errorResponse)
	}

	// Execute request with timeout
	timeout := time.Duration(route.Timeout) * time.Second
	if timeout == 0 {
		timeout = 30 * time.Second
	}

	ctxTimeout, cancel := context.WithTimeout(ctx, timeout)
	defer cancel()

	proxy.ServeHTTP(ctx.Writer, ctx.Request.WithContext(ctxTimeout))
}
