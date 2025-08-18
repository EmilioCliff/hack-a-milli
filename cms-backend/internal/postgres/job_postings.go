package postgres

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/internal/postgres/generated"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/internal/repository"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
	"github.com/jackc/pgx/v5/pgtype"
)

var _ repository.CareerRepository = (*CareerRepository)(nil)

type CareerRepository struct {
	queries *generated.Queries
}

func NewCareerRepository(queries *generated.Queries) *CareerRepository {
	return &CareerRepository{queries: queries}
}

func (cr *CareerRepository) CreateJobPosting(ctx context.Context, jobPosting *repository.JobPosting) (*repository.JobPosting, error) {
	createParams := generated.CreateJobPostingParams{
		Title:          jobPosting.Title,
		DepartmentID:   jobPosting.DepartmentID,
		Location:       jobPosting.Location,
		EmploymentType: jobPosting.EmploymentType,
		Content:        jobPosting.Content,
		SalaryRange:    pgtype.Text{Valid: false},
		StartDate:      jobPosting.StartDate,
		EndDate:        jobPosting.EndDate,
		UpdatedBy:      jobPosting.UpdatedBy,
		CreatedBy:      jobPosting.CreatedBy,
	}

	if jobPosting.SalaryRange != nil {
		createParams.SalaryRange = pgtype.Text{String: *jobPosting.SalaryRange, Valid: true}
	}

	jobPostingID, err := cr.queries.CreateJobPosting(ctx, createParams)
	if err != nil {
		if pkg.PgxErrorCode(err) == pkg.UNIQUE_VIOLATION {
			return nil, pkg.Errorf(pkg.ALREADY_EXISTS_ERROR, "job posting with title '%s' already exists", jobPosting.Title)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error creating job posting: %s", err.Error())
	}

	jobPosting.ID = jobPostingID
	return cr.GetJobPosting(ctx, jobPostingID)
}

func (cr *CareerRepository) GetJobPosting(ctx context.Context, id int64) (*repository.JobPosting, error) {
	jobPosting, err := cr.queries.GetJobPosting(ctx, id)
	if err != nil {
		return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "job posting with ID %d not found", id)
	}

	rslt := &repository.JobPosting{
		ID:             jobPosting.ID,
		Title:          jobPosting.Title,
		DepartmentID:   jobPosting.DepartmentID,
		DepartmentName: jobPosting.DepartmentName,
		Location:       jobPosting.Location,
		EmploymentType: jobPosting.EmploymentType,
		Content:        jobPosting.Content,
		SalaryRange:    nil,
		StartDate:      jobPosting.StartDate,
		EndDate:        jobPosting.EndDate,
		ShowCase:       jobPosting.ShowCase,
		Published:      jobPosting.Published,
		PublishedAt:    nil,
		UpdatedBy:      jobPosting.UpdatedBy,
		CreatedBy:      jobPosting.CreatedBy,
		UpdatedAt:      jobPosting.UpdatedAt,
		CreatedAt:      jobPosting.CreatedAt,
		DeletedBy:      nil,
		DeletedAt:      nil,
	}

	if jobPosting.SalaryRange.Valid {
		rslt.SalaryRange = &jobPosting.SalaryRange.String
	}
	if jobPosting.PublishedAt.Valid {
		rslt.PublishedAt = &jobPosting.PublishedAt.Time
	}
	if jobPosting.DeletedBy.Valid {
		rslt.DeletedBy = &jobPosting.DeletedBy.Int64
	}
	if jobPosting.DeletedAt.Valid {
		rslt.DeletedAt = &jobPosting.DeletedAt.Time
	}

	return rslt, nil
}

func (cr *CareerRepository) GetPublishedJobPosting(ctx context.Context, id int64) (*repository.JobPosting, error) {
	jobPosting, err := cr.queries.GetPublishedJobPosting(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "job posting with ID %d not found or published or show cased", id)
		}
		return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "error retrieving job posting with ID %d: %s", id, err.Error())
	}

	rslt := &repository.JobPosting{
		ID:             jobPosting.ID,
		Title:          jobPosting.Title,
		DepartmentID:   jobPosting.DepartmentID,
		DepartmentName: jobPosting.DepartmentName,
		Location:       jobPosting.Location,
		EmploymentType: jobPosting.EmploymentType,
		Content:        jobPosting.Content,
		SalaryRange:    nil,
		StartDate:      jobPosting.StartDate,
		EndDate:        jobPosting.EndDate,
		ShowCase:       jobPosting.ShowCase,
		Published:      jobPosting.Published,
		PublishedAt:    nil,
		UpdatedBy:      jobPosting.UpdatedBy,
		CreatedBy:      jobPosting.CreatedBy,
		UpdatedAt:      jobPosting.UpdatedAt,
		CreatedAt:      jobPosting.CreatedAt,
		DeletedBy:      nil,
		DeletedAt:      nil,
	}

	if jobPosting.SalaryRange.Valid {
		rslt.SalaryRange = &jobPosting.SalaryRange.String
	}
	if jobPosting.PublishedAt.Valid {
		rslt.PublishedAt = &jobPosting.PublishedAt.Time
	}
	if jobPosting.DeletedBy.Valid {
		rslt.DeletedBy = &jobPosting.DeletedBy.Int64
	}
	if jobPosting.DeletedAt.Valid {
		rslt.DeletedAt = &jobPosting.DeletedAt.Time
	}

	return rslt, nil
}

