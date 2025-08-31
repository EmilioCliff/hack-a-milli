package handlers

import (
	"net/http"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/internal/repository"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
	"github.com/gin-gonic/gin"
)

type createJobPostingReq struct {
	Title          string `json:"title" binding:"required"`
	DepartmentID   int64  `json:"department_id" binding:"required"`
	Location       string `json:"location" binding:"required"`
	EmploymentType string `json:"employment_type" binding:"required"`
	Content        string `json:"content" binding:"required"`
	StartDate      string `json:"start_date" binding:"required"`
	EndDate        string `json:"end_date" binding:"required"`
	SalaryRange    string `json:"salary_range"`
}

func (s *Server) createJobPostingHandler(ctx *gin.Context) {
	var req createJobPostingReq
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}

	reqCtx, err := getRequestContext(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	jobPosting := &repository.JobPosting{
		Title:          req.Title,
		DepartmentID:   req.DepartmentID,
		Location:       req.Location,
		EmploymentType: req.EmploymentType,
		Content:        req.Content,
		StartDate:      pkg.StringToTime(req.StartDate),
		EndDate:        pkg.StringToTime(req.EndDate),
		SalaryRange:    nil,
		CreatedBy:      reqCtx.UserID,
		UpdatedBy:      reqCtx.UserID,
	}

	if req.SalaryRange != "" {
		jobPosting.SalaryRange = &req.SalaryRange
	}

	job, err := s.repo.CareerRepository.CreateJobPosting(ctx, jobPosting)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"data": job})
}

func (s *Server) getJobPostingHandler(ctx *gin.Context) {
	id, err := pkg.StringToInt64(ctx.Param("id"))
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	jobPosting, err := s.repo.CareerRepository.GetJobPosting(ctx, id)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	if publishedScope := ctx.GetHeader("X-Published-Only"); publishedScope == "true" {
		if !jobPosting.Published {
			ctx.JSON(http.StatusNotFound, errorResponse(pkg.Errorf(pkg.NOT_FOUND_ERROR, "Blog not found or not published")))
			return
		}
	}

	ctx.JSON(http.StatusOK, gin.H{"data": jobPosting})
}

func (s *Server) getPublishedJobPostingHandler(ctx *gin.Context) {
	id, err := pkg.StringToInt64(ctx.Param("id"))
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	jobPosting, err := s.repo.CareerRepository.GetPublishedJobPosting(ctx, id)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": jobPosting})
}

func (s *Server) updateJobPostingHandler(ctx *gin.Context) {
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

	var req repository.UpdateJobPosting
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}
	req.ID = id
	req.UpdatedBy = reqCtx.UserID

	jobPosting, err := s.repo.CareerRepository.UpdateJobPosting(ctx, &req)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": jobPosting})
}

func (s *Server) publishJobPostingHandler(ctx *gin.Context) {
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

	job, err := s.repo.CareerRepository.PublishJobPosting(ctx, id, reqCtx.UserID)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": job})
}

func (s *Server) closeJobPostingHandler(ctx *gin.Context) {
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

	var req struct {
		ShowCase bool `json:"show_case"`
	}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}

	job, err := s.repo.CareerRepository.ChangeJobPostingVisibility(ctx, id, reqCtx.UserID, req.ShowCase)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data":    job,
		"success": "Job posting closed successfully",
	})
}

func (s *Server) listJobPostingsHandler(ctx *gin.Context) {
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

	filter := repository.JobPostingFilter{
		Pagination: &pkg.Pagination{
			Page:     pageNo,
			PageSize: pageSize,
		},
		Search:         nil,
		Published:      nil,
		EmploymentType: nil,
		ShowCase:       nil,
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

	if employmentType := ctx.Query("employment_type"); employmentType != "" {
		filter.EmploymentType = &employmentType
	}

	if showCase := ctx.Query("show_case"); showCase != "" {
		showCaseBool, err := pkg.StringToBool(showCase)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, errorResponse(err))
			return
		}
		filter.ShowCase = &showCaseBool
	}

	jobPostings, pagination, err := s.repo.CareerRepository.ListJobPosting(ctx, &filter)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data":       jobPostings,
		"pagination": pagination,
	})
}

func (s *Server) listPublishedJobPostingsHandler(ctx *gin.Context) {
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

	published := true // Default to published job postings
	filter := repository.JobPostingFilter{
		Pagination: &pkg.Pagination{
			Page:     pageNo,
			PageSize: pageSize,
		},
		Published:      &published,
		ShowCase:       &published, // Show only job postings that are showcased
		Search:         nil,
		EmploymentType: nil,
	}

	if search := ctx.Query("search"); search != "" {
		filter.Search = &search
	}
	if employmentType := ctx.Query("employment_type"); employmentType != "" {
		filter.EmploymentType = &employmentType
	}

	jobPostings, pagination, err := s.repo.CareerRepository.ListJobPosting(ctx, &filter)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data":       jobPostings,
		"pagination": pagination,
	})
}

func (s *Server) deleteJobPostingHandler(ctx *gin.Context) {
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

	err = s.repo.CareerRepository.DeleteJobPosting(ctx, id, reqCtx.UserID)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"success": "Job posting deleted successfully"})
}
