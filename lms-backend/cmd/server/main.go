package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.Use(middleware())

	server := &http.Server{
		Addr:    ":8000",
		Handler: r,
	}

	type course struct {
		Id      int32  `json:"id" binding:"required"`
		Name    string `json:"name" binding:"required"`
		Content string `json:"content"`
	}

	r.GET("/api/courses", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{"courses": "Here is your courses"})
	})
	r.POST("/api/courses", func(ctx *gin.Context) {
		var req course
		if err := ctx.BindJSON(&req); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		ctx.JSON(http.StatusAccepted, req)
	})
	r.GET("/api/courses/:id", func(ctx *gin.Context) {
		id := ctx.Param("id")
		log.Println(id)

		ctx.JSON(http.StatusAccepted, gin.H{"course": "Here is your course", "id": id})
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
