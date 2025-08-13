package postgres

import (
	"context"
	"database/sql"
	"errors"
	"strings"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/internal/postgres/generated"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/internal/repository"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
	"github.com/jackc/pgx/v5/pgtype"
)

var _ repository.PaymentRepository = (*PaymentRepository)(nil)

type PaymentRepository struct {
	queries *generated.Queries
}

func NewPaymentRepository(queries *generated.Queries) *PaymentRepository {
	return &PaymentRepository{queries: queries}
}

func (pr *PaymentRepository) CreatePayment(ctx context.Context, payment *repository.Payment) (*repository.Payment, error) {
	createParams := generated.CreatePaymentParams{
		OrderID:       payment.OrderID,
		UserID:        pgtype.Int8{Valid: false},
		PaymentMethod: payment.PaymentMethod,
		Amount:        pkg.Float64ToPgTypeNumeric(payment.Amount),
		Status:        payment.Status,
		UpdatedBy:     pgtype.Int8{Valid: false},
		CreatedBy:     pgtype.Int8{Valid: false},
	}

	if payment.UserID != nil {
		createParams.UserID = pgtype.Int8{Int64: *payment.UserID, Valid: true}
	}
	if payment.UpdatedBy != nil {
		createParams.UpdatedBy = pgtype.Int8{Int64: *payment.UpdatedBy, Valid: true}
	}
	if payment.CreatedBy != nil {
		createParams.CreatedBy = pgtype.Int8{Int64: *payment.CreatedBy, Valid: true}
	}

	paymentID, err := pr.queries.CreatePayment(ctx, createParams)
	if err != nil {
		if pkg.PgxErrorCode(err) == pkg.UNIQUE_VIOLATION {
			return nil, pkg.Errorf(pkg.ALREADY_EXISTS_ERROR, "payment for order %d already exists", payment.OrderID)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error creating payment: %s", err.Error())
	}

	payment.ID = paymentID

	return payment, nil
}

func (pr *PaymentRepository) GetPayment(ctx context.Context, id int64) (*repository.Payment, error) {
	payment, err := pr.queries.GetPayment(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "payment with ID %d not found", id)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error fetching payment by ID: %s", err.Error())
	}

	rslt := &repository.Payment{
		ID:            payment.ID,
		OrderID:       payment.OrderID,
		UserID:        nil,
		PaymentMethod: payment.PaymentMethod,
		Amount:        pkg.PgTypeNumericToFloat64(payment.Amount),
		Status:        payment.Status,
		UpdatedBy:     nil,
		CreatedBy:     nil,
		UpdatedAt:     payment.UpdatedAt,
		CreatedAt:     payment.CreatedAt,
	}

	if payment.UserID.Valid {
		rslt.UserID = &payment.UserID.Int64
	}

	if payment.UpdatedBy.Valid {
		rslt.UpdatedBy = &payment.UpdatedBy.Int64
	}

	if payment.CreatedBy.Valid {
		rslt.CreatedBy = &payment.CreatedBy.Int64
	}

	return rslt, nil
}

func (pr *PaymentRepository) UpdatePayment(ctx context.Context, payment *repository.UpdatePayment) (*repository.Payment, error) {
	updateParams := generated.UpdatePaymentParams{
		ID:        payment.ID,
		UpdatedBy: pgtype.Int8{Valid: false},
		UserID:    pgtype.Int8{Valid: false},
		Status:    pgtype.Bool{Valid: false},
	}

	if payment.UserID != nil {
		updateParams.UserID = pgtype.Int8{Int64: *payment.UserID, Valid: true}
	}
	if payment.Status != nil {
		updateParams.Status = pgtype.Bool{Bool: *payment.Status, Valid: true}
	}
	if payment.UpdatedBy != 0 {
		updateParams.UpdatedBy = pgtype.Int8{Int64: payment.UpdatedBy, Valid: true}
	}

	updatedPayment, err := pr.queries.UpdatePayment(ctx, updateParams)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "payment with ID %d not found", payment.ID)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error updating payment: %s", err.Error())
	}

	rslt := &repository.Payment{
		ID:            updatedPayment.ID,
		OrderID:       updatedPayment.OrderID,
		UserID:        nil,
		PaymentMethod: updatedPayment.PaymentMethod,
		Amount:        pkg.PgTypeNumericToFloat64(updatedPayment.Amount),
		Status:        updatedPayment.Status,
		UpdatedBy:     nil,
		CreatedBy:     nil,
		UpdatedAt:     updatedPayment.UpdatedAt,
		CreatedAt:     updatedPayment.CreatedAt,
	}

	if updatedPayment.UserID.Valid {
		rslt.UserID = &updatedPayment.UserID.Int64
	}

	if updatedPayment.UpdatedBy.Valid {
		rslt.UpdatedBy = &updatedPayment.UpdatedBy.Int64
	}

	if updatedPayment.CreatedBy.Valid {
		rslt.CreatedBy = &updatedPayment.CreatedBy.Int64
	}

	return rslt, nil
}

