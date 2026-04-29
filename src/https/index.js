import { axiosWrapper } from "./axiosWrapper";

// ===== AUTH =====
export const login = (data) => axiosWrapper.post("/api/user/login", data);
export const register = (data) => axiosWrapper.post("/api/user/register", data);
export const getUserData = () => axiosWrapper.get("/api/user");
export const logout = () => axiosWrapper.post("/api/user/logout");

// ===== TABLE =====
export const addTable = (data) => axiosWrapper.post("/api/table/", data);
export const getTables = () => axiosWrapper.get("/api/table");
export const updateTable = ({ tableId, ...tableData }) =>
  axiosWrapper.put(`/api/table/${tableId}`, tableData);

// ===== MENU (CATEGORY) =====
export const getMenus = () => axiosWrapper.get("/api/menu");
export const createMenu = (data) => axiosWrapper.post("/api/menu", data);
export const deleteMenu = (menuId) =>
  axiosWrapper.delete(`/api/menu/${menuId}`);

// ===== ITEM (DISH) =====
export const getItems = () => axiosWrapper.get("/api/item");
export const createItem = (data) => axiosWrapper.post("/api/item", data);
export const deleteItem = (itemId) =>
  axiosWrapper.delete(`/api/item/${itemId}`);
export const updateItem = (itemId, data) =>
  axiosWrapper.put(`/api/item/${itemId}`, data);

// ===== PAYMENT =====
export const createOrderRazorpay = (data) =>
  axiosWrapper.post("/api/payment/create-order", data);

export const verifyPaymentRazorpay = (data) =>
  axiosWrapper.post("/api/payment/verify-payment", data);

// ===== ORDER =====
export const addOrder = (data) => axiosWrapper.post("/api/order/", data);
export const getOrders = () => axiosWrapper.get("/api/order");
export const updateOrderStatus = ({ orderId, orderStatus }) =>
  axiosWrapper.put(`/api/order/${orderId}`, { orderStatus });