package handlers

import (
	"net/http"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/internal/repository"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
	"github.com/gin-gonic/gin"
)

type createRegistrarReq struct {
	Email        string   `json:"email" binding:"required"`
	Name         string   `json:"name" binding:"required"`
	LogoUrl      string   `json:"logo_url" binding:"required"`
	Address      string   `json:"address" binding:"required"`
	Specialities []string `json:"specialities" binding:"required"`
	PhoneNumber  string   `json:"phone_number" binding:"required"`
	WebsiteUrl   string   `json:"website_url" binding:"required"`
}

func (s *Server) createRegistrarHandler(ctx *gin.Context) {
	reqCtx, err := getRequestContext(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}
	var req createRegistrarReq
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}

	createdRegistrar, err := s.repo.RegistrarRepository.CreateRegistrar(ctx, &repository.Registrar{
		Email:        req.Email,
		Name:         req.Name,
		LogoUrl:      req.LogoUrl,
		Address:      req.Address,
		Specialities: req.Specialities,
		PhoneNumber:  req.PhoneNumber,
		WebsiteUrl:   req.WebsiteUrl,
		CreatedBy:    reqCtx.UserID,
		UpdatedBy:    reqCtx.UserID,
	})
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"data": createdRegistrar})
}

func (s *Server) getRegistrarHandler(ctx *gin.Context) {
	id, err := pkg.StringToInt64(ctx.Param("id"))
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	registrar, err := s.repo.RegistrarRepository.GetRegistrar(ctx, id)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": registrar})
}

func (s *Server) updateRegistrarHandler(ctx *gin.Context) {
	id, err := pkg.StringToInt64(ctx.Param("id"))
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	var req repository.UpdateRegistrar
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}
	req.ID = id

	reqCtx, err := getRequestContext(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}
	req.UpdatedBy = reqCtx.UserID

	registrar, err := s.repo.RegistrarRepository.UpdateRegistrar(ctx, &req)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": registrar})
}

func (s *Server) listRegistrarsHandler(ctx *gin.Context) {
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

	filter := repository.RegistrarFilter{
		Pagination: &pkg.Pagination{
			Page:     pageNo,
			PageSize: pageSize,
		},
		Search:       nil,
		Specialities: nil,
	}

	if search := ctx.Query("search"); search != "" {
		filter.Search = &search
	}

	if specialities := ctx.QueryArray("specialities"); len(specialities) > 0 {
		filter.Specialities = &specialities
	}

	registrars, pagination, err := s.repo.RegistrarRepository.ListRegistrars(ctx, &filter)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data":       registrars,
		"pagination": pagination,
	})
}

func (s *Server) deleteRegistrarHandler(ctx *gin.Context) {
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

	if err := s.repo.RegistrarRepository.DeleteRegistrar(ctx, id, reqCtx.UserID); err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"success": "Registrar deleted successfully"})
}
