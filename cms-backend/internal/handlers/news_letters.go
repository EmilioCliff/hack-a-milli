package handlers

import (
	"net/http"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/internal/repository"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
	"github.com/gin-gonic/gin"
)

type newsLetterReq struct {
	Title       string `json:"title" binding:"required"`
	Description string `json:"description" binding:"required"`
	PdfUrl      string `json:"pdf_url" binding:"required"`
	Date        string `json:"date" binding:"required"`
}

func (s *Server) createNewsletterHandler(ctx *gin.Context) {
	var req newsLetterReq
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}

	reqCtx, err := getRequestContext(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	newLetter := &repository.NewsLetter{
		Title:       req.Title,
		Description: req.Description,
		PdfUrl:      req.PdfUrl,
		Date:        pkg.StringToTime(req.Date),
		CreatedBy:   reqCtx.UserID,
		UpdatedBy:   reqCtx.UserID,
	}

	newsLetter, err := s.repo.NewsRepository.CreateNewsLetter(ctx, newLetter)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"data": newsLetter})
}

func (s *Server) getNewsletterHandler(ctx *gin.Context) {
	id, err := pkg.StringToInt64(ctx.Param("id"))
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	newLetter, err := s.repo.NewsRepository.GetNewsLetter(ctx, id)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": newLetter})
}

func (s *Server) updateNewsletterHandler(ctx *gin.Context) {
	id, err := pkg.StringToInt64(ctx.Param("id"))
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	reqCtx, err := getRequestContext(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	var req repository.UpdateNewsLetter
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}
	req.ID = id
	req.UpdatedBy = reqCtx.UserID

	newLetter, err := s.repo.NewsRepository.UpdateNewsLetter(ctx, &req)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": newLetter})
}

func (s *Server) publishNewsletterHandler(ctx *gin.Context) {
	id, err := pkg.StringToInt64(ctx.Param("id"))
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	reqCtx, err := getRequestContext(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	newLetter, err := s.repo.NewsRepository.PublishNewsLetter(ctx, id, reqCtx.UserID)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data":    newLetter,
		"success": "Newsletter published successfully",
	})
}

func (s *Server) listNewslettersHandler(ctx *gin.Context) {
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

	filter := repository.NewsLetterFilter{
		Pagination: &pkg.Pagination{
			Page:     pageNo,
			PageSize: pageSize,
		},
		Search:    nil,
		Published: nil,
		StartDate: nil,
		EndDate:   nil,
	}

	if search := ctx.Query("search"); search != "" {
		filter.Search = &search
	}

	if published := ctx.Query("published"); published != "" {
		publishedBool, err := pkg.StringToBool(published)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, errorResponse(err))
			return
		}
		filter.Published = &publishedBool
	}

	if startDate := ctx.Query("start_date"); startDate != "" {
		startTime := pkg.StringToTime(startDate)
		filter.StartDate = &startTime
	}

	if endDate := ctx.Query("end_date"); endDate != "" {
		endTime := pkg.StringToTime(endDate)
		filter.EndDate = &endTime
	}

	newsletters, pagination, err := s.repo.NewsRepository.ListNewsLetters(ctx, &filter)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data":       newsletters,
		"pagination": pagination,
	})
}

func (s *Server) deleteNewsletterHandler(ctx *gin.Context) {
	id, err := pkg.StringToInt64(ctx.Param("id"))
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	reqCtx, err := getRequestContext(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	err = s.repo.NewsRepository.DeleteNewsLetter(ctx, id, reqCtx.UserID)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"success": "Newsletter deleted successfully"})
}
