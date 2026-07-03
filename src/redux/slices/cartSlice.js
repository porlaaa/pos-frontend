import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: [],

  reducers: {
    addItems: (state, action) => {
      const item = action.payload;
      const quantity = Math.max(Number(item.quantity) || 1, 1);

      const existingItem = state.find(
        (cartItem) => cartItem.itemId === item.itemId && !cartItem.note
      );

      if (existingItem) {
        existingItem.quantity += quantity;
        return;
      }

      state.push({
        cartItemId:
          Date.now().toString() +
          Math.random().toString(36).slice(2),

        itemId: item.itemId,
        name: item.name,
        price: item.price,
        quantity,
        note: "",
      });
    },

    setItems: (state, action) => {
      return action.payload;
    },

    removeItem: (state, action) =>
      state.filter((i) => i.cartItemId !== action.payload),

    removeAllItems: () => [],

    updateNote: (state, action) => {
      const { cartItemId, note } = action.payload;
      const existing = state.find((i) => i.cartItemId === cartItemId);

      if (existing) {
        existing.note = note;
      }
    },
  },
});

export const getTotalPrice = (state) =>
  state.cart.reduce((t, i) => t + i.price * i.quantity, 0);

export const getTotalQuantity = (state) =>
  state.cart.reduce((t, i) => t + i.quantity, 0);

export const {
  addItems,
  removeItem,
  removeAllItems,
  setItems,
  updateNote,
} = cartSlice.actions;

export default cartSlice.reducer;
