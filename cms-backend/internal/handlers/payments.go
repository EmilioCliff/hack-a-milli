package handlers

import (
	"net/http"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/internal/repository"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
	"github.com/gin-gonic/gin"
)

type createPaymentReq struct {
	OrderID       int64   `json:"order_id" binding:"required"`
	UserID        *int64  `json:"user_id,omitempty"`
	PaymentMethod string  `json:"payment_method" binding:"required"`
	Amount        float64 `json:"amount" binding:"required"`
	Status        string  `json:"status" binding:"required"`
}

func (s *Server) createPaymentHandler(ctx *gin.Context) {
	var req createPaymentReq
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}

	payment := &repository.Payment{
		OrderID:       req.OrderID,
		UserID:        req.UserID,
		PaymentMethod: req.PaymentMethod,
		Amount:        req.Amount,
	}

	statusBool, err := pkg.StringToBool(req.Status)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}
	payment.Status = statusBool

	reqCtx, _ := getRequestContext(ctx)
	if reqCtx.UserID != 0 {
		payment.UserID = &reqCtx.UserID
		payment.CreatedBy = &reqCtx.UserID
		payment.UpdatedBy = &reqCtx.UserID
	}

	newPayment, err := s.repo.MerchRepository.CreatePayment(ctx, payment)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"data": newPayment})
}

func (s *Server) getPaymentHandler(ctx *gin.Context) {
	id, err := pkg.StringToInt64(ctx.Param("id"))
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}
	payment, err := s.repo.MerchRepository.GetPayment(ctx, id)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": payment})
}

func (s *Server) getUserPaymentHandler(ctx *gin.Context) {
	paymentID, err := pkg.StringToInt64(ctx.Param("payment_id"))
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	userId, err := pkg.StringToInt64(ctx.Param("id"))
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	payment, err := s.repo.MerchRepository.GetUserPayment(ctx, paymentID, userId)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": payment})
}

func (s *Server) updatePaymentHandler(ctx *gin.Context) {
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

	var req repository.UpdatePayment
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}
	req.ID = id
	req.UpdatedBy = reqCtx.UserID

	payment, err := s.repo.MerchRepository.UpdatePayment(ctx, &req)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": payment})
}

func (s *Server) listPaymentsHandler(ctx *gin.Context) {
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

	filter := repository.PaymentFilter{
		Pagination: &pkg.Pagination{
			Page:     pageNo,
			PageSize: pageSize,
		},
		OrderID:       nil,
		UserID:        nil,
		PaymentMethod: nil,
		Status:        nil,
		StartDate:     nil,
		EndDate:       nil,
	}

	if orderID := ctx.Query("order_id"); orderID != "" {
		orderIDInt, err := pkg.StringToInt64(orderID)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, errorResponse(err))
			return
		}
		filter.OrderID = &orderIDInt
	}

	if userID := ctx.Query("user_id"); userID != "" {
		userIDInt, err := pkg.StringToInt64(userID)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, errorResponse(err))
			return
		}
		filter.UserID = &userIDInt
	}

	if paymentMethod := ctx.Query("payment_method"); paymentMethod != "" {
		filter.PaymentMethod = &paymentMethod
	}

	if status := ctx.Query("status"); status != "" {
		status, err := pkg.StringToBool(status)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, errorResponse(err))
			return
		}
		filter.Status = &status
	}

	if startDate := ctx.Query("start_date"); startDate != "" {
		startTime := pkg.StringToTime(startDate)
		filter.StartDate = &startTime
	}

	if endDate := ctx.Query("end_date"); endDate != "" {
		endTime := pkg.StringToTime(endDate)
		filter.EndDate = &endTime
	}

	payments, pagination, err := s.repo.MerchRepository.ListPayment(ctx, &filter)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data":       payments,
		"pagination": pagination,
	})
}

func (s *Server) listUserPaymentsHandler(ctx *gin.Context) {
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

	filter := repository.PaymentFilter{
		Pagination: &pkg.Pagination{
			Page:     pageNo,
			PageSize: pageSize,
		},
		UserID:        &id,
		OrderID:       nil,
		PaymentMethod: nil,
		Status:        nil,
		StartDate:     nil,
		EndDate:       nil,
	}

	if orderID := ctx.Query("order_id"); orderID != "" {
		orderIDInt, err := pkg.StringToInt64(orderID)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, errorResponse(err))
			return
		}
		filter.OrderID = &orderIDInt
	}

	if userID := ctx.Query("user_id"); userID != "" {
		userIDInt, err := pkg.StringToInt64(userID)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, errorResponse(err))
			return
		}
		filter.UserID = &userIDInt
	}

	if paymentMethod := ctx.Query("payment_method"); paymentMethod != "" {
		filter.PaymentMethod = &paymentMethod
	}

	if status := ctx.Query("status"); status != "" {
		status, err := pkg.StringToBool(status)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, errorResponse(err))
			return
		}
		filter.Status = &status
	}

	if startDate := ctx.Query("start_date"); startDate != "" {
		startTime := pkg.StringToTime(startDate)
		filter.StartDate = &startTime
	}

	if endDate := ctx.Query("end_date"); endDate != "" {
		endTime := pkg.StringToTime(endDate)
		filter.EndDate = &endTime
	}

	payments, pagination, err := s.repo.MerchRepository.ListPayment(ctx, &filter)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data":       payments,
		"pagination": pagination,
	})
}
