import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ICartItem, IItem } from '../interfaces';


const MAX_UNIQUE_ITEMS = 10;
const MAX_TOTAL_QUANTITY = 50;

interface CartState {
  items: ICartItem[];
  error: string | null;
}

const initialState: CartState = {
  items: [],
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<{ item: IItem; quantity: number }>) {
      const { item, quantity } = action.payload;
      const existing = state.items.find((ci) => ci.item._id === item._id);

      const currentTotal = state.items.reduce((sum, ci) => sum + ci.quantity, 0);
      const newQty = (existing?.quantity ?? 0) + quantity;

      if (newQty > item.stock) {
        state.error = `לא ניתן להוסיף ${quantity} יחידות — נשאר רק ${item.stock} במלאי`;
        return;
      }
      
      if (currentTotal + quantity > MAX_TOTAL_QUANTITY) {
        state.error = `לא ניתן להזמין יותר מ-${MAX_TOTAL_QUANTITY} פריטים סה"כ`;
        return;
      }
     
      if (!existing && state.items.length >= MAX_UNIQUE_ITEMS) {
        state.error = `לא ניתן להוסיף יותר מ-${MAX_UNIQUE_ITEMS} פריטים שונים לעגלה`;
        return;
      }

      state.error = null;

      if (existing) {
        existing.quantity = newQty;
      } else {
        state.items.push({ item, quantity });
      }
    },

    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((ci) => ci.item._id !== action.payload);
      state.error = null;
    },

    updateQuantity(state, action: PayloadAction<{ itemId: string; quantity: number }>) {
      const { itemId, quantity } = action.payload;
      const cartItem = state.items.find((ci) => ci.item._id === itemId);
      if (!cartItem) return;

      if (quantity <= 0) {
        state.items = state.items.filter((ci) => ci.item._id !== itemId);
        return;
      }
      if (quantity > cartItem.item.stock) {
        state.error = `לא ניתן להוסיף יותר מ-${cartItem.item.stock} יחידות`;
        return;
      }

      const otherTotal = state.items
        .filter((ci) => ci.item._id !== itemId)
        .reduce((sum, ci) => sum + ci.quantity, 0);

      if (otherTotal + quantity > MAX_TOTAL_QUANTITY) {
        state.error = `לא ניתן להזמין יותר מ-${MAX_TOTAL_QUANTITY} פריטים סה"כ`;
        return;
      }

      state.error = null;
      cartItem.quantity = quantity;
    },

    clearCart(state) {
      state.items = [];
      state.error = null;
    },

    clearError(state) {
      state.error = null;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, clearError } =
  cartSlice.actions;

export default cartSlice.reducer;
