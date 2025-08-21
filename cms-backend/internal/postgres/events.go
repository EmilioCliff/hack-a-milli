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

var _ repository.EventRepository = (*EventRepository)(nil)

type EventRepository struct {
	queries *generated.Queries
}

func NewEventRepository(queries *generated.Queries) *EventRepository {
	return &EventRepository{queries: queries}
}

func (er *EventRepository) CreateEvent(ctx context.Context, event *repository.Event) (*repository.Event, error) {
	createParams := generated.CreateEventParams{
		Title:        event.Title,
		Topic:        event.Topic,
		Content:      event.Content,
		CoverImg:     event.CoverImg,
		StartTime:    event.StartTime,
		EndTime:      event.EndTime,
		Status:       event.Status,
		Price:        pgtype.Text{Valid: false},
		Tags:         event.Tags,
		MaxAttendees: pgtype.Int4{Valid: false},
		UpdatedBy:    event.UpdatedBy,
		CreatedBy:    event.CreatedBy,
		Venue:        nil,
		Agenda:       nil,
		Organizers:   nil,
		Partners:     nil,
		Speakers:     nil,
	}

	if event.Venue.Type != "" {
		venueBytes, err := json.Marshal(event.Venue)
		if err != nil {
			return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error marshalling venue: %s", err.Error())
		}
		if len(venueBytes) > 0 {
			createParams.Venue = venueBytes
		}
	}

	if event.Agenda != nil {
		agendaBytes, err := json.Marshal(event.Agenda)
		if err != nil {
			return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error marshalling agenda: %s", err.Error())
		}
		if len(agendaBytes) > 0 {
			createParams.Agenda = agendaBytes
		}
	}

	if event.Organizers != nil {
		orgBytes, err := json.Marshal(event.Organizers)
		if err != nil {
			return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error marshalling organizers: %s", err.Error())
		}
		if len(orgBytes) > 0 {
			createParams.Organizers = orgBytes
		}
	}

	if event.Partners != nil {
		partBytes, err := json.Marshal(event.Partners)
		if err != nil {
			return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error marshalling partners: %s", err.Error())
		}
		if len(partBytes) > 0 {
			createParams.Partners = partBytes
		}
	}

	if event.Speakers != nil {
		speakerBytes, err := json.Marshal(event.Speakers)
		if err != nil {
			return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error marshalling speakers: %s", err.Error())
		}
		if len(speakerBytes) > 0 {
			createParams.Speakers = speakerBytes
		}
	}

	eventID, err := er.queries.CreateEvent(ctx, createParams)
	if err != nil {
		if pkg.PgxErrorCode(err) == pkg.UNIQUE_VIOLATION {
			return nil, pkg.Errorf(pkg.ALREADY_EXISTS_ERROR, "event with title %s already exists", event.Title)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error creating event: %s", err.Error())
	}

	event.ID = eventID

	return event, nil
}

func (er *EventRepository) GetEvent(ctx context.Context, id int64) (*repository.Event, error) {
	event, err := er.queries.GetEvent(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "event with ID %d not found", id)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error retrieving event: %s", err.Error())
	}

	rslt, err := convertEventToRepositoryEvent(event)
	if err != nil {
		return nil, err
	}

	return rslt, nil
}

func (er *EventRepository) GetPublishedEvent(ctx context.Context, id int64) (*repository.Event, error) {
	event, err := er.queries.GetPublishedEvent(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "event with ID %d not found", id)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error retrieving event: %s", err.Error())
	}

	rslt, err := convertEventToRepositoryEvent(event)
	if err != nil {
		return nil, err
	}

	return rslt, nil
}

