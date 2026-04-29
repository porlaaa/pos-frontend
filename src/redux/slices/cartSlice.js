import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    addItems: (state, action) => {
      const item = action.payload;
      const existing = state.find(i => i.itemId === item.itemId);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.push({
          itemId: item.itemId,
          name: item.name,
          price: item.price,
          quantity: 1
        });
      }
    },
    // ✅ เพิ่มสำหรับอัปเดตรายการอาหารทั้งหมดจาก Database
    setItems: (state, action) => {
      return action.payload; 
    },
    removeItem: (state, action) =>
      state.filter(i => i.itemId !== action.payload),
    removeAllItems: () => []
  }
});

export const getTotalPrice = (state) =>
  state.cart.reduce((t, i) => t + i.price * i.quantity, 0);

export const { addItems, removeItem, removeAllItems, setItems } = cartSlice.actions;
export default cartSlice.reducer;