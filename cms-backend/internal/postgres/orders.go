package postgres

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"log"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/internal/postgres/generated"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/internal/repository"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
	"github.com/jackc/pgx/v5/pgtype"
)

func (mr *MerchRepository) CreateOrder(ctx context.Context, order *repository.Order, orderItems []repository.OrderItem) (*repository.Order, error) {
	err := mr.db.ExecTx(ctx, func(q *generated.Queries) error {
		createParams := generated.CreateOrderParams{
			UserID:        pgtype.Int8{Valid: false},
			Amount:        pgtype.Numeric{Valid: false},
			Status:        order.Status,
			PaymentStatus: order.PaymentStatus,
			OrderDetails:  nil,
		}

		if order.UserID != nil {
			createParams.UserID = pgtype.Int8{Int64: *order.UserID, Valid: true}
		}

		orderDetailsBytes, err := json.Marshal(order.OrderDetails)
		if err != nil {
			return pkg.Errorf(pkg.INTERNAL_ERROR, "error marshalling order details: %s", err.Error())
		}
		createParams.OrderDetails = orderDetailsBytes

		totalAmount := 0.0
		orderItemParams := []generated.CreateOrderItemParams{}
		for _, item := range orderItems {
			product, err := q.GetProduct(ctx, item.ProductID)
			if err != nil {
				if errors.Is(err, sql.ErrNoRows) {
					return pkg.Errorf(pkg.NOT_FOUND_ERROR, "product with ID %d not found", item.ProductID)
				}
				return pkg.Errorf(pkg.INTERNAL_ERROR, "error retrieving product: %s", err.Error())
			}

			amount := pkg.PgTypeNumericToFloat64(product.Price) * float64(item.Quantity)
			totalAmount += amount

			_, err = q.UpdateProductItemSold(ctx, generated.UpdateProductItemSoldParams{
				ID:        item.ProductID,
				ItemsSold: product.ItemsSold + item.Quantity,
			})
			if err != nil {
				return pkg.Errorf(pkg.INTERNAL_ERROR, "error updating product items sold: %s", err.Error())
			}

			orderItemParams = append(orderItemParams, generated.CreateOrderItemParams{
				OrderID:   0, // This will be set after the order is created
				ProductID: item.ProductID,
				Size:      item.Size,
				Color:     item.Color,
				Quantity:  item.Quantity,
				Amount:    pkg.Float64ToPgTypeNumeric(amount),
			})
		}

		createParams.Amount = pkg.Float64ToPgTypeNumeric(totalAmount)

		orderID, err := q.CreateOrder(ctx, createParams)
		if err != nil {
			if pkg.PgxErrorCode(err) == pkg.FOREIGN_KEY_VIOLATION {
				return pkg.Errorf(pkg.NOT_FOUND_ERROR, "user with ID %d not found", createParams.UserID.Int64)
			}
			return pkg.Errorf(pkg.INTERNAL_ERROR, "error creating order: %s", err.Error())
		}

		for i := range orderItemParams {
			orderItemParams[i].OrderID = orderID
			if err := q.CreateOrderItem(ctx, orderItemParams[i]); err != nil {
				return pkg.Errorf(pkg.INTERNAL_ERROR, "error creating order item: %s", err.Error())
			}
		}

		order.ID = orderID

		return nil
	})
	if err != nil {
		return nil, err
	}

	return mr.GetOrder(ctx, order.ID)
}