func (er *EventRepository) UpdateEvent(ctx context.Context, event *repository.UpdateEvent) (*repository.Event, error) {
	updateParams := generated.UpdateEventParams{
		ID:                  event.ID,
		UpdatedBy:           event.UpdatedBy,
		Title:               pgtype.Text{Valid: false},
		Topic:               pgtype.Text{Valid: false},
		Content:             pgtype.Text{Valid: false},
		CoverImg:            pgtype.Text{Valid: false},
		StartTime:           pgtype.Timestamptz{Valid: false},
		EndTime:             pgtype.Timestamptz{Valid: false},
		Status:              pgtype.Text{Valid: false},
		Price:               pgtype.Text{Valid: false},
		MaxAttendees:        pgtype.Int4{Valid: false},
		Tags:                nil,
		RegisteredAttendees: pgtype.Int4{Valid: false},
		Venue:               nil,
		Agenda:              nil,
		Organizers:          nil,
		Partners:            nil,
		Speakers:            nil,
	}

	if event.Title != nil {
		updateParams.Title = pgtype.Text{String: *event.Title, Valid: true}
	}
	if event.Topic != nil {
		updateParams.Topic = pgtype.Text{String: *event.Topic, Valid: true}
	}
	if event.Content != nil {
		updateParams.Content = pgtype.Text{String: *event.Content, Valid: true}
	}
	if event.CoverImg != nil {
		updateParams.CoverImg = pgtype.Text{String: *event.CoverImg, Valid: true}
	}
	if event.StartTime != nil {
		updateParams.StartTime = pgtype.Timestamptz{Time: *event.StartTime, Valid: true}
	}
	if event.EndTime != nil {
		updateParams.EndTime = pgtype.Timestamptz{Time: *event.EndTime, Valid: true}
	}
	if event.Status != nil {
		updateParams.Status = pgtype.Text{String: *event.Status, Valid: true}
	}
	if event.Price != nil {
		updateParams.Price = pgtype.Text{String: *event.Price, Valid: true}
	}
	if event.Tags != nil {
		updateParams.Tags = *event.Tags
	}
	if event.MaxAttendees != nil {
		updateParams.MaxAttendees = pgtype.Int4{Int32: *event.MaxAttendees, Valid: true}
	}
	if event.RegisteredAttendees != nil {
		updateParams.RegisteredAttendees = pgtype.Int4{Int32: *event.RegisteredAttendees, Valid: true}
	}

	if event.Venue != nil {
		venueBytes, err := json.Marshal(event.Venue)
		if err != nil {
			return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error marshalling venue: %s", err.Error())
		}
		if len(venueBytes) > 0 {
			updateParams.Venue = venueBytes
		}
	}

	if event.Agenda != nil {
		agendaBytes, err := json.Marshal(event.Agenda)
		if err != nil {
			return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error marshalling agenda: %s", err.Error())
		}
		if len(agendaBytes) > 0 {
			updateParams.Agenda = agendaBytes
		}
	}

	if event.Organizers != nil {
		orgBytes, err := json.Marshal(event.Organizers)
		if err != nil {
			return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error marshalling organizers: %s", err.Error())
		}
		if len(orgBytes) > 0 {
			updateParams.Organizers = orgBytes
		}
	}
	if event.Partners != nil {
		partBytes, err := json.Marshal(event.Partners)
		if err != nil {
			return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error marshalling partners: %s", err.Error())
		}
		if len(partBytes) > 0 {
			updateParams.Partners = partBytes
		}
	}
	if event.Speakers != nil {
		speakerBytes, err := json.Marshal(event.Speakers)
		if err != nil {
			return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error marshalling speakers: %s", err.Error())
		}
		if len(speakerBytes) > 0 {
			updateParams.Speakers = speakerBytes
		}
	}
	if err := er.queries.UpdateEvent(ctx, updateParams); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "event with ID %d not found", event.ID)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error updating event: %s", err.Error())
	}

	return er.GetEvent(ctx, event.ID)
}

func (er *EventRepository) PublishEvent(ctx context.Context, eventID int64, userID int64) (*repository.Event, error) {
	if err := er.queries.PublishEvent(ctx, generated.PublishEventParams{
		ID:        eventID,
		UpdatedBy: userID,
	}); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "event with ID %d not found", eventID)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error publishing event: %s", err.Error())
	}

	return er.GetEvent(ctx, eventID)
}

