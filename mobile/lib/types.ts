import z from 'zod';
import {
	ForgotPasswordSchema,
	ResetPasswordSchema,
	SignInFormShema,
	SignUpFormSchema,
	VerifyOTPSchema,
} from './schemas';

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

// Chat Message
export interface Message {
	id: string;
	content: string;
	role: string; // 'user' or 'assistant'
}

// Auth Data
export interface AuthData {
	user: User;
	auth: AuthPayload;
}

export interface AuthPayload {
	access_token: string;
	refresh_token?: string;
	firebase_token?: string;
	roles?: string[];
}

// Bids
export interface Bids {
	id: number;
	auction_id: number;
	user_identifier: number;
	amount: number;
	created_at: string;
	user_id?: string;
}

// Auction
export interface Auction {
	id: number;
	domain: string;
	category: string;
	description: string;
	current_bid: number;
	start_price: number;
	start_time: string;
	end_time: string;
	watchers: string;
	bids_count: string;
	status: string;
	top_four_bids?: Bids[];
}

// Notification Data
export interface NotificationData {
	type: string;
	id: number;
}

export interface User {
	id: number;
	email: string;
	full_name: string;
	phone_number: string;
	address?: string;
	avatar_url?: string;
	roles: string[];
}

export interface SendMessageData {
	sessionId?: string; // if not provided, create new session
	message: Message;
	history: Message[];
}

export interface SendMessageResponse {
	data: string;
	title?: string;
	chat_id?: number;
	message?: string;
	status_code?: string;
}

export interface Bid {
	id: number;
	auction_id: number;
	user_id: number;
	amount: number;
	user_identifier: string;
	created_at: string;
	user?: User;
}

export interface Watcher {
	id: number;
	auction_id: number;
	user_id: number;
	status: string;
	created_at: string;
	user?: User;
}

// from schemas
export type SignUpFormType = z.infer<typeof SignUpFormSchema>;
export type SignInFormType = z.infer<typeof SignInFormShema>;
export type ForgotPasswordForm = z.infer<typeof ForgotPasswordSchema>;
export type VerifyOTPForm = z.infer<typeof VerifyOTPSchema>;
export type ResetPasswordForm = z.infer<typeof ResetPasswordSchema>;

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

export interface AuctionResponse extends Omit<CommonResponse, 'data'> {
	data: Auction[];
}

export interface GetChatResponse extends Omit<CommonResponse, 'data'> {
	data: {
		id: number;
		user_id: number;
		title: string;
		message: Message[];
		created_at: string;
	};
}

export interface PostBidResponse extends Omit<CommonResponse, 'data'> {
	data: Bid;
}

export interface PostWatcherResponse extends Omit<CommonResponse, 'data'> {
	data: Watcher;
}
