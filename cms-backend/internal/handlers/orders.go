package handlers

import (
	"net/http"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/internal/repository"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
	"github.com/gin-gonic/gin"
)

type createOrderReq struct {
	Status        string                  `json:"status" binding:"required"`
	PaymentStatus string                  `json:"payment_status" binding:"required"`
	OrderDetails  repository.OrderDetails `json:"order_details" binding:"required"`
	Items         []struct {
		ProductID int64  `json:"product_id" binding:"required"`
		Size      string `json:"size" binding:"required"`
		Color     string `json:"color" binding:"required"`
		Quantity  int32  `json:"quantity" binding:"required"`
	} `json:"items" binding:"required"`
}

func (s *Server) createOrderHandler(ctx *gin.Context) {
	var req createOrderReq
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}

	if len(req.Items) == 0 {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, "at least one item is required in the order")))
		return
	}

	order := &repository.Order{
		UserID:       nil,
		Status:       req.Status,
		OrderDetails: req.OrderDetails,
	}

	paymentStatusBool, err := pkg.StringToBool(req.PaymentStatus)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}
	order.PaymentStatus = paymentStatusBool

	reqCtx, _ := getRequestContext(ctx)
	if reqCtx.UserID != 0 {
		order.UserID = &reqCtx.UserID
	}

	var orderItems []repository.OrderItem
	for _, item := range req.Items {
		orderItems = append(orderItems, repository.OrderItem{
			ProductID: item.ProductID,
			Size:      item.Size,
			Color:     item.Color,
			Quantity:  item.Quantity,
		})
	}

	newOrder, err := s.repo.MerchRepository.CreateOrder(ctx, order, orderItems)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"data": newOrder})

}

func (s *Server) getOrderHandler(ctx *gin.Context) {
	id, err := pkg.StringToInt64(ctx.Param("id"))
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	order, err := s.repo.MerchRepository.GetOrder(ctx, id)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": order})
}

func (s *Server) getUserOrderHandler(ctx *gin.Context) {
	orderID, err := pkg.StringToInt64(ctx.Param("order_id"))
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	userId, err := pkg.StringToInt64(ctx.Param("id"))
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	order, err := s.repo.MerchRepository.GetUserOrder(ctx, orderID, userId)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": order})
}

func (s *Server) updateOrderHandler(ctx *gin.Context) {
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

	var req repository.UpdateOrder
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}
	req.ID = id
	req.UpdatedBy = reqCtx.UserID

	order, err := s.repo.MerchRepository.UpdateOrder(ctx, &req)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": order})
}

func (s *Server) listOrdersHandler(ctx *gin.Context) {
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

	filter := repository.OrderFilter{
		Pagination: &pkg.Pagination{
			Page:     pageNo,
			PageSize: pageSize,
		},
		UserID:        nil,
		PaymentStatus: nil,
		Status:        nil,
	}
	if status := ctx.Query("status"); status != "" {
		filter.Status = &status
	}
	if userID := ctx.Query("user_id"); userID != "" {
		userIDInt, err := pkg.StringToInt64(userID)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
			return
		}
		filter.UserID = &userIDInt
	}
	if paymentStatus := ctx.Query("payment_status"); paymentStatus != "" {
		paymentBool, err := pkg.StringToBool(paymentStatus)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
			return
		}
		filter.PaymentStatus = &paymentBool
	}

	orders, pagination, err := s.repo.MerchRepository.ListOrders(ctx, &filter)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data":       orders,
		"pagination": pagination,
	})
}

func (s *Server) listUserOrdersHandler(ctx *gin.Context) {
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

	filter := repository.OrderFilter{
		Pagination: &pkg.Pagination{
			Page:     pageNo,
			PageSize: pageSize,
		},
		UserID:        &id,
		PaymentStatus: nil,
		Status:        nil,
	}
	if status := ctx.Query("status"); status != "" {
		filter.Status = &status
	}
	if paymentStatus := ctx.Query("payment_status"); paymentStatus != "" {
		paymentBool, err := pkg.StringToBool(paymentStatus)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
			return
		}
		filter.PaymentStatus = &paymentBool
	}

	orders, pagination, err := s.repo.MerchRepository.ListOrders(ctx, &filter)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data":       orders,
		"pagination": pagination,
	})
}
