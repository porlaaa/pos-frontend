import { axiosWrapper } from "./axiosWrapper";

// ===== AUTH =====
export const login = (data) => axiosWrapper.post("/api/user/login", data);
export const register = (data) => axiosWrapper.post("/api/user/register", data);
export const getUserData = () => axiosWrapper.get("/api/user");
export const logout = () => axiosWrapper.post("/api/user/logout");

// ===== TABLE =====
export const addTable = (data) => axiosWrapper.post("/api/table/", data);
export const getTables = () => axiosWrapper.get("/api/table");

// ✅ แก้ไข: ป้องกันปัญหา tableId หลุดไปเป็น Object [object Object]
export const updateTable = ({ tableId, ...tableData }) => {
  const id = typeof tableId === 'object' ? tableId._id : tableId;
  return axiosWrapper.put(`/api/table/${id}`, tableData);
};

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

// ✅ แก้ไข: ป้องกันปัญหา orderId เป็น Object และรองรับการ Update สถานะ
export const updateOrderStatus = ({ orderId, orderStatus }) => {
  const id = typeof orderId === 'object' ? orderId._id : orderId;
  return axiosWrapper.put(`/api/order/${id}`, { orderStatus });
};

// ✅ เพิ่มใหม่: สำหรับดึง Order จาก Table ID (ใช้แก้ปัญหา N/A ในหน้าโต๊ะ)
export const getOrderByTableId = (tableId) => {
  const id = typeof tableId === 'object' ? tableId._id : tableId;
  return axiosWrapper.get(`/api/order/table/${id}`);
};

// ✅ เพิ่มใหม่: สำหรับเพิ่ม Item เข้าใน Order เดิม (ถ้าต้องการใช้ในหน้าจัดการ Order)
export const addItemToOrder = (orderId, data) => {
  const id = typeof orderId === 'object' ? orderId._id : orderId;
  return axiosWrapper.put(`/api/order/${id}/add-item`, data);
};