package postgres

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"strings"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/internal/postgres/generated"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/internal/repository"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
	"github.com/jackc/pgx/v5/pgtype"
)

func (cr *CareerRepository) CreateJobApplication(ctx context.Context, jobApplication *repository.JobApplication) (*repository.JobApplication, error) {
	// check if email already exist for the job posting
	if exists, _ := cr.queries.CheckJobApplicationExists(ctx, generated.CheckJobApplicationExistsParams{
		JobID: jobApplication.JobID,
		Email: jobApplication.Email,
	}); exists {
		return nil, pkg.Errorf(pkg.ALREADY_EXISTS_ERROR, "job application for user %s already exists", jobApplication.Email)
	}

	jobApplicationID, err := cr.queries.CreateJobApplication(ctx, generated.CreateJobApplicationParams{
		JobID:       jobApplication.JobID,
		FullName:    jobApplication.FullName,
		Email:       jobApplication.Email,
		PhoneNumber: jobApplication.PhoneNumber,
		CoverLetter: jobApplication.CoverLetter,
		ResumeUrl:   jobApplication.ResumeUrl,
	})
	if err != nil {
		if pkg.PgxErrorCode(err) == pkg.UNIQUE_VIOLATION {
			return nil, pkg.Errorf(pkg.ALREADY_EXISTS_ERROR, "job application for user %d already exists", jobApplication.JobID)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error creating job application: %s", err.Error())
	}

	return cr.GetJobApplication(ctx, jobApplicationID)
}

func (cr *CareerRepository) GetJobApplication(ctx context.Context, id int64) (*repository.JobApplication, error) {
	jobApplication, err := cr.queries.GetJobApplication(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "job application with ID %d not found", id)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error retrieving job application: %s", err.Error())
	}

	rslt := &repository.JobApplication{
		ID:          jobApplication.ID,
		JobID:       jobApplication.JobID,
		FullName:    jobApplication.FullName,
		Email:       jobApplication.Email,
		PhoneNumber: jobApplication.PhoneNumber,
		CoverLetter: jobApplication.CoverLetter,
		ResumeUrl:   jobApplication.ResumeUrl,
		Status:      jobApplication.Status,
		Comment:     nil,
		SubmittedAt: jobApplication.SubmittedAt,
		UpdatedBy:   nil,
		UpdatedAt:   jobApplication.UpdatedAt,
		CreatedAt:   jobApplication.CreatedAt,
		Job:         nil,
	}

	if jobApplication.Comment.Valid {
		rslt.Comment = &jobApplication.Comment.String
	}
	if jobApplication.UpdatedBy.Valid {
		rslt.UpdatedBy = &jobApplication.UpdatedBy.Int64
	}
	if err := json.Unmarshal(jobApplication.Job, &rslt.Job); err != nil {
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error unmarshalling job details: %s", err.Error())
	}

	return rslt, nil
}

func (cr *CareerRepository) UpdateJobApplication(ctx context.Context, jobApplication *repository.UpdateJobApplication) (*repository.JobApplication, error) {
	updataParams := generated.UpdateJobApplicationParams{
		ID:        jobApplication.ID,
		UpdatedBy: pgtype.Int8{Valid: true, Int64: jobApplication.UpdatedBy},
		Status:    pgtype.Text{Valid: false},
		Comment:   pgtype.Text{Valid: false},
	}

	if jobApplication.Status != nil {
		updataParams.Status = pgtype.Text{String: *jobApplication.Status, Valid: true}
	}
	if jobApplication.Comment != nil {
		updataParams.Comment = pgtype.Text{String: *jobApplication.Comment, Valid: true}
	}

	updatedJobApplication, err := cr.queries.UpdateJobApplication(ctx, updataParams)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "job application with ID %d not found", jobApplication.ID)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error updating job application: %s", err.Error())
	}

	return cr.GetJobApplication(ctx, updatedJobApplication.ID)
}

func (cr *CareerRepository) ListJobApplications(ctx context.Context, filter *repository.JobApplicationFilter) ([]*repository.JobApplication, *pkg.Pagination, error) {
	listParams := generated.ListJobApplicationsParams{
		Limit:  int32(filter.Pagination.PageSize),
		Offset: pkg.Offset(filter.Pagination.Page, filter.Pagination.PageSize),
		Search: pgtype.Text{Valid: false},
		Status: pgtype.Text{Valid: false},
		JobID:  pgtype.Int8{Valid: false},
	}

	countParams := generated.CountJobApplicationsParams{
		Search: pgtype.Text{Valid: false},
		Status: pgtype.Text{Valid: false},
		JobID:  pgtype.Int8{Valid: false},
	}

	if filter.Search != nil {
		search := strings.ToLower(*filter.Search)
		listParams.Search = pgtype.Text{String: "%" + search + "%", Valid: true}
		countParams.Search = pgtype.Text{String: "%" + search + "%", Valid: true}
	}
	if filter.Status != nil {
		listParams.Status = pgtype.Text{String: *filter.Status, Valid: true}
		countParams.Status = pgtype.Text{String: *filter.Status, Valid: true}
	}
	if filter.JobID != nil {
		listParams.JobID = pgtype.Int8{Int64: *filter.JobID, Valid: true}
		countParams.JobID = pgtype.Int8{Int64: *filter.JobID, Valid: true}
	}

	jobApplications, err := cr.queries.ListJobApplications(ctx, listParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error listing job applications: %s", err.Error())
	}
	count, err := cr.queries.CountJobApplications(ctx, countParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error counting job applications: %s", err.Error())
	}

	rslt := make([]*repository.JobApplication, len(jobApplications))
	for i, jobApplication := range jobApplications {
		rslt[i] = &repository.JobApplication{
			ID:          jobApplication.ID,
			JobID:       jobApplication.JobID,
			FullName:    jobApplication.FullName,
			Email:       jobApplication.Email,
			PhoneNumber: jobApplication.PhoneNumber,
			CoverLetter: jobApplication.CoverLetter,
			ResumeUrl:   jobApplication.ResumeUrl,
			Status:      jobApplication.Status,
			Comment:     nil,
			SubmittedAt: jobApplication.SubmittedAt,
			UpdatedBy:   nil,
			UpdatedAt:   jobApplication.UpdatedAt,
			CreatedAt:   jobApplication.CreatedAt,
			Job:         nil,
		}

		if jobApplication.Comment.Valid {
			rslt[i].Comment = &jobApplication.Comment.String
		}
		if jobApplication.UpdatedBy.Valid {
			rslt[i].UpdatedBy = &jobApplication.UpdatedBy.Int64
		}
	}

	return rslt, pkg.CalculatePagination(uint32(count), filter.Pagination.PageSize, filter.Pagination.Page), nil
}
