package handlers

import (
	"net/http"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/internal/repository"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/internal/services"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
	"github.com/gin-gonic/gin"
)

func (s *Server) createChatHandler(ctx *gin.Context) {
	var req repository.ChatMessage
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}

	reqCtx, err := getRequestContext(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	createParams := &repository.Chat{
		UserID:   reqCtx.UserID,
		Title:    "", // default title empty will be set by gpt
		Messages: []repository.ChatMessage{req},
	}

	// send chat to gemini check if there is a title then add it
	rsp, title, err := s.chat.GenerateText(ctx, req.Content, []services.Message{}, s.getCompanyDocs(ctx))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	if title != "" {
		createParams.Title = title
	}

	createParams.Messages = append(createParams.Messages, repository.ChatMessage{
		Role:    "assistant",
		Content: rsp,
	})

	chat, err := s.repo.ChatRepository.CreateChat(ctx, createParams)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": rsp, "title": createParams.Title, "chat_id": chat.ID})
}

type addMessageToChatRequest struct {
	Message repository.ChatMessage   `json:"message" binding:"required"`
	History []repository.ChatMessage `json:"history" binding:"required"`
}

func (s *Server) addMessageToChatHandler(ctx *gin.Context) {
	var req addMessageToChatRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}

	id, err := pkg.StringToInt64(ctx.Param("id"))
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	rsp, _, err := s.chat.GenerateText(ctx, req.Message.Content, convertChatHistoryToServiceMessages(req.History), s.getCompanyDocs(ctx))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	req.History = append(req.History, req.Message)
	req.History = append(req.History, repository.ChatMessage{
		Role:    "assistant",
		Content: rsp,
	})

	err = s.repo.ChatRepository.AddMessageToChat(ctx, id, req.History)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": rsp})
}

func (s *Server) getChatByIDHandler(ctx *gin.Context) {
	id, err := pkg.StringToInt64(ctx.Param("id"))
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	chat, err := s.repo.ChatRepository.GetChatByID(ctx, id)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": chat})
}

func (s *Server) getChatsByUserIDHandler(ctx *gin.Context) {
	id, err := pkg.StringToInt64(ctx.Param("id"))
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	pageNoStr := ctx.DefaultQuery("page", "1")
	pageNo, err := pkg.StringToUint32(pageNoStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))

		return
	}

	pageSizeStr := ctx.DefaultQuery("limit", "10")
	pageSize, err := pkg.StringToUint32(pageSizeStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))

		return
	}

	pagination := &pkg.Pagination{
		Page:     pageNo,
		PageSize: pageSize,
	}

	data, pagination, err := s.repo.ChatRepository.GetChatsByUserID(ctx, id, pagination)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data":       data,
		"pagination": pagination,
	})
}

func (s *Server) deleteChatHandler(ctx *gin.Context) {
	id, err := pkg.StringToInt64(ctx.Param("id"))
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	err = s.repo.ChatRepository.DeleteChat(ctx, id)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": "chat deleted successfully"})
}

type createCompanyDocRequest struct {
	Title   string `json:"title" binding:"required"`
	Content string `json:"content" binding:"required"`
}

func (s *Server) createCompanyDocHandler(ctx *gin.Context) {
	var req createCompanyDocRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}

	createParams := &repository.CompanyDoc{
		Title:   req.Title,
		Content: req.Content,
	}

	doc, err := s.repo.ChatRepository.CreateCompanyDoc(ctx, createParams)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": doc})
}

func (s *Server) getAllCompanyDocsHandler(ctx *gin.Context) {
	docs, err := s.repo.ChatRepository.GetAllCompanyDocs(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": docs})
}

type updateCompanyDocRequest struct {
	Title   string `json:"title"`
	Content string `json:"content"`
}

func (s *Server) updateCompanyDocHandler(ctx *gin.Context) {
	var req updateCompanyDocRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}

	id, err := pkg.StringToInt64(ctx.Param("id"))
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	updateParams := &repository.CompanyDoc{
		ID: id,
	}
	if req.Title != "" {
		updateParams.Title = req.Title
	}
	if req.Content != "" {
		updateParams.Content = req.Content
	}

	err = s.repo.ChatRepository.UpdateCompanyDoc(ctx, updateParams)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": "company document updated successfully"})
}

func (s *Server) getCompanyDocByIDHandler(ctx *gin.Context) {
	id, err := pkg.StringToInt64(ctx.Param("id"))
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	doc, err := s.repo.ChatRepository.GetCompanyDocByID(ctx, id)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": doc})
}

func (s *Server) deleteCompanyDocHandler(ctx *gin.Context) {
	id, err := pkg.StringToInt64(ctx.Param("id"))
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	err = s.repo.ChatRepository.DeleteCompanyDoc(ctx, id)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": "company document deleted successfully"})
}

func (s *Server) getCompanyDocs(ctx *gin.Context) []string {
	docs, err := s.repo.ChatRepository.GetAllCompanyDocs(ctx)
	if err != nil {
		return []string{}
	}

	var content []string
	for i := range docs {
		content = append(content, docs[i].Content)
	}

	return content
}

func convertChatHistoryToServiceMessages(history []repository.ChatMessage) []services.Message {
	var messages []services.Message
	for _, msg := range history {
		messages = append(messages, services.Message{
			Role:    msg.Role,
			Content: msg.Content,
		})
	}

	return messages
}
