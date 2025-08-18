package handlers

import (
	"net/http"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/internal/repository"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
	"github.com/gin-gonic/gin"
)

type createBlogReq struct {
	Title       string `json:"title" binding:"required"`
	CoverImg    string `json:"cover_img" binding:"required"`
	Topic       string `json:"topic" binding:"required"`
	Description string `json:"description" binding:"required"`
	Content     string `json:"content" binding:"required"`
	MinRead     int32  `json:"min_read" binding:"required"`
}

func (s *Server) createBlogHandler(ctx *gin.Context) {
	var req createBlogReq
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}

	reqCtx, err := getRequestContext(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	blog := &repository.Blog{
		Title:       req.Title,
		Author:      reqCtx.UserID,
		CoverImg:    req.CoverImg,
		Topic:       req.Topic,
		Description: req.Description,
		Content:     req.Content,
		MinRead:     req.MinRead,
		UpdatedBy:   reqCtx.UserID,
		CreatedBy:   reqCtx.UserID,
	}

	createdBlog, err := s.repo.BlogRepository.CreateBlog(ctx, blog)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"data": createdBlog})
}

func (s *Server) getBlogHandler(ctx *gin.Context) {
	id, err := pkg.StringToInt64(ctx.Param("id"))
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	blog, err := s.repo.BlogRepository.GetBlog(ctx, id)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}
	if publishedScope := ctx.GetHeader("X-Published-Only"); publishedScope == "true" {
		if !blog.Published {
			ctx.JSON(http.StatusNotFound, errorResponse(pkg.Errorf(pkg.NOT_FOUND_ERROR, "Blog not found or not published")))
			return
		}
	}

	ctx.JSON(http.StatusOK, gin.H{"data": blog})
}

func (s *Server) getPublishedBlogHandler(ctx *gin.Context) {
	id, err := pkg.StringToInt64(ctx.Param("id"))
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	blog, err := s.repo.BlogRepository.GetPublishedBlog(ctx, id)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": blog})
}

func (s *Server) updateBlogHandler(ctx *gin.Context) {
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

	var req repository.UpdateBlog
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}
	req.ID = id
	req.UpdatedBy = reqCtx.UserID

	blog, err := s.repo.BlogRepository.UpdateBlog(ctx, &req)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": blog})
}

func (s *Server) publishBlogHandler(ctx *gin.Context) {
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

	blog, err := s.repo.BlogRepository.PublishBlog(ctx, id, reqCtx.UserID)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data":    blog,
		"success": "Blog published successfully",
	})
}

func (s *Server) listBlogsHandler(ctx *gin.Context) {
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

	filter := repository.BlogFilter{
		Pagination: &pkg.Pagination{
			Page:     pageNo,
			PageSize: pageSize,
		},
		Search:    nil,
		Published: nil,
		Author:    nil,
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

	if publishedScope := ctx.GetHeader("X-Published-Only"); publishedScope == "true" {
		published := true // Default to published blogs
		filter.Published = &published
	}

	if author := ctx.Query("author"); author != "" {
		authorId, err := pkg.StringToInt64(author)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, errorResponse(err))
			return
		}

		filter.Author = &authorId
	}

	blogs, pagination, err := s.repo.BlogRepository.ListBlogs(ctx, &filter)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data":       blogs,
		"pagination": pagination,
	})
}

func (s *Server) listPublishedBlogsHandler(ctx *gin.Context) {
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

	published := true // Default to published blogs
	filter := repository.BlogFilter{
		Pagination: &pkg.Pagination{
			Page:     pageNo,
			PageSize: pageSize,
		},
		Published: &published,
		Search:    nil,
		Author:    nil,
	}

	if search := ctx.Query("search"); search != "" {
		filter.Search = &search
	}

	if author := ctx.Query("author"); author != "" {
		authorId, err := pkg.StringToInt64(author)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, errorResponse(err))
			return
		}

		filter.Author = &authorId
	}

	blogs, pagination, err := s.repo.BlogRepository.ListBlogs(ctx, &filter)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data":       blogs,
		"pagination": pagination,
	})
}

func (s *Server) deleteBlogHandler(ctx *gin.Context) {
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

	if err := s.repo.BlogRepository.DeleteBlog(ctx, id, reqCtx.UserID); err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"success": "Blog deleted successfully"})
}
