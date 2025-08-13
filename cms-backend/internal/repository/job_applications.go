package repository

import (
	"context"
	"time"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
)

type JobApplication struct {
	ID          int64     `json:"id"`
	JobID       int64     `json:"job_id"`
	FullName    string    `json:"full_name"`
	Email       string    `json:"email"`
	PhoneNumber string    `json:"phone_number"`
	CoverLetter string    `json:"cover_letter"`
	ResumeUrl   string    `json:"resume_url"`
	Status      string    `json:"status"`
	Comment     *string   `json:"comment"`
	SubmittedAt time.Time `json:"submitted_at"`
	UpdatedBy   *int64    `json:"updated_by"`
	UpdatedAt   time.Time `json:"updated_at"`

	// Expandable
	Job *JobPosting `json:"job,omitempty"`
}

type UpdateJobApplication struct {
	Id        int64   `json:"id"`
	UpdatedBy int64   `json:"updated_by"`
	Status    *string `json:"status"`
	Comment   *string `json:"comment"`
}

type JobApplicationFilter struct {
	Pagination *pkg.Pagination
	JobID      *int64
	Search     *string
	Status     *string
}

type JobApplicationRepository interface {
	CreateJobApplication(ctx context.Context, jobApplication *JobApplication) (*JobApplication, error)
	GetJobApplication(ctx context.Context, id int64) (*JobApplication, error)
	UpdateJobApplication(ctx context.Context, jobApplication *JobApplication) (*JobApplication, error)
	ListJobApplications(ctx context.Context, filter *JobApplicationFilter) ([]*JobApplication, *pkg.Pagination, error)
}