func (mr *MerchRepository) GetOrder(ctx context.Context, id int64) (*repository.Order, error) {
	order, err := mr.queries.GetOrder(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "order with ID %d not found", id)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error fetching order by ID: %s", err.Error())
	}

	rslt := &repository.Order{
		ID:            order.ID,
		UserID:        nil,
		Amount:        pkg.PgTypeNumericToFloat64(order.Amount),
		Status:        order.Status,
		PaymentStatus: order.PaymentStatus,
		UpdatedBy:     nil,
		UpdatedAt:     order.UpdatedAt,
		CreatedAt:     order.CreatedAt,
		User:          nil,
		OrderItems:    nil,
	}

	if order.UserID.Valid {
		rslt.UserID = &order.UserID.Int64
	}
	if order.UpdatedBy.Valid {
		rslt.UpdatedBy = &order.UpdatedBy.Int64
	}

	var orderDetails repository.OrderDetails
	if err := json.Unmarshal(order.OrderDetails, &orderDetails); err != nil {
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error unmarshalling order details: %s", err.Error())
	}
	rslt.OrderDetails = orderDetails

	if len(order.OrderItems) > 0 {
		var orderItems []repository.OrderItem
		if err := json.Unmarshal(order.OrderItems, &orderItems); err != nil {
			return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error unmarshalling order items: %s", err.Error())
		}
		rslt.OrderItems = orderItems
	}

	if len(order.User) > 0 {
		var user repository.User
		if err := json.Unmarshal(order.User, &user); err != nil {
			return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error unmarshalling user: %s", err.Error())
		}
		rslt.User = &user
	}

	return rslt, nil
}

func (mr *MerchRepository) GetUserOrder(ctx context.Context, orderId, userId int64) (*repository.Order, error) {
	order, err := mr.queries.GetUserOrderByID(ctx, generated.GetUserOrderByIDParams{
		ID:     orderId,
		UserID: pgtype.Int8{Int64: userId, Valid: true},
	})
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "order with ID %d not found", orderId)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error fetching order by ID: %s", err.Error())
	}

	rslt := &repository.Order{
		ID:            order.ID,
		UserID:        nil,
		Amount:        pkg.PgTypeNumericToFloat64(order.Amount),
		Status:        order.Status,
		PaymentStatus: order.PaymentStatus,
		UpdatedBy:     nil,
		UpdatedAt:     order.UpdatedAt,
		CreatedAt:     order.CreatedAt,
		User:          nil,
		OrderItems:    nil,
	}

	if order.UserID.Valid {
		rslt.UserID = &order.UserID.Int64
	}
	if order.UpdatedBy.Valid {
		rslt.UpdatedBy = &order.UpdatedBy.Int64
	}

	var orderDetails repository.OrderDetails
	if err := json.Unmarshal(order.OrderDetails, &orderDetails); err != nil {
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error unmarshalling order details: %s", err.Error())
	}
	rslt.OrderDetails = orderDetails

	if len(order.OrderItems) > 0 {
		var orderItems []repository.OrderItem
		if err := json.Unmarshal(order.OrderItems, &orderItems); err != nil {
			return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error unmarshalling order items: %s", err.Error())
		}
		rslt.OrderItems = orderItems
	}

	if len(order.User) > 0 {
		var user repository.User
		if err := json.Unmarshal(order.User, &user); err != nil {
			return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error unmarshalling user: %s", err.Error())
		}
		rslt.User = &user
	}

	return rslt, nil
}

