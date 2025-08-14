package handlers

import (
	"net/http"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/internal/repository"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
	"github.com/gin-gonic/gin"
)

type createEventReq struct {
	Title        string                `json:"title" binding:"required"`
	Topic        string                `json:"topic" binding:"required"`
	Content      string                `json:"content" binding:"required"`
	CoverImg     string                `json:"cover_img" binding:"required"`
	StartTime    string                `json:"start_time" binding:"required"`
	EndTime      string                `json:"end_time" binding:"required"`
	Status       string                `json:"status" binding:"required"`
	MaxAttendees int32                 `json:"max_attendees" binding:"required"`
	Price        string                `json:"price"`
	Tags         []string              `json:"tags"`
	Venue        repository.Venue      `json:"venue"`
	Agenda       []repository.Agenda   `json:"agenda"`
	Organizers   []repository.Company  `json:"organizers"`
	Partners     []repository.Company  `json:"partners"`
	Speakers     []repository.Speakers `json:"speakers"`
}

func (s *Server) createEventHandler(ctx *gin.Context) {
	var req createEventReq
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}

	reqCtx, err := getRequestContext(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	event := &repository.Event{
		Title:        req.Title,
		Topic:        req.Topic,
		Content:      req.Content,
		CoverImg:     req.CoverImg,
		StartTime:    req.StartTime,
		EndTime:      req.EndTime,
		Status:       req.Status,
		MaxAttendees: req.MaxAttendees,
		Price:        req.Price,
		Tags:         req.Tags,
		Venue:        req.Venue,
		Agenda:       req.Agenda,
		Organizers:   req.Organizers,
		Partners:     req.Partners,
		Speakers:     req.Speakers,
		CreatedBy:    reqCtx.UserID,
		UpdatedBy:    reqCtx.UserID,
	}

	createdEvent, err := s.repo.EventRepository.CreateEvent(ctx, event)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"data": createdEvent})
}

func (s *Server) getEventHandler(ctx *gin.Context) {
	id, err := pkg.StringToInt64(ctx.Param("id"))
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	event, err := s.repo.EventRepository.GetEvent(ctx, id)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": event})
}

func (s *Server) updateEventHandler(ctx *gin.Context) {
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

	var req repository.UpdateEvent
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}
	req.ID = id
	req.UpdatedBy = reqCtx.UserID

	event, err := s.repo.EventRepository.UpdateEvent(ctx, &req)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": event})
}

func (s *Server) publishEventHandler(ctx *gin.Context) {
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

	event, err := s.repo.EventRepository.PublishEvent(ctx, id, reqCtx.UserID)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data":    event,
		"success": "Event published successfully",
	})
}

func (s *Server) listEventsHandler(ctx *gin.Context) {
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

	filter := repository.EventFilter{
		Pagination: &pkg.Pagination{
			Page:     pageNo,
			PageSize: pageSize,
		},
		Search:    nil,
		Status:    nil,
		Published: nil,
		StartTime: nil,
		EndTime:   nil,
		Tags:      nil,
	}

	if search := ctx.Query("search"); search != "" {
		filter.Search = &search
	}
	if status := ctx.Query("status"); status != "" {
		filter.Status = &status
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
		filter.StartTime = &startTime
	}
	if endDate := ctx.Query("end_date"); endDate != "" {
		endTime := pkg.StringToTime(endDate)
		filter.EndTime = &endTime
	}
	if tags := ctx.QueryArray("tags"); len(tags) > 0 {
		filter.Tags = &tags
	}

	data, pagination, err := s.repo.EventRepository.ListEvent(ctx, &filter)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data":       data,
		"pagination": pagination,
	})

}

func (s *Server) deleteEventHandler(ctx *gin.Context) {
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

	err = s.repo.EventRepository.DeleteEvent(ctx, id, reqCtx.UserID)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"success": "Event deleted successfully"})
}

type addEventAttendeeReq struct {
	Name  string `json:"name" binding:"required"`
	Email string `json:"email" binding:"required"`
}

func (s *Server) addEventAttendeeHandler(ctx *gin.Context) {
	id, err := pkg.StringToInt64(ctx.Param("id"))
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	var req addEventAttendeeReq
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}

	attendee, err := s.repo.EventRepository.CreateEventRegistrant(ctx, &repository.EventRegistrant{
		EventID: id,
		Name:    req.Name,
		Email:   req.Email,
	})
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"data": attendee})
}

func (s *Server) listEventAttendeesHandler(ctx *gin.Context) {
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

	registrants, pagination, err := s.repo.EventRepository.ListEventRegistrants(ctx, id, &pkg.Pagination{
		Page:     pageNo,
		PageSize: pageSize,
	})
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data":       registrants,
		"pagination": pagination,
	})
}
