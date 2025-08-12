package main

import (
	"log"
	"net/http"
	"time"

	"github.com/EmilioCliff/hack-a-milli/backen/pkg"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func main() {
	r := gin.Default()

	r.Use(middleware())

	server := &http.Server{
		Addr:    ":7000",
		Handler: r,
	}

	tokenMaker := pkg.NewJWTMaker("12345678901234567890123456789012")

	type blog struct {
		Id      int32  `json:"id" binding:"required"`
		Name    string `json:"name" binding:"required"`
		Content string `json:"content"`
	}

	type loginUser struct {
		ID          uuid.UUID `json:"id" binding:"required"`
		UserID      uint32    `json:"user_id" binding:"required"`
		Email       string    `json:"email" binding:"required"`
		Roles       []string  `json:"roles" binding:"required"`
		Permissions []string  `json:"permissions" binding:"required"`
	}

	r.POST("/api/login", func(ctx *gin.Context) {
		var req loginUser
		if err := ctx.BindJSON(&req); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		token, err := tokenMaker.CreateToken(req.Email, req.UserID, req.Roles, req.Permissions, time.Hour)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		ctx.JSON(http.StatusOK, gin.H{"token": token})
	})

	r.GET("/api/blogs", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{"blog": "Here is your blog"})
	})
	r.GET("/api/events", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{"events": "Here is your events"})
	})
	r.POST("/api/blogs", func(ctx *gin.Context) {
		var req blog
		if err := ctx.BindJSON(&req); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		ctx.JSON(http.StatusAccepted, req)
	})
	r.GET("/api/blogs/:id", func(ctx *gin.Context) {
		id := ctx.Param("id")
		log.Println(id)

		ctx.JSON(http.StatusAccepted, gin.H{"blog": "Here is your blog", "id": id})
	})
	r.PUT("/api/blogs/:id", func(ctx *gin.Context) {
		id := ctx.Param("id")
		log.Println(id)

		ctx.JSON(http.StatusAccepted, gin.H{"message": "changed"})
	})
	r.DELETE("/api/blogs/:id", func(ctx *gin.Context) {
		id := ctx.Param("id")
		log.Println(id)

		ctx.JSON(http.StatusAccepted, gin.H{"message": "deleted"})
	})

	log.Println("Starting server at port: ", server.Addr)
	log.Fatal(server.ListenAndServe())
	log.Println("server stopped")
}

func middleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		log.Println("X-User-ID:", ctx.GetHeader("X-User-ID"))
		log.Println("X-User-Email:", ctx.GetHeader("X-User-Email"))
		log.Println("X-User-Roles:", ctx.GetHeader("X-User-Roles"))
		log.Println("X-Forwarded-Host:", ctx.GetHeader("X-Forwarded-Host"))
		log.Println("X-Forwarded-Proto:", ctx.GetHeader("X-Forwarded-Proto"))
	}
}