func (cr *CareerRepository) UpdateJobPosting(ctx context.Context, jobPosting *repository.UpdateJobPosting) (*repository.JobPosting, error) {
	updateParams := generated.UpdateJobPostingParams{
		ID:             jobPosting.ID,
		UpdatedBy:      jobPosting.UpdatedBy,
		Title:          pgtype.Text{Valid: false},
		DepartmentID:   pgtype.Int8{Valid: false},
		Location:       pgtype.Text{Valid: false},
		EmploymentType: pgtype.Text{Valid: false},
		Content:        pgtype.Text{Valid: false},
		SalaryRange:    pgtype.Text{Valid: false},
		StartDate:      pgtype.Timestamptz{Valid: false},
		EndDate:        pgtype.Timestamptz{Valid: false},
	}

	if jobPosting.Title != nil {
		updateParams.Title = pgtype.Text{String: *jobPosting.Title, Valid: true}
	}
	if jobPosting.DepartmentID != nil {
		updateParams.DepartmentID = pgtype.Int8{Int64: *jobPosting.DepartmentID, Valid: true}
	}
	if jobPosting.Location != nil {
		updateParams.Location = pgtype.Text{String: *jobPosting.Location, Valid: true}
	}
	if jobPosting.EmploymentType != nil {
		updateParams.EmploymentType = pgtype.Text{String: *jobPosting.EmploymentType, Valid: true}
	}
	if jobPosting.Content != nil {
		updateParams.Content = pgtype.Text{String: *jobPosting.Content, Valid: true}
	}
	if jobPosting.SalaryRange != nil {
		updateParams.SalaryRange = pgtype.Text{String: *jobPosting.SalaryRange, Valid: true}
	}
	if jobPosting.StartDate != nil {
		updateParams.StartDate = pgtype.Timestamptz{Time: *jobPosting.StartDate, Valid: true}
	}
	if jobPosting.EndDate != nil {
		updateParams.EndDate = pgtype.Timestamptz{Time: *jobPosting.EndDate, Valid: true}
	}

	if err := cr.queries.UpdateJobPosting(ctx, updateParams); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "job posting with ID %d not found", jobPosting.ID)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error updating job posting with ID %d", jobPosting.ID)
	}

	return cr.GetJobPosting(ctx, jobPosting.ID)
}

func (cr *CareerRepository) PublishJobPosting(ctx context.Context, jobPostingID int64, userID int64) (*repository.JobPosting, error) {
	if err := cr.queries.PublishJobPosting(ctx, generated.PublishJobPostingParams{
		ID:        jobPostingID,
		UpdatedBy: userID,
	}); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "job posting with ID %d not found", jobPostingID)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error publishing job posting with ID %d", jobPostingID)
	}

	return cr.GetJobPosting(ctx, jobPostingID)
}

func (cr *CareerRepository) ChangeJobPostingVisibility(ctx context.Context, jobPostingID int64, userID int64, showCase bool) (*repository.JobPosting, error) {
	params := generated.ChangeVisibilityJobPostingParams{
		ID:          jobPostingID,
		ShowCase:    showCase,
		UpdatedBy:   userID,
		Published:   pgtype.Bool{Valid: false},
		PublishedAt: pgtype.Timestamptz{Valid: false},
	}

	// if we showcasing the job posting, we need to check if it is already published
	if showCase {
		isPublished, err := cr.queries.CheckJobPostingIsPublished(ctx, jobPostingID)
		if err != nil {
			if errors.Is(err, sql.ErrNoRows) {
				return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "job posting with ID %d not found or not published", jobPostingID)
			}
			return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error checking if job posting with ID %d is published: %s", jobPostingID, err.Error())
		}

		if !isPublished {
			params.Published = pgtype.Bool{Bool: true, Valid: true}
			params.PublishedAt = pgtype.Timestamptz{Time: time.Now(), Valid: true}
		}
	}

	if err := cr.queries.ChangeVisibilityJobPosting(ctx, params); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "job posting with ID %d not found", jobPostingID)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error changing visibility of job posting with ID %d", jobPostingID)
	}

	return cr.GetJobPosting(ctx, jobPostingID)
}

