package handlers

import (
	"net/http"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/internal/repository"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
	"github.com/gin-gonic/gin"
)

type createPreferenceReq struct {
	NotifyNews     bool `json:"notify_news"`
	NotifyEvents   bool `json:"notify_events"`
	NotifyTraining bool `json:"notify_training"`
	NotifyPolicy   bool `json:"notify_policy"`
}

func (s *Server) createUserPreferencesHandler(ctx *gin.Context) {
	id, err := pkg.StringToInt64(ctx.Param("id"))
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	var req createPreferenceReq
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}

	userPreference, err := s.repo.UserRepository.CreateUserPreferences(ctx, &repository.UserPreferences{
		UserID:         id,
		NotifyNews:     req.NotifyNews,
		NotifyEvents:   req.NotifyEvents,
		NotifyTraining: req.NotifyTraining,
		NotifyPolicy:   req.NotifyPolicy,
	})
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"data": userPreference})
}

func (s *Server) listUserPreferencesHandler(ctx *gin.Context) {
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

	filter := repository.UserPreferencesFilter{
		Pagination: &pkg.Pagination{
			Page:     pageNo,
			PageSize: pageSize,
		},
	}

	userPreferences, pagination, err := s.repo.UserRepository.ListUserPreferences(ctx, &filter)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"data":       userPreferences,
		"pagination": pagination,
	})
}

func (s *Server) updateUserPreferencesHandler(ctx *gin.Context) {
	id, err := pkg.StringToInt64(ctx.Param("id"))
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	var req repository.UpdateUserPreferences
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}
	req.UserID = id

	userPreference, err := s.repo.UserRepository.UpdateUserPreference(ctx, &req)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"data": userPreference})
}

func (s *Server) getUserPreferencesHandler(ctx *gin.Context) {
	id, err := pkg.StringToInt64(ctx.Param("id"))
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	userPreference, err := s.repo.UserRepository.GetUserPreference(ctx, id)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": userPreference})
}
