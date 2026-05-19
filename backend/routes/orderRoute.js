const express = require("express");
const router = express.Router();

const {
  addOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  addItemToOrder,
  getOrderByTableId,
} = require("../controllers/orderController");

const { isVerifiedUser } = require("../middlewares/tokenVerification");

// ===== ORDER (การจัดการบิลและสถานะ) =====
router.post("/", isVerifiedUser, addOrder); // สร้างหรืออัปเดตออเดอร์
router.get("/", getOrders); // ดึงออเดอร์ทั้งหมด
router.get("/:id", isVerifiedUser, getOrderById); // ดึงออเดอร์ตาม ID
router.put("/:id", isVerifiedUser, updateOrderStatus); // อัปเดตสถานะ (เช่น Ready)
router.get("/table/:tableId", getOrderByTableId); // ✅ ดึงข้อมูลออเดอร์จาก ID โต๊ะ (แก้ปัญหา N/A)

// ===== ADD ITEM (เพิ่มรายการอาหารในบิลเดิม) =====
router.put("/:id/add-item", isVerifiedUser, addItemToOrder);

module.exports = router;