func (cr *CareerRepository) ListJobPosting(ctx context.Context, filter *repository.JobPostingFilter) ([]*repository.JobPosting, *pkg.Pagination, error) {
	listParams := generated.ListJobPostingsParams{
		Limit:          int32(filter.Pagination.PageSize),
		Offset:         pkg.Offset(filter.Pagination.Page, filter.Pagination.PageSize),
		Search:         pgtype.Text{Valid: false},
		EmploymentType: pgtype.Text{Valid: false},
		Published:      pgtype.Bool{Valid: false},
		ShowCase:       pgtype.Bool{Valid: false},
	}

	countParams := generated.CountJobPostingsParams{
		Search:         pgtype.Text{Valid: false},
		EmploymentType: pgtype.Text{Valid: false},
		Published:      pgtype.Bool{Valid: false},
		ShowCase:       pgtype.Bool{Valid: false},
	}

	if filter.Search != nil {
		search := "%" + *filter.Search + "%"
		listParams.Search = pgtype.Text{String: search, Valid: true}
		countParams.Search = pgtype.Text{String: search, Valid: true}
	}
	if filter.EmploymentType != nil {
		listParams.EmploymentType = pgtype.Text{String: *filter.EmploymentType, Valid: true}
		countParams.EmploymentType = pgtype.Text{String: *filter.EmploymentType, Valid: true}
	}
	if filter.Published != nil {
		listParams.Published = pgtype.Bool{Bool: *filter.Published, Valid: true}
		countParams.Published = pgtype.Bool{Bool: *filter.Published, Valid: true}
	}
	if filter.ShowCase != nil {
		listParams.ShowCase = pgtype.Bool{Bool: *filter.ShowCase, Valid: true}
		countParams.ShowCase = pgtype.Bool{Bool: *filter.ShowCase, Valid: true}
	}

	jobPostings, err := cr.queries.ListJobPostings(ctx, listParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error listing job postings: %s", err.Error())
	}
	count, err := cr.queries.CountJobPostings(ctx, countParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error counting job postings: %s", err.Error())
	}

	rslt := make([]*repository.JobPosting, len(jobPostings))
	for i, jobPosting := range jobPostings {
		rslt[i] = &repository.JobPosting{
			ID:             jobPosting.ID,
			Title:          jobPosting.Title,
			DepartmentID:   jobPosting.DepartmentID,
			DepartmentName: jobPosting.DepartmentName,
			Location:       jobPosting.Location,
			EmploymentType: jobPosting.EmploymentType,
			Content:        jobPosting.Content,
			SalaryRange:    nil,
			StartDate:      jobPosting.StartDate,
			EndDate:        jobPosting.EndDate,
			ShowCase:       jobPosting.ShowCase,
			Published:      jobPosting.Published,
			PublishedAt:    nil,
			UpdatedBy:      jobPosting.UpdatedBy,
			CreatedBy:      jobPosting.CreatedBy,
			UpdatedAt:      jobPosting.UpdatedAt,
			CreatedAt:      jobPosting.CreatedAt,
			DeletedBy:      nil,
			DeletedAt:      nil,
		}

		if jobPosting.SalaryRange.Valid {
			rslt[i].SalaryRange = &jobPosting.SalaryRange.String
		}
		if jobPosting.PublishedAt.Valid {
			rslt[i].PublishedAt = &jobPosting.PublishedAt.Time
		}
	}
	return rslt, pkg.CalculatePagination(uint32(count), filter.Pagination.PageSize, filter.Pagination.Page), nil
}

func (cr *CareerRepository) DeleteJobPosting(ctx context.Context, jobPostingID int64, userID int64) error {
	if err := cr.queries.DeleteJobPosting(ctx, generated.DeleteJobPostingParams{
		ID:        jobPostingID,
		DeletedBy: pgtype.Int8{Int64: userID, Valid: true},
	}); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return pkg.Errorf(pkg.NOT_FOUND_ERROR, "job posting with ID %d not found", jobPostingID)
		}
		return pkg.Errorf(pkg.INTERNAL_ERROR, "error deleting job posting with ID %d", jobPostingID)
	}
	return nil
}