func (mr *MerchRepository) UpdateOrder(ctx context.Context, order *repository.UpdateOrder) (*repository.Order, error) {
	updateParams := generated.UpdateOrderParams{
		ID:            order.ID,
		UpdatedBy:     pgtype.Int8{Valid: true, Int64: order.UpdatedBy},
		UserID:        pgtype.Int8{Valid: false},
		Status:        pgtype.Text{Valid: false},
		PaymentStatus: pgtype.Bool{Valid: false},
	}

	if order.UserID != nil {
		if exists, _ := mr.queries.UserExists(ctx, *order.UserID); !exists {
			return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "user with ID %d not found", *order.UserID)
		}
		updateParams.UserID = pgtype.Int8{Int64: *order.UserID, Valid: true}
	}
	if order.Status != nil {
		updateParams.Status = pgtype.Text{String: *order.Status, Valid: true}
	}
	if order.PaymentStatus != nil {
		updateParams.PaymentStatus = pgtype.Bool{Bool: *order.PaymentStatus, Valid: true}
	}

	updatedOrder, err := mr.queries.UpdateOrder(ctx, updateParams)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "order with ID %d not found", order.ID)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error updating order: %s", err.Error())
	}

	rslt := &repository.Order{
		ID:            updatedOrder.ID,
		UserID:        nil,
		Amount:        pkg.PgTypeNumericToFloat64(updatedOrder.Amount),
		Status:        updatedOrder.Status,
		PaymentStatus: updatedOrder.PaymentStatus,
		UpdatedBy:     nil,
		UpdatedAt:     updatedOrder.UpdatedAt,
		CreatedAt:     updatedOrder.CreatedAt,
		User:          nil,
		OrderItems:    nil,
	}

	var orderDetails repository.OrderDetails
	if err := json.Unmarshal(updatedOrder.OrderDetails, &orderDetails); err != nil {
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error unmarshalling order details: %s", err.Error())
	}
	rslt.OrderDetails = orderDetails

	if updatedOrder.UserID.Valid {
		rslt.UserID = &updatedOrder.UserID.Int64
	}
	if updatedOrder.UpdatedBy.Valid {
		rslt.UpdatedBy = &updatedOrder.UpdatedBy.Int64
	}

	return rslt, nil
}

func (mr *MerchRepository) ListOrders(ctx context.Context, filter *repository.OrderFilter) ([]*repository.Order, *pkg.Pagination, error) {
	listParams := generated.ListOrdersParams{
		Offset:        pkg.Offset(filter.Pagination.Page, filter.Pagination.PageSize),
		Limit:         int32(filter.Pagination.PageSize),
		UserID:        pgtype.Int8{Valid: false},
		Status:        pgtype.Text{Valid: false},
		PaymentStatus: pgtype.Bool{Valid: false},
	}

	countParams := generated.CountOrdersParams{
		UserID:        pgtype.Int8{Valid: false},
		Status:        pgtype.Text{Valid: false},
		PaymentStatus: pgtype.Bool{Valid: false},
	}

	if filter.UserID != nil {
		listParams.UserID = pgtype.Int8{Int64: *filter.UserID, Valid: true}
		countParams.UserID = pgtype.Int8{Int64: *filter.UserID, Valid: true}
	}
	if filter.Status != nil {
		listParams.Status = pgtype.Text{String: *filter.Status, Valid: true}
		countParams.Status = pgtype.Text{String: *filter.Status, Valid: true}
	}
	if filter.PaymentStatus != nil {
		listParams.PaymentStatus = pgtype.Bool{Bool: *filter.PaymentStatus, Valid: true}
		countParams.PaymentStatus = pgtype.Bool{Bool: *filter.PaymentStatus, Valid: true}
	}

	orders, err := mr.queries.ListOrders(ctx, listParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error listing orders: %s", err.Error())
	}

	log.Println(listParams)

	count, err := mr.queries.CountOrders(ctx, countParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error counting orders: %s", err.Error())
	}

	orderList := make([]*repository.Order, len(orders))
	for i, order := range orders {
		orderList[i] = &repository.Order{
			ID:            order.ID,
			UserID:        nil,
			Amount:        pkg.PgTypeNumericToFloat64(order.Amount),
			Status:        order.Status,
			PaymentStatus: order.PaymentStatus,
			UpdatedBy:     nil,
			UpdatedAt:     order.UpdatedAt,
			CreatedAt:     order.CreatedAt,
			User:          nil,
			OrderItems:    nil,
		}

		if order.UserID.Valid {
			orderList[i].UserID = &order.UserID.Int64
		}
		if order.UpdatedBy.Valid {
			orderList[i].UpdatedBy = &order.UpdatedBy.Int64
		}

		var orderDetails repository.OrderDetails
		if err := json.Unmarshal(order.OrderDetails, &orderDetails); err != nil {
			return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error unmarshalling order details: %s", err.Error())
		}
		orderList[i].OrderDetails = orderDetails
	}

	return orderList, pkg.CalculatePagination(uint32(count), filter.Pagination.PageSize, filter.Pagination.Page), nil
}
