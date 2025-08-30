// Pagination Info
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

// Common response
export interface Commonresponse {
	statusCode?: string;
	message?: string;
	metadata?: Pagination;
	data: any;
}

// Table filter type
export interface TableFilter {
	options: {
		label: string;
		value: string;
	}[];
}

// Auth Data
export interface AuthData {
	access_token: string;
	refresh_token?: string;
	firebase_token?: string;
	roles?: string[];
}