func (er *EventRepository) ListEvent(ctx context.Context, filter *repository.EventFilter) ([]*repository.Event, *pkg.Pagination, error) {
	listParams := generated.ListEventsParams{
		Offset:    pkg.Offset(filter.Pagination.Page, filter.Pagination.PageSize),
		Limit:     int32(filter.Pagination.PageSize),
		Search:    pgtype.Text{Valid: false},
		Status:    pgtype.Text{Valid: false},
		Venue:     pgtype.Text{Valid: false},
		Published: pgtype.Bool{Valid: false},
		StartTime: pgtype.Timestamptz{Valid: false},
		EndTime:   pgtype.Timestamptz{Valid: false},
		Tags:      nil,
	}

	countParams := generated.CountEventsParams{
		Search:    pgtype.Text{Valid: false},
		Status:    pgtype.Text{Valid: false},
		Venue:     pgtype.Text{Valid: false},
		Published: pgtype.Bool{Valid: false},
		StartTime: pgtype.Timestamptz{Valid: false},
		EndTime:   pgtype.Timestamptz{Valid: false},
		Tags:      nil,
	}

	if filter.Search != nil {
		search := "%" + *filter.Search + "%"
		listParams.Search = pgtype.Text{String: search, Valid: true}
		countParams.Search = pgtype.Text{String: search, Valid: true}
	}
	if filter.Status != nil {
		listParams.Status = pgtype.Text{String: *filter.Status, Valid: true}
		countParams.Status = pgtype.Text{String: *filter.Status, Valid: true}
	}
	if filter.Venue != nil {
		listParams.Venue = pgtype.Text{String: *filter.Venue, Valid: true}
		countParams.Venue = pgtype.Text{String: *filter.Venue, Valid: true}
	}
	if filter.Published != nil {
		listParams.Published = pgtype.Bool{Bool: *filter.Published, Valid: true}
		countParams.Published = pgtype.Bool{Bool: *filter.Published, Valid: true}
	}
	if filter.Tags != nil {
		listParams.Tags = *filter.Tags
		countParams.Tags = *filter.Tags
	}
	if filter.StartTime != nil && filter.EndTime != nil {
		listParams.StartTime = pgtype.Timestamptz{Time: *filter.StartTime, Valid: true}
		listParams.EndTime = pgtype.Timestamptz{Time: *filter.EndTime, Valid: true}
		countParams.StartTime = pgtype.Timestamptz{Time: *filter.StartTime, Valid: true}
		countParams.EndTime = pgtype.Timestamptz{Time: *filter.EndTime, Valid: true}
	}

	events, err := er.queries.ListEvents(ctx, listParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error listing events: %s", err.Error())
	}

	count, err := er.queries.CountEvents(ctx, countParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error counting events: %s", err.Error())
	}

	rslt := make([]*repository.Event, len(events))
	for i, event := range events {
		rslt[i], err = convertEventToRepositoryEvent(event)
		if err != nil {
			return nil, nil, err
		}
	}

	return rslt, pkg.CalculatePagination(uint32(count), filter.Pagination.PageSize, filter.Pagination.Page), nil
}

func (er *EventRepository) DeleteEvent(ctx context.Context, eventID int64, userID int64) error {
	if err := er.queries.DeleteEvent(ctx, generated.DeleteEventParams{
		ID:        eventID,
		DeletedBy: pgtype.Int8{Int64: userID, Valid: true},
	}); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return pkg.Errorf(pkg.NOT_FOUND_ERROR, "event with ID %d not found", eventID)
		}
		return pkg.Errorf(pkg.INTERNAL_ERROR, "error deleting event: %s", err.Error())
	}
	return nil
}

func (er *EventRepository) CreateEventRegistrant(ctx context.Context, registrant *repository.EventRegistrant) (*repository.EventRegistrant, error) {
	if exists, _ := er.queries.EventExists(ctx, registrant.EventID); !exists {
		return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "event with ID %d does not exist", registrant.EventID)
	}

	if exists, _ := er.queries.CheckEventRegistrantExists(ctx, generated.CheckEventRegistrantExistsParams{
		EventID: registrant.EventID,
		Email:   registrant.Email,
	}); exists {
		return nil, pkg.Errorf(pkg.ALREADY_EXISTS_ERROR, "registrant with email %s already exists for event ID %d", registrant.Email, registrant.EventID)
	}

	if exists, _ := er.queries.CheckEventIsPublishedAndUpcomingOrLive(ctx, registrant.EventID); !exists {
		return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "event with ID %d is not published or not upcoming/live", registrant.EventID)
	}

	registrantId, err := er.queries.CreateEventRegistrant(ctx, generated.CreateEventRegistrantParams{
		EventID: registrant.EventID,
		Name:    registrant.Name,
		Email:   registrant.Email,
	})
	if err != nil {
		if pkg.PgxErrorCode(err) == pkg.UNIQUE_VIOLATION {
			return nil, pkg.Errorf(pkg.ALREADY_EXISTS_ERROR, "registrant with email %s already exists for event ID %d", registrant.Email, registrant.EventID)
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error creating event registrant: %s", err.Error())
	}

	_ = er.queries.AddEventRegisteredAttedee(ctx, registrant.EventID)

	registrant.ID = registrantId

	return registrant, nil
}

