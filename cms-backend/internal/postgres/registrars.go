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

var _ repository.RegistrarRepository = (*RegistrarRepository)(nil)

type RegistrarRepository struct {
	queries *generated.Queries
}

func NewRegistrarRepository(queries *generated.Queries) *RegistrarRepository {
	return &RegistrarRepository{queries: queries}
}

func (rr *RegistrarRepository) CreateRegistrar(ctx context.Context, registrar *repository.Registrar) (*repository.Registrar, error) {
	createParams := generated.CreateRegistrarParams{
		Email:        registrar.Email,
		Name:         registrar.Name,
		LogoUrl:      registrar.LogoUrl,
		Address:      registrar.Address,
		Specialities: nil,
		PhoneNumber:  registrar.PhoneNumber,
		WebsiteUrl:   registrar.WebsiteUrl,
		UpdatedBy:    registrar.UpdatedBy,
		CreatedBy:    registrar.CreatedBy,
	}

	if len(registrar.Specialities) > 0 {
		createParams.Specialities = registrar.Specialities
	}

	regID, err := rr.queries.CreateRegistrar(ctx, createParams)
	if err != nil {
		if pkg.PgxErrorCode(err) == pkg.UNIQUE_VIOLATION {
			return nil, pkg.Errorf(pkg.ALREADY_EXISTS_ERROR, "registrar with email %s already exists", registrar.Email)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error creating registrar: %s", err.Error())
	}

	registrar.ID = regID

	return registrar, nil
}

func (rr *RegistrarRepository) GetRegistrar(ctx context.Context, id int64) (*repository.Registrar, error) {
	registrar, err := rr.queries.GetRegistrar(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "registrar with ID %d not found", id)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error fetching registrar by ID: %s", err.Error())
	}

	return &repository.Registrar{
		ID:           registrar.ID,
		Email:        registrar.Email,
		Name:         registrar.Name,
		LogoUrl:      registrar.LogoUrl,
		Address:      registrar.Address,
		Specialities: registrar.Specialities,
		PhoneNumber:  registrar.PhoneNumber,
		WebsiteUrl:   registrar.WebsiteUrl,
		UpdatedBy:    registrar.UpdatedBy,
		CreatedBy:    registrar.CreatedBy,
		UpdatedAt:    registrar.UpdatedAt,
		CreatedAt:    registrar.CreatedAt,
	}, nil
}

func (rr *RegistrarRepository) UpdateRegistrar(ctx context.Context, registrar *repository.UpdateRegistrar) (*repository.Registrar, error) {
	updateParams := generated.UpdateRegistrarParams{
		ID:           registrar.ID,
		UpdatedBy:    registrar.UpdatedBy,
		Email:        pgtype.Text{Valid: false},
		Name:         pgtype.Text{Valid: false},
		LogoUrl:      pgtype.Text{Valid: false},
		Address:      pgtype.Text{Valid: false},
		Specialities: nil,
		PhoneNumber:  pgtype.Text{Valid: false},
		WebsiteUrl:   pgtype.Text{Valid: false},
	}

	if registrar.Email != nil {
		updateParams.Email = pgtype.Text{String: *registrar.Email, Valid: true}
	}
	if registrar.Name != nil {
		updateParams.Name = pgtype.Text{String: *registrar.Name, Valid: true}
	}
	if registrar.LogoUrl != nil {
		updateParams.LogoUrl = pgtype.Text{String: *registrar.LogoUrl, Valid: true}
	}
	if registrar.Address != nil {
		updateParams.Address = pgtype.Text{String: *registrar.Address, Valid: true}
	}
	if len(registrar.Specialities) > 0 {
		updateParams.Specialities = registrar.Specialities
	}
	if registrar.PhoneNumber != nil {
		updateParams.PhoneNumber = pgtype.Text{String: *registrar.PhoneNumber, Valid: true}
	}
	if registrar.WebsiteUrl != nil {
		updateParams.WebsiteUrl = pgtype.Text{String: *registrar.WebsiteUrl, Valid: true}
	}

	updatedRegistrar, err := rr.queries.UpdateRegistrar(ctx, updateParams)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "registrar with ID %d not found", updateParams.ID)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error updating registrar: %s", err.Error())
	}

	return &repository.Registrar{
		ID:           updatedRegistrar.ID,
		Email:        updatedRegistrar.Email,
		Name:         updatedRegistrar.Name,
		LogoUrl:      updatedRegistrar.LogoUrl,
		Address:      updatedRegistrar.Address,
		Specialities: updatedRegistrar.Specialities,
		PhoneNumber:  updatedRegistrar.PhoneNumber,
		WebsiteUrl:   updatedRegistrar.WebsiteUrl,
		UpdatedBy:    updatedRegistrar.UpdatedBy,
		CreatedBy:    updatedRegistrar.CreatedBy,
		UpdatedAt:    updatedRegistrar.UpdatedAt,
		CreatedAt:    updatedRegistrar.CreatedAt,
	}, nil
}

func (rr *RegistrarRepository) ListRegistrars(ctx context.Context, filter *repository.RegistrarFilter) ([]*repository.Registrar, *pkg.Pagination, error) {
	listParams := generated.ListRegistrarsParams{
		Limit:        int32(filter.Pagination.PageSize),
		Offset:       int32((filter.Pagination.Page - 1) * filter.Pagination.PageSize),
		Search:       pgtype.Text{Valid: false},
		Specialities: nil,
	}

	countParams := generated.CountRegistrarsParams{
		Search:       pgtype.Text{Valid: false},
		Specialities: nil,
	}

	if filter.Search != nil {
		search := strings.ToLower(*filter.Search)
		listParams.Search = pgtype.Text{String: "%" + search + "%", Valid: true}
		countParams.Search = pgtype.Text{String: "%" + search + "%", Valid: true}
	}

	if filter.Specialities != nil {
		listParams.Specialities = *filter.Specialities
		countParams.Specialities = *filter.Specialities
	}

	registrars, err := rr.queries.ListRegistrars(ctx, listParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error listing registrars: %s", err.Error())
	}

	count, err := rr.queries.CountRegistrars(ctx, countParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error counting registrars: %s", err.Error())
	}

	registrarList := make([]*repository.Registrar, len(registrars))
	for i, reg := range registrars {
		registrarList[i] = &repository.Registrar{
			ID:           reg.ID,
			Email:        reg.Email,
			Name:         reg.Name,
			LogoUrl:      reg.LogoUrl,
			Address:      reg.Address,
			Specialities: reg.Specialities,
			PhoneNumber:  reg.PhoneNumber,
			WebsiteUrl:   reg.WebsiteUrl,
			UpdatedBy:    reg.UpdatedBy,
			CreatedBy:    reg.CreatedBy,
			UpdatedAt:    reg.UpdatedAt,
			CreatedAt:    reg.CreatedAt,
		}
	}

	return registrarList, pkg.CalculatePagination(uint32(count), filter.Pagination.PageSize, filter.Pagination.Page), nil
}

func (rr *RegistrarRepository) DeleteRegistrar(ctx context.Context, registrarID int64, userID int64) error {
	if err := rr.queries.DeleteRegistrar(ctx, generated.DeleteRegistrarParams{
		ID:        registrarID,
		DeletedBy: pgtype.Int8{Valid: true, Int64: userID},
	}); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return pkg.Errorf(pkg.NOT_FOUND_ERROR, "registrar with ID %d not found", registrarID)
		}
		return pkg.Errorf(pkg.INTERNAL_ERROR, "error deleting registrar: %s", err.Error())
	}

	return nil
}
