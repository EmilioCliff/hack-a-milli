package handlers

import (
	"log"

	"github.com/gin-gonic/gin"
)

func (s *Server) smsCallbackHandler(ctx *gin.Context) {
	var rq any
	if err := ctx.ShouldBindJSON(&rq); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	log.Println("Received SMS callback:", rq)
	ctx.JSON(200, gin.H{"status": "received"})
}
