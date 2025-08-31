package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type sendInqueryMessageReq struct {
	FirstName string `json:"first_name" binding:"required"`
	LastName  string `json:"last_name" binding:"required"`
	Email     string `json:"email" binding:"required,email"`
	Subject   string `json:"subject" binding:"required"`
	Message   string `json:"message" binding:"required"`
}

func (s *Server) sendInqueryMessageHandler(ctx *gin.Context) {
	var req sendInqueryMessageReq
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// send message to super_admin or save to database

	ctx.JSON(http.StatusOK, gin.H{"data": "Inquery message sent successfully"})
}
