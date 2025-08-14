package handlers

import (
	"net/http"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/internal/repository"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
	"github.com/gin-gonic/gin"
)

type createDeviceReq struct {
	DeviceToken string `json:"device_token" binding:"required"`
	Platform    string `json:"platform" binding:"required"`
}

func (s *Server) createDeviceTokenHandler(ctx *gin.Context) {
	id, err := pkg.StringToInt64(ctx.Param("id"))
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	var req createDeviceReq
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}

	deviceToken, err := s.repo.UserRepository.CreateDeviceToken(ctx, &repository.DeviceToken{
		UserID:      id,
		DeviceToken: req.DeviceToken,
		Platform:    req.Platform,
	})
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"data": deviceToken})
}

func (s *Server) listDeviceTokensHandler(ctx *gin.Context) {
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

	filter := repository.DeviceTokenFilter{
		Pagination: &pkg.Pagination{
			Page:     pageNo,
			PageSize: pageSize,
		},
		Active:   nil,
		Platform: nil,
	}

	if active := ctx.Query("active"); active != "" {
		activeBool, err := pkg.StringToBool(active)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, errorResponse(err))
			return
		}
		filter.Active = &activeBool
	}

	if platform := ctx.Query("platform"); platform != "" {
		filter.Platform = &platform
	}

	deviceTokens, pagination, err := s.repo.UserRepository.ListDeviceToken(ctx, &filter)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data":       deviceTokens,
		"pagination": pagination,
	})
}

func (s *Server) getDeviceTokenHandler(ctx *gin.Context) {
	id, err := pkg.StringToInt64(ctx.Param("id"))
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	deviceToken, err := s.repo.UserRepository.GetDeviceTokenByID(ctx, id)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"data": deviceToken})
}

func (s *Server) getUserDeviceTokensHandler(ctx *gin.Context) {
	id, err := pkg.StringToInt64(ctx.Param("id"))
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	deviceTokens, err := s.repo.UserRepository.GetDeviceTokenByUserID(ctx, id)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": deviceTokens})
}

func (s *Server) updateDeviceTokenHandler(ctx *gin.Context) {
	var req struct {
		Active bool `json:"active" binding:"required"`
	}

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}

	id, err := pkg.StringToInt64(ctx.Param("id"))
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	err = s.repo.UserRepository.UpdateDeviceToken(ctx, req.Active, id)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"success": "Device token updated successfully"})
}
