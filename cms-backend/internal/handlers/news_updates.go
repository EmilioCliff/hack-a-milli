package handlers

import (
	"net/http"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/internal/repository"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
	"github.com/gin-gonic/gin"
)

type NewsUpdate struct {
	Title    string `json:"title" binding:"required"`
	Topic    string `json:"topic" binding:"required"`
	Excerpt  string `json:"excerpt" binding:"required"`
	Date     string `json:"date" binding:"required"`
	MinRead  int32  `json:"min_read" binding:"required"`
	Content  string `json:"content" binding:"required"`
	CoverImg string `json:"cover_img" binding:"required"`
}

func (s *Server) createNewsHandler(ctx *gin.Context) {
	var req NewsUpdate
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}

	reqCtx, err := getRequestContext(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	newsUpdate := &repository.NewsUpdate{
		Title:     req.Title,
		Topic:     req.Topic,
		Date:      pkg.StringToTime(req.Date),
		MinRead:   req.MinRead,
		Content:   req.Content,
		Excerpt:   req.Excerpt,
		CoverImg:  req.CoverImg,
		UpdatedBy: reqCtx.UserID,
		CreatedBy: reqCtx.UserID,
	}

	news, err := s.repo.NewsRepository.CreateNewsUpdate(ctx, newsUpdate)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"data": news})
}

func (s *Server) getNewsHandler(ctx *gin.Context) {
	id, err := pkg.StringToInt64(ctx.Param("id"))
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	news, err := s.repo.NewsRepository.GetNewsUpdate(ctx, id)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": news})
}

func (s *Server) getPublishedNewsHandler(ctx *gin.Context) {
	id, err := pkg.StringToInt64(ctx.Param("id"))
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	news, err := s.repo.NewsRepository.GetPublishedNewsUpdate(ctx, id)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	relatedUpdates, err := s.repo.NewsRepository.GetNewsUpdateByTopicRelations(ctx, news.Topic)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": news, "related_updates": relatedUpdates})
}

func (s *Server) updateNewsHandler(ctx *gin.Context) {
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

	var req repository.UpdateNewsUpdate
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}
	req.ID = id
	req.UpdatedBy = reqCtx.UserID

	news, err := s.repo.NewsRepository.UpdateNewsUpdate(ctx, &req)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": news})
}

func (s *Server) publishNewsHandler(ctx *gin.Context) {
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

	data, err := s.repo.NewsRepository.PublishNewsUpdate(ctx, id, reqCtx.UserID)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data":    data,
		"success": "News published successfully",
	})

}

func (s *Server) listNewsHandler(ctx *gin.Context) {
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

	filter := repository.NewsUpdateFilter{
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

	newsUpdates, pagination, err := s.repo.NewsRepository.ListNewsUpdate(ctx, &filter)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data":       newsUpdates,
		"pagination": pagination,
	})
}

func (s *Server) listPublishedNewsHandler(ctx *gin.Context) {
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

	published := true // Default to true for published news updates
	filter := repository.NewsUpdateFilter{
		Pagination: &pkg.Pagination{
			Page:     pageNo,
			PageSize: pageSize,
		},
		Published: &published,
		Search:    nil,
		StartDate: nil,
		EndDate:   nil,
	}

	if search := ctx.Query("search"); search != "" {
		filter.Search = &search
	}
	if startDate := ctx.Query("start_date"); startDate != "" {
		startTime := pkg.StringToTime(startDate)
		filter.StartDate = &startTime
	}

	if endDate := ctx.Query("end_date"); endDate != "" {
		endTime := pkg.StringToTime(endDate)
		filter.EndDate = &endTime
	}

	newsUpdates, pagination, err := s.repo.NewsRepository.ListNewsUpdate(ctx, &filter)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data":       newsUpdates,
		"pagination": pagination,
	})
}

func (s *Server) deleteNewsHandler(ctx *gin.Context) {
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

	err = s.repo.NewsRepository.DeleteNewsUpdate(ctx, id, reqCtx.UserID)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"success": "News deleted successfully"})
}
