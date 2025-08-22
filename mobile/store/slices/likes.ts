import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LikesState {
	likedBlogIds: Record<string, true>;
	likedNewsIds: Record<string, true>;
}

const initialState: LikesState = {
	likedBlogIds: {},
	likedNewsIds: {},
};

const likesSlice = createSlice({
	name: 'likes',
	initialState,
	reducers: {
		// --- Blogs ---
		likeBlog(state, action: PayloadAction<string>) {
			state.likedBlogIds[action.payload] = true;
		},
		unlikeBlog(state, action: PayloadAction<string>) {
			delete state.likedBlogIds[action.payload];
		},
		setLikedBlogs(state, action: PayloadAction<string[]>) {
			state.likedBlogIds = {};
			action.payload.forEach((id) => {
				state.likedBlogIds[id] = true;
			});
		},

		// --- News ---
		likeNews(state, action: PayloadAction<string>) {
			state.likedNewsIds[action.payload] = true;
		},
		unlikeNews(state, action: PayloadAction<string>) {
			delete state.likedNewsIds[action.payload];
		},
		setLikedNews(state, action: PayloadAction<string[]>) {
			state.likedNewsIds = {};
			action.payload.forEach((id) => {
				state.likedNewsIds[id] = true;
			});
		},

		// --- Clear all ---
		clearLikes(state) {
			state.likedBlogIds = {};
			state.likedNewsIds = {};
		},
	},
});

export const {
	likeBlog,
	unlikeBlog,
	setLikedBlogs,
	likeNews,
	unlikeNews,
	setLikedNews,
	clearLikes,
} = likesSlice.actions;

export default likesSlice.reducer;
