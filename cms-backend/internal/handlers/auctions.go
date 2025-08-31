package handlers

import (
	"log"
	"net/http"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/internal/repository"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/internal/services"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
	"github.com/gin-gonic/gin"
)

type createAuctionHandlerReq struct {
	Domain      string  `json:"domain" binding:"required"`
	Category    string  `json:"category" binding:"required"`
	Description string  `json:"description" binding:"required"`
	StartPrice  float64 `json:"start_price" binding:"required"`
	StartTime   string  `json:"start_time" binding:"required"`
	EndTime     string  `json:"end_time" binding:"required"`
}

func (s *Server) createAuctionHandler(ctx *gin.Context) {
	var req createAuctionHandlerReq
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}

	reqCtx, err := getRequestContext(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	createParams := repository.Auction{
		Domain:      req.Domain,
		Category:    req.Category,
		Description: req.Description,
		CurrentBid:  req.StartPrice,
		StartPrice:  req.StartPrice,
		StartTime:   pkg.StringToTime(req.StartTime),
		EndTime:     pkg.StringToTime(req.EndTime),
		CreatedBy:   reqCtx.UserID,
		UpdatedBy:   reqCtx.UserID,
	}

	createdAuction, err := s.repo.AuctionRepository.CreateAuction(ctx, &createParams)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"data": createdAuction})
}

type updatedAuctionHandlerReq struct {
	ID          int64    `json:"id"`
	UpdatedBy   int64    `json:"updated_by"`
	Domain      *string  `json:"domain"`
	Category    *string  `json:"category"`
	Description *string  `json:"description"`
	StartPrice  *float64 `json:"start_price"`
	StartTime   *string  `json:"start_time"`
	EndTime     *string  `json:"end_time"`
	Status      *string  `json:"status"`
}

func (s *Server) updatedAuctionHandler(ctx *gin.Context) {
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

	var req updatedAuctionHandlerReq
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}

	updateParams := repository.UpdateAuction{
		ID:        id,
		UpdatedBy: reqCtx.UserID,
	}
	if req.Domain != nil {
		updateParams.Domain = req.Domain
	}
	if req.Category != nil {
		updateParams.Category = req.Category
	}
	if req.Description != nil {
		updateParams.Description = req.Description
	}
	if req.StartPrice != nil {
		updateParams.StartPrice = req.StartPrice
	}
	if req.StartTime != nil {
		t := pkg.StringToTime(*req.StartTime)
		updateParams.StartTime = &t
	}
	if req.EndTime != nil {
		t := pkg.StringToTime(*req.EndTime)
		updateParams.EndTime = &t
	}
	if req.Status != nil {
		updateParams.Status = req.Status
	}

	auction, err := s.repo.AuctionRepository.UpdateAuction(ctx, &updateParams)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": auction})
}

func (s *Server) getAuctionsHandler(ctx *gin.Context) {
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

	filter := repository.AuctionFilter{
		Pagination: &pkg.Pagination{
			Page:     pageNo,
			PageSize: pageSize,
		},
		Search:   nil,
		Category: nil,
		Status:   nil,
	}
	if search := ctx.Query("search"); search != "" {
		filter.Search = &search
	}
	if category := ctx.Query("category"); category != "" {
		filter.Category = &category
	}
	if status := ctx.Query("status"); status != "" {
		filter.Status = &status
	}

	data, pagination, err := s.repo.AuctionRepository.GetAuctions(ctx, &filter)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data":       data,
		"pagination": pagination,
	})
}

func (s *Server) getAuctionHandler(ctx *gin.Context) {
	id, err := pkg.StringToInt64(ctx.Param("id"))
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	auction, err := s.repo.AuctionRepository.GetAuctionByID(ctx, id)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": auction})
}

func (s *Server) deleteAuctionHandler(ctx *gin.Context) {
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

	err = s.repo.AuctionRepository.DeleteAuction(ctx, id, reqCtx.UserID)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"success": "Auction deleted successfully"})
}

type createBidHandlerReq struct {
	Amount float64 `json:"amount"`
}

func (s *Server) createBidHandler(ctx *gin.Context) {
	var req createBidHandlerReq
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}

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

	createParams := repository.Bid{
		UserID:    reqCtx.UserID,
		AuctionID: id,
	}

	if req.Amount != 0 {
		createParams.Amount = req.Amount
	}
	bid, err := s.repo.AuctionRepository.CreateBid(ctx, &createParams)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	// send notifications to watchers with active device tokens
	go func() {
		watchers, err := s.repo.AuctionRepository.GetWatchersWithActiveDeviceTokens(ctx, id)
		if err != nil {
			log.Println("failed to get watchers with active device tokens:", err)
			return
		}

		if len(watchers) == 0 {
			log.Println("no watchers with active device tokens found")
			return
		}

		if err := s.firebase.SendMessageToTokens(ctx, services.CloudMessage{
			Title: "New Bid Placed",
			Body:  "A new bid has been placed on an auction you're watching.",
		}, watchers); err != nil {
			log.Println("failed to send notification to watchers:", err)
			return
		}
	}()

	ctx.JSON(http.StatusCreated, gin.H{"data": bid})
}

func (s *Server) listBidsHandler(ctx *gin.Context) {
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

	id, err := pkg.StringToInt64(ctx.Param("id"))
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	filter := &repository.BidFilter{
		AuctionID: id,
		Pagination: &pkg.Pagination{
			Page:     pageNo,
			PageSize: pageSize,
		},
	}

	data, pagination, err := s.repo.AuctionRepository.GetBids(ctx, filter)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data":       data,
		"pagination": pagination,
	})
}

type createWatchAuctionHandler struct {
	Status string `json:"status"`
}

func (s *Server) createWatchAuctionHandler(ctx *gin.Context) {
	var req createWatchAuctionHandler
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}

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

	createParams := repository.Watcher{
		AuctionID: id,
		UserID:    reqCtx.UserID,
	}

	if req.Status != "" {
		createParams.Status = req.Status
	}

	watcher, err := s.repo.AuctionRepository.CreateWatcher(ctx, &createParams)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"data": watcher})
}
