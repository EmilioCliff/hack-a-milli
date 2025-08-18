package repository

import (
	"context"
	"time"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
)

type JobPosting struct {
	ID             int64      `json:"id"`
	Title          string     `json:"title"`
	DepartmentID   int64      `json:"department_id"`
	DepartmentName string     `json:"department_name"`
	Location       string     `json:"location"`
	EmploymentType string     `json:"employment_type"`
	Content        string     `json:"content"`
	SalaryRange    *string    `json:"salary_range"`
	StartDate      time.Time  `json:"start_date"`
	EndDate        time.Time  `json:"end_date"`
	ShowCase       bool       `json:"show_case"`
	Published      bool       `json:"published"`
	PublishedAt    *time.Time `json:"published_at"`
	UpdatedBy      int64      `json:"updated_by"`
	CreatedBy      int64      `json:"created_by"`
	UpdatedAt      time.Time  `json:"updated_at"`
	CreatedAt      time.Time  `json:"created_at"`
	DeletedBy      *int64     `json:"deleted_by,omitempty"`
	DeletedAt      *time.Time `json:"deleted_at,omitempty"`
}

type UpdateJobPosting struct {
	ID             int64      `json:"id"`
	UpdatedBy      int64      `json:"updated_by"`
	Title          *string    `json:"title"`
	DepartmentID   *int64     `json:"department_id"`
	Location       *string    `json:"location"`
	EmploymentType *string    `json:"employment_type"`
	Content        *string    `json:"content"`
	SalaryRange    *string    `json:"salary_range"`
	StartDate      *time.Time `json:"start_date"`
	EndDate        *time.Time `json:"end_date"`
	ShowCase       *bool      `json:"show_case"`
	Published      *bool      `json:"published"`
	DeletedBy      *int64     `json:"deleted_by"`
}

type JobPostingFilter struct {
	Pagination     *pkg.Pagination
	Search         *string
	EmploymentType *string
	ShowCase       *bool
	Published      *bool
}

type CareerRepository interface {
	// Job Postings Methods
	CreateJobPosting(ctx context.Context, jobPosting *JobPosting) (*JobPosting, error)
	GetJobPosting(ctx context.Context, id int64) (*JobPosting, error)
	GetPublishedJobPosting(ctx context.Context, id int64) (*JobPosting, error)
	UpdateJobPosting(ctx context.Context, jobPosting *UpdateJobPosting) (*JobPosting, error)
	PublishJobPosting(ctx context.Context, jobPostingID int64, userID int64) (*JobPosting, error)
	ChangeJobPostingVisibility(ctx context.Context, jobPostingID int64, userID int64, showCase bool) (*JobPosting, error)
	ListJobPosting(ctx context.Context, filter *JobPostingFilter) ([]*JobPosting, *pkg.Pagination, error)
	DeleteJobPosting(ctx context.Context, jobPostingID int64, userID int64) error

	// Job Applications Methods
	CreateJobApplication(ctx context.Context, jobApplication *JobApplication) (*JobApplication, error)
	GetJobApplication(ctx context.Context, id int64) (*JobApplication, error)
	UpdateJobApplication(ctx context.Context, jobApplication *UpdateJobApplication) (*JobApplication, error)
	ListJobApplications(ctx context.Context, filter *JobApplicationFilter) ([]*JobApplication, *pkg.Pagination, error)
}
