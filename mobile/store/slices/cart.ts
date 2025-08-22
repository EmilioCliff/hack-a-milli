import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
	id: number;
	title: string;
	price: number;
	quantity: number;
	size: string;
	color: string;
	imageUrl: string;
}

interface CartState {
	items: CartItem[];
}

const initialState: CartState = {
	items: [] as CartItem[],
};

const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		addToCart(state, action: PayloadAction<CartItem>) {
			// Check if same product with same size & color already exists
			const existing = state.items.find(
				(item) =>
					item.id === action.payload.id &&
					item.size === action.payload.size &&
					item.color === action.payload.color,
			);

			if (existing) {
				existing.quantity += action.payload.quantity;
			} else {
				state.items.push(action.payload);
			}
		},
		increaseQuantity(
			state,
			action: PayloadAction<{ id: number; size: string; color: string }>,
		) {
			const item = state.items.find(
				(i) =>
					i.id === action.payload.id &&
					i.size === action.payload.size &&
					i.color === action.payload.color,
			);
			if (item) item.quantity += 1;
		},
		decreaseQuantity(
			state,
			action: PayloadAction<{ id: number; size: string; color: string }>,
		) {
			const item = state.items.find(
				(i) =>
					i.id === action.payload.id &&
					i.size === action.payload.size &&
					i.color === action.payload.color,
			);
			if (item && item.quantity > 1) {
				item.quantity -= 1;
			} else if (item) {
				// remove if qty goes to 0
				state.items = state.items.filter(
					(i) =>
						!(
							i.id === item.id &&
							i.size === item.size &&
							i.color === item.color
						),
				);
			}
		},
		removeFromCart(
			state,
			action: PayloadAction<{ id: number; size: string; color: string }>,
		) {
			state.items = state.items.filter(
				(item) =>
					!(
						item.id === action.payload.id &&
						item.size === action.payload.size &&
						item.color === action.payload.color
					),
			);
		},
		clearCart(state) {
			state.items = [];
		},
	},
});

export const {
	addToCart,
	increaseQuantity,
	decreaseQuantity,
	removeFromCart,
	clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
