import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderId: "",
  customerName: "",
  customerPhone: "",
  guests: 0,
  table: "",
};

const customerSlice = createSlice({
  name: "customer",

  initialState,

  reducers: {
    setCustomer: (state, action) => {
      const {
        name,
        phone,
        customerName,
        customerPhone,
        guests,
        table,
        orderId,
      } = action.payload;

      state.orderId = orderId ?? "";
      state.customerName = customerName ?? name ?? "";
      state.customerPhone = customerPhone ?? phone ?? "";
      state.guests = guests ?? 0;
      state.table = table ?? "";
    },

    removeCustomer: (state) => {

      state.orderId = "";

      state.customerName = "";

      state.customerPhone = "";

      state.guests = 0;

      state.table = "";
    },

    updateTable: (state, action) => {
      const {
        table,
        orderId,
        customerName,
        customerPhone,
        phone,
        guests,
      } = action.payload;

      if (table !== undefined) state.table = table;
      if (orderId !== undefined) state.orderId = orderId;
      if (customerName !== undefined) state.customerName = customerName;
      if (customerPhone !== undefined || phone !== undefined) {
        state.customerPhone = customerPhone ?? phone;
      }
      if (guests !== undefined) state.guests = guests;
    },
  },
});

export const {
  setCustomer,
  removeCustomer,
  updateTable,
} = customerSlice.actions;

export default customerSlice.reducer;
