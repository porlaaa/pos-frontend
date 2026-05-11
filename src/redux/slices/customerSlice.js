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

      const { name, phone, guests } = action.payload;

      state.customerName = name;

      state.customerPhone = phone;

      state.guests = guests;
    },

    removeCustomer: (state) => {

      state.orderId = "";

      state.customerName = "";

      state.customerPhone = "";

      state.guests = 0;

      state.table = "";
    },

    updateTable: (state, action) => {

      state.table = action.payload.table;

      if (action.payload.orderId) {
        state.orderId = action.payload.orderId;
      }

      if (action.payload.customerName) {
        state.customerName =
          action.payload.customerName;
      }
    },
  },
});

export const {
  setCustomer,
  removeCustomer,
  updateTable,
} = customerSlice.actions;

export default customerSlice.reducer;