func (pr *PaymentRepository) ListPayment(ctx context.Context, filter *repository.PaymentFilter) ([]*repository.Payment, *pkg.Pagination, error) {
	listParams := generated.ListPaymentsParams{
		Limit:         int32(filter.Pagination.PageSize),
		Offset:        pkg.Offset(filter.Pagination.Page, filter.Pagination.PageSize),
		OrderID:       pgtype.Int8{Valid: false},
		UserID:        pgtype.Int8{Valid: false},
		PaymentMethod: pgtype.Text{Valid: false},
		Status:        pgtype.Bool{Valid: false},
		StartDate:     pgtype.Timestamptz{Valid: false},
		EndDate:       pgtype.Timestamptz{Valid: false},
	}

	countParams := generated.CountPaymentsParams{
		OrderID:       pgtype.Int8{Valid: false},
		UserID:        pgtype.Int8{Valid: false},
		PaymentMethod: pgtype.Text{Valid: false},
		Status:        pgtype.Bool{Valid: false},
		StartDate:     pgtype.Timestamptz{Valid: false},
		EndDate:       pgtype.Timestamptz{Valid: false},
	}

	if filter.OrderID != nil {
		listParams.OrderID = pgtype.Int8{Int64: *filter.OrderID, Valid: true}
		countParams.OrderID = pgtype.Int8{Int64: *filter.OrderID, Valid: true}
	}

	if filter.UserID != nil {
		listParams.UserID = pgtype.Int8{Int64: *filter.UserID, Valid: true}
		countParams.UserID = pgtype.Int8{Int64: *filter.UserID, Valid: true}
	}

	if filter.PaymentMethod != nil {
		paymentMethod := "%" + strings.ToLower(*filter.PaymentMethod) + "%"
		listParams.PaymentMethod = pgtype.Text{String: paymentMethod, Valid: true}
		countParams.PaymentMethod = pgtype.Text{String: paymentMethod, Valid: true}
	}

	if filter.Status != nil {
		listParams.Status = pgtype.Bool{Bool: *filter.Status, Valid: true}
		countParams.Status = pgtype.Bool{Bool: *filter.Status, Valid: true}
	}

	if filter.StartDate != nil && filter.EndDate != nil {
		listParams.StartDate = pgtype.Timestamptz{Time: *filter.StartDate, Valid: true}
		listParams.EndDate = pgtype.Timestamptz{Time: *filter.EndDate, Valid: true}
		countParams.StartDate = pgtype.Timestamptz{Time: *filter.StartDate, Valid: true}
		countParams.EndDate = pgtype.Timestamptz{Time: *filter.EndDate, Valid: true}
	}

	payments, err := pr.queries.ListPayments(ctx, listParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error listing payments: %s", err.Error())
	}

	count, err := pr.queries.CountPayments(ctx, countParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error counting payments: %s", err.Error())
	}

	rslt := make([]*repository.Payment, len(payments))
	for i, payment := range payments {
		rslt[i] = &repository.Payment{
			ID:            payment.ID,
			OrderID:       payment.OrderID,
			UserID:        nil,
			PaymentMethod: payment.PaymentMethod,
			Amount:        pkg.PgTypeNumericToFloat64(payment.Amount),
			Status:        payment.Status,
			UpdatedBy:     nil,
			CreatedBy:     nil,
			UpdatedAt:     payment.UpdatedAt,
			CreatedAt:     payment.CreatedAt,
		}

		if payment.UserID.Valid {
			rslt[i].UserID = &payment.UserID.Int64
		}

		if payment.UpdatedBy.Valid {
			rslt[i].UpdatedBy = &payment.UpdatedBy.Int64
		}

		if payment.CreatedBy.Valid {
			rslt[i].CreatedBy = &payment.CreatedBy.Int64
		}
	}

	return rslt, pkg.CalculatePagination(uint32(count), filter.Pagination.PageSize, filter.Pagination.Page), nil
}
