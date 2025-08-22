// Pagination info
export interface Pagination {
	page: number;
	page_size: number;
	total: number;
	total_pages: number;
	has_next: boolean;
	has_previous: boolean;
	next_page: number;
	previous_page: number;
}

// Common response type
export interface CommonResponse {
	statusCode?: string;
	message?: string;
	pagination?: Pagination;
	data: any;
}

// Event Speaker
export interface Speaker {
	name: string;
	title: string;
	organization: string;
	bio: string;
	avatar_url: string;
	linked_in_url: string;
}

// Event Organizer
export interface Organizer {
	name: string;
	logo_url: string;
	website: string;
	email: string;
	phone_number: string;
}

// Event Agenda
export interface Agenda {
	time: string;
	title: string;
	speaker: string;
}

// Event Venue
export interface Venue {
	type: string;
	platform?: string;
	meeting_id?: string;
	passcode?: string;
	event_link?: string;
	address?: string;
}

// Event Item
export interface EventItem {
	id: number;
	title: string;
	topic: string;
	content: string;
	cover_img: string;
	start_time: string; // ISO string
	end_time: string; // ISO string
	status: string;
	price: string;
	max_attendees: number;
	registered_attendees: number;
	tags?: string[];
	venue?: Venue;
	agenda?: Agenda[];
	organizers?: Organizer[];
	partners?: Organizer[];
	speakers?: Speaker[];
}

// News Updates
export interface NewsUpdate {
	id: number;
	title: string;
	topic: string;
	date: string; // ISO string
	min_read: number;
	excerpt: string;
	content: string;
	cover_img: string;
}

// News Letter
export interface NewsLetter {
	id: number;
	title: string;
	description: string;
	pdf_url: string;
	date: string; // ISO date string
}

// Job Posting
export interface JobPosting {
	id: number;
	title: string;
	department_id: number;
	department_name: string;
	location: string;
	employment_type: string;
	content: string;
	salary_range: string | null;
	start_date: string; // ISO Date string
	end_date: string; // ISO Date string
}

// Merchandise Item
export interface Merchandise {
	id: number;
	category_id: number;
	category_name: string;
	name: string;
	price: number;
	image_url: string[];
	description: string | null;
	items_sold: number;
}

// Blog Author
export interface BlogAuthor {
	id: number;
	email: string;
	full_name: string;
	avatar_url: string;
}

// Blog
export interface Blog {
	id: number;
	title: string;
	cover_img: string;
	topic: string;
	description: string;
	content: string; // contains HTML
	views: number;
	min_read: number;
	author_details: BlogAuthor;
	published_at: string; // ISO Date string
}

// Registrars
export interface Registrar {
	id: number;
	email: string;
	name: string;
	logo_url: string;
	address: string;
	specialities: string[];
	phone_number: string;
	website_url: string;
	created_at: string;
}

export interface Message {
	id: number;
	message: string;
	type: string; // 'SENT' or 'RECEIVED'
}

export interface AuthData {
	access_token: string;
	refresh_token?: string;
	roles?: string[];
}

export interface EventsResponse extends Omit<CommonResponse, 'data'> {
	data: EventItem[];
}

export interface EventResponse extends Omit<CommonResponse, 'data'> {
	data: EventItem;
}

export interface NewsUpdatesResponse extends Omit<CommonResponse, 'data'> {
	data: NewsUpdate[];
}

export interface NewsUpdateResponse extends Omit<CommonResponse, 'data'> {
	data: NewsUpdate;
	related_updates?: NewsUpdate[];
}

export interface NewsLettersResponse extends Omit<CommonResponse, 'data'> {
	data: NewsLetter[];
}

export interface JobPostingsResponse extends Omit<CommonResponse, 'data'> {
	data: JobPosting[];
}

export interface JobPostingResponse extends Omit<CommonResponse, 'data'> {
	data: JobPosting;
}

export interface MerchandisesResponse extends Omit<CommonResponse, 'data'> {
	data: Merchandise[];
}

export interface MerchandiseResponse extends Omit<CommonResponse, 'data'> {
	data: Merchandise;
}

export interface BlogsResponse extends Omit<CommonResponse, 'data'> {
	data: Blog[];
}

export interface BlogResponse extends Omit<CommonResponse, 'data'> {
	data: Blog;
}

export interface RegistrarsResponse extends Omit<CommonResponse, 'data'> {
	data: Registrar[];
}

export interface RegistrarResponse extends Omit<CommonResponse, 'data'> {
	data: Registrar;
}

export interface AuthResponse extends Omit<CommonResponse, 'data'> {
	data: AuthData;
}
