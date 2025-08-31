import { z } from 'zod';

export const CompanySchema = z.object({
	name: z.string().min(1, 'Name is required'),
	logo_url: z.url('Logo URL must be a valid URL'),
	website: z.url('Website must be a valid URL'),
	email: z.email('Email must be valid'),
	phone_number: z.string().min(1, 'Phone number is required'),
});

export type CompanyForm = z.infer<typeof CompanySchema>;

export const SpeakersSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	title: z.string().min(1, 'Title is required'),
	organization: z.string().min(1, 'Organization is required'),
	bio: z.string().min(1, 'Bio is required'),
	avatar_url: z.url('Avatar URL must be valid'),
	linked_in_url: z.url('LinkedIn URL must be valid'),
});

export type SpeakersForm = z.infer<typeof SpeakersSchema>;

export const AgendaSchema = z.object({
	time: z.string().min(1, 'Time is required'),
	title: z.string().min(1, 'Title is required'),
	speaker: z.string().min(1, 'Speaker is required'),
});

export type AgendaForm = z.infer<typeof AgendaSchema>;

export const VenueSchema = z.object({
	type: z.string(),
	platform: z.string().optional(),
	meeting_id: z.string().optional(),
	passcode: z.string().optional(),
	event_link: z.string().url().optional(),
	address: z.string().optional(),
});

export type VenueForm = z.infer<typeof VenueSchema>;

export const EventRegistrantSchema = z.object({
	id: z.number().int().optional(),
	event_id: z.number().int(),
	name: z.string().min(1, 'Name is required'),
	email: z.string().email('Email must be valid'),
	registered_at: z.date().optional(),
});

export type EventRegistrantForm = z.infer<typeof EventRegistrantSchema>;

export const EventSchema = z.object({
	id: z.number().int().positive(),
	title: z.string().max(255),
	topic: z.string().max(255),
	content: z.string(),
	cover_img: z.url(),
	start_time: z.iso.datetime(),
	end_time: z.iso.datetime(),
	status: z.string(),
	venue: VenueSchema,
	price: z.string().default('free'),
	agenda: z.array(AgendaSchema).default([]),
	tags: z.array(z.string()).default([]),
	organizers: z.array(CompanySchema).default([]),
	partners: z.array(CompanySchema).default([]),
	speakers: z.array(SpeakersSchema).default([]),
	max_attendees: z.number().int().positive().default(500),
	registered_attendees: z.number().int().nonnegative().default(0),
	published: z.boolean().default(false),
	published_at: z.iso.datetime().nullable(),
});

export type Event = z.infer<typeof EventSchema>;

export const EventFormSchema = z.object({
	title: z.string().min(3).max(255),
	topic: z.string().min(2).max(255),
	content: z.string().min(20),
	cover_img: z.string().url('Cover image must be a valid URL'),
	start_time: z.iso.datetime(),
	end_time: z.iso.datetime(),
	status: z.string(),
	venue: VenueSchema,
	price: z.string().default('free'),
	agenda: z.array(AgendaSchema).optional(),
	tags: z.array(z.string()).optional(),
	organizers: z.array(CompanySchema).optional(),
	partners: z.array(CompanySchema).optional(),
	speakers: z.array(SpeakersSchema).optional(),
	max_attendees: z.number().int().positive().default(500),
	published: z.boolean().optional(),
	published_at: z.iso.datetime().optional().nullable(),
});

export type EventForm = z.infer<typeof EventFormSchema>;
