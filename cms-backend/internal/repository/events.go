package repository

import (
	"context"
	"time"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
)

type Event struct {
	ID                  int64      `json:"id"`
	Title               string     `json:"title"`
	Topic               string     `json:"topic"`
	Content             string     `json:"content"`
	CoverImg            string     `json:"cover_img"`
	StartTime           string     `json:"start_time"`
	EndTime             string     `json:"end_time"`
	Status              string     `json:"status"`
	Price               string     `json:"price"`
	Tags                []string   `json:"tags"`
	MaxAttendees        int32      `json:"max_attendees"`
	RegisteredAttendees int32      `json:"registered_attendees"`
	Venue               Venue      `json:"venue"`
	Agenda              []Agenda   `json:"agenda"`
	Organizers          []Company  `json:"organizers"`
	Partners            []Company  `json:"partners"`
	Speakers            []Speakers `json:"speakers"`
	Published           bool       `json:"published"`
	PublishedAt         *time.Time `json:"published_at"`
	UpdatedBy           int64      `json:"updated_by"`
	UpdatedAt           time.Time  `json:"updated_at"`
	DeletedBy           *int64     `json:"deleted_by,omitempty"`
	DeletedAt           *time.Time `json:"deleted_at,omitempty"`
	CreatedBy           int64      `json:"created_by"`
	CreatedAt           time.Time  `json:"created_at"`
}

type Company struct {
	Name        string `json:"name" binding:"required"`
	LogoURL     string `json:"logo_url" binding:"required"`
	Website     string `json:"website" binding:"required"`
	Email       string `json:"email" binding:"required"`
	PhoneNumber string `json:"phone_number" binding:"required"`
}

type Speakers struct {
	Title        string `json:"title" binding:"required"`
	Organization string `json:"organization" binding:"required"`
	Bio          string `json:"bio" binding:"required"`
	AvatarURL    string `json:"avatar_url" binding:"required"`
	LinkedInURL  string `json:"linked_in_url" binding:"required"`
}

type Agenda struct {
	Time    string `json:"time" binding:"required"`
	Title   string `json:"title" binding:"required"`
	Speaker string `json:"speaker" binding:"required"`
}

type Venue struct {
	Type      string `json:"type" binding:"required,oneof=virtual,physical"` // virtual or physical
	Platform  string `json:"platform,omitempty"`
	MeetingID string `json:"meeting_id,omitempty"`
	Passcode  string `json:"passcode,omitempty"`
	EventLink string `json:"event_link,omitempty"`
	Address   string `json:"address,omitempty"`
}

type EventRegistrant struct {
	ID           int64     `json:"id"`
	EventID      int64     `json:"event_id"`
	Name         string    `json:"name"`
	Email        string    `json:"email"`
	RegisteredAt time.Time `json:"registered_at"`
}

type UpdateEvent struct {
	ID                  int64      `json:"id"`
	UpdatedBy           int64      `json:"updated_by"`
	Title               *string    `json:"title"`
	Topic               *string    `json:"topic"`
	Content             *string    `json:"content"`
	CoverImg            *string    `json:"cover_img"`
	StartTime           *string    `json:"start_time"`
	EndTime             *string    `json:"end_time"`
	Status              *string    `json:"status"`
	Price               *string    `json:"price"`
	Tags                []string   `json:"tags"`
	MaxAttendees        *int32     `json:"max_attendees"`
	RegisteredAttendees *int32     `json:"registered_attendees"`
	Venue               *Venue     `json:"venue"`
	Agenda              []Agenda   `json:"agenda"`
	Organizers          []Company  `json:"organizers"`
	Partners            []Company  `json:"partners"`
	Speakers            []Speakers `json:"speakers"`
	Published           *bool      `json:"published"`
	DeletedBy           *int64     `json:"deleted_by,omitempty"`
}

type EventFilter struct {
	Pagination *pkg.Pagination
	Search     *string
	Status     *string
	Published  *bool
	StartTime  *time.Time
	EndTime    *time.Time
	Tags       *[]string
}

type EventRepository interface {
	// Event methods
	CreateEvent(ctx context.Context, event *Event) (*Event, error)
	GetEvent(ctx context.Context, id int64) (*Event, error)
	UpdateEvent(ctx context.Context, event *UpdateEvent) (*Event, error)
	PublishEvent(ctx context.Context, eventID int64, userID int64) (*Event, error)
	ListEvent(ctx context.Context, filter *EventFilter) ([]*Event, *pkg.Pagination, error)
	DeleteEvent(ctx context.Context, eventID int64, userID int64) error

	// Event Registrant methods
	CreateEventRegistrant(ctx context.Context, registrant *EventRegistrant) (*EventRegistrant, error)
	ListEventRegistrants(ctx context.Context, eventID int64, pagination *pkg.Pagination) ([]*EventRegistrant, *pkg.Pagination, error)
}