func (er *EventRepository) ListEventRegistrants(ctx context.Context, eventID int64, pagination *pkg.Pagination) ([]*repository.EventRegistrant, *pkg.Pagination, error) {
	listParams := generated.ListEventRegistrantsParams{
		Offset:  pkg.Offset(pagination.Page, pagination.PageSize),
		Limit:   int32(pagination.PageSize),
		EventID: eventID,
	}

	eventRegistrants, err := er.queries.ListEventRegistrants(ctx, listParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error listing event registrants: %s", err.Error())
	}

	count, err := er.queries.CountEventRegistrants(ctx, eventID)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error counting event registrants: %s", err.Error())
	}

	rslt := make([]*repository.EventRegistrant, len(eventRegistrants))
	for i, registrant := range eventRegistrants {
		rslt[i] = &repository.EventRegistrant{
			ID:           registrant.ID,
			EventID:      registrant.EventID,
			Name:         registrant.Name,
			Email:        registrant.Email,
			RegisteredAt: registrant.RegisteredAt,
		}
	}

	return rslt, pkg.CalculatePagination(uint32(count), pagination.PageSize, pagination.Page), nil
}

func convertEventToRepositoryEvent(event generated.Event) (*repository.Event, error) {
	rslt := &repository.Event{
		ID:                  event.ID,
		Title:               event.Title,
		Topic:               event.Topic,
		Content:             event.Content,
		CoverImg:            event.CoverImg,
		StartTime:           event.StartTime,
		EndTime:             event.EndTime,
		Status:              event.Status,
		Price:               event.Price,
		Tags:                event.Tags,
		Venue:               repository.Venue{},
		Agenda:              []repository.Agenda{},
		Organizers:          []repository.Company{},
		Partners:            []repository.Company{},
		Speakers:            []repository.Speakers{},
		MaxAttendees:        event.MaxAttendees,
		RegisteredAttendees: event.RegisteredAttendees,
		Published:           event.Published,
		UpdatedBy:           event.UpdatedBy,
		UpdatedAt:           event.UpdatedAt,
		CreatedBy:           event.CreatedBy,
		CreatedAt:           event.CreatedAt,
		DeletedBy:           nil,
		DeletedAt:           nil,
	}

	if len(event.Venue) > 0 && !isEmptyJSON(event.Venue) {
		if err := json.Unmarshal(event.Venue, &rslt.Venue); err != nil {
			return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error unmarshalling venue: %s", err.Error())
		}
	}
	if len(event.Agenda) > 0 && !isEmptyJSON(event.Agenda) {
		if err := json.Unmarshal(event.Agenda, &rslt.Agenda); err != nil {
			return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error unmarshalling agenda: %s", err.Error())
		}
	}
	if len(event.Organizers) > 0 && !isEmptyJSON(event.Organizers) {
		if err := json.Unmarshal(event.Organizers, &rslt.Organizers); err != nil {
			return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error unmarshalling organizers: %s", err.Error())
		}
	}
	if len(event.Partners) > 0 && !isEmptyJSON(event.Partners) {
		if err := json.Unmarshal(event.Partners, &rslt.Partners); err != nil {
			return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error unmarshalling partners: %s", err.Error())
		}
	}
	if len(event.Speakers) > 0 && !isEmptyJSON(event.Speakers) {
		if err := json.Unmarshal(event.Speakers, &rslt.Speakers); err != nil {
			return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "error unmarshalling speakers: %s", err.Error())
		}
	}

	if event.PublishedAt.Valid {
		rslt.PublishedAt = &event.PublishedAt.Time
	}
	if event.DeletedBy.Valid {
		rslt.DeletedBy = &event.DeletedBy.Int64
	}
	if event.DeletedAt.Valid {
		rslt.DeletedAt = &event.DeletedAt.Time
	}

	return rslt, nil
}

func isEmptyJSON(data []byte) bool {
	trimmed := strings.TrimSpace(string(data))
	return trimmed == "{}" || trimmed == "[]" || trimmed == "null"
}
