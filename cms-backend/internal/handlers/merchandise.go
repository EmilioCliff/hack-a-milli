package handlers

import (
	"net/http"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/internal/repository"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
	"github.com/gin-gonic/gin"
)

type createProductReq struct {
	CategoryID  int64    `json:"category_id" binding:"required"`
	Name        string   `json:"name" binding:"required"`
	Price       float64  `json:"price" binding:"required"`
	ImageUrl    []string `json:"image_url" binding:"required"`
	Description string   `json:"description"`
}

func (s *Server) createProductHandler(ctx *gin.Context) {
	var req createProductReq
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}

	reqCtx, err := getRequestContext(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	product := &repository.Product{
		CategoryID:  req.CategoryID,
		Name:        req.Name,
		Price:       req.Price,
		ImageUrl:    req.ImageUrl,
		Description: nil,
		CreatedBy:   reqCtx.UserID,
		UpdatedBy:   reqCtx.UserID,
	}

	if req.Description != "" {
		product.Description = &req.Description
	}

	newProduct, err := s.repo.MerchRepository.CreateProduct(ctx, product)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"data": newProduct})
}

func (s *Server) getProductHandler(ctx *gin.Context) {
	id, err := pkg.StringToInt64(ctx.Param("id"))
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	product, err := s.repo.MerchRepository.GetProduct(ctx, id)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": product})
}

func (s *Server) updateProductHandler(ctx *gin.Context) {
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

	var req repository.UpdateProduct
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}

	req.ID = id
	req.UpdatedBy = reqCtx.UserID

	product, err := s.repo.MerchRepository.UpdateProduct(ctx, &req)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": product, "success": "Product updated successfully"})
}

func (s *Server) listProductsHandler(ctx *gin.Context) {
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

	filter := repository.ProductFilter{
		Pagination: &pkg.Pagination{
			Page:     pageNo,
			PageSize: pageSize,
		},
		Search:     nil,
		CategoryID: nil,
	}
	if search := ctx.Query("search"); search != "" {
		filter.Search = &search
	}
	if categoryID := ctx.Query("category_id"); categoryID != "" {
		catID, err := pkg.StringToInt64(categoryID)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
			return
		}
		filter.CategoryID = &catID
	}

	products, pagination, err := s.repo.MerchRepository.ListProducts(ctx, &filter)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data":       products,
		"pagination": pagination,
	})
}

func (s *Server) deleteProductHandler(ctx *gin.Context) {
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

	err = s.repo.MerchRepository.DeleteProduct(ctx, id, reqCtx.UserID)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"success": "Product deleted successfully"})
}
