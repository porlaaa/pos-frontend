import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    addItems: (state, action) => {
      const item = action.payload;
      const existing = state.find(i => i.itemId === item.itemId);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        state.push({
          itemId: item.itemId,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        });
      }
    },
    // เพิ่มสำหรับอัปเดตรายการอาหารทั้งหมดจาก Database
    setItems: (state, action) => {
      return action.payload; 
    },
    removeItem: (state, action) =>
      state.filter(i => i.itemId !== action.payload),
    removeAllItems: () => [],
    updateNote: (state, action) => {
      const { itemId, note } = action.payload;
      const existing = state.find(i => i.itemId === itemId);
      if (existing) {
        existing.note = note;
      }
    }
  }
});

export const getTotalPrice = (state) =>
  state.cart.reduce((t, i) => t + i.price * i.quantity, 0);

export const { addItems, removeItem, removeAllItems, setItems, updateNote } = cartSlice.actions;
export default cartSlice.reducer;