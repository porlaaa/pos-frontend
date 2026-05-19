const Order = require("../models/orderModel");
const Table = require("../models/tableModel");
const Item = require("../models/itemModel");

// =====================================================
// 🔥 Helper: คำนวณราคารวมและภาษี
// =====================================================
const calculateBills = (items) => {
  const total = items.reduce((sum, i) => sum + i.total, 0);

  const tax = total * 0.0525;

  return {
    total,
    tax,
    totalWithTax: total + tax,
  };
};

// =====================================================
// 🔥 Helper: ล้างข้อมูล Item ก่อนส่งกลับ
// =====================================================
const sanitizeItems = (items) =>
  items.map((i) => ({
    name: i.name,
    price: i.price,
    quantity: i.quantity,
    total: i.total,
  }));

// =====================================================
// 🔍 1. ดึง Order ตาม Table ID
// =====================================================
const getOrderByTableId = async (req, res, next) => {
  try {
    const { tableId } = req.params;

    const order = await Order.findOne({
      table: tableId,
      orderStatus: { $in: ["pending", "In Progress"] },
    }).populate("table");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "No active order for this table",
      });
    }

    res.json({
      success: true,
      data: {
        ...order.toObject(),
        items: sanitizeItems(order.items),
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// =====================================================
// 🆕 2. สร้าง Order ใหม่
// =====================================================
const addOrder = async (req, res, next) => {
  try {
    const {
      items = [],
      customerDetails,
      table,
      paymentMethod,
    } = req.body;

    console.log("CREATE ORDER BODY:", req.body);

    // ✅ รองรับทั้ง object และ string
    const tableId =
      typeof table === "object" ? table?._id : table;

    // 🔥 format items
    const formattedItems = [];

    for (const i of items) {

      const item = await Item.findById(i._id);

      if (!item) continue;

      formattedItems.push({
        name: item.name,
        price: item.price,
        quantity: i.quantity,
        total: item.price * i.quantity,
      });
    }

    // ✅ create order
    const newOrder = await Order.create({
      items: formattedItems,

      bills: calculateBills(formattedItems),

      customerDetails,

      table: tableId,

      paymentMethod,

      orderStatus: "In Progress",
    });

    // ✅ update table
    await Table.findByIdAndUpdate(tableId, {
      status: "booked",
      currentOrder: newOrder._id,
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: newOrder,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =====================================================
// 📄 3. ดึง Orders ทั้งหมด
// =====================================================
const getOrders = async (req, res, next) => {
  try {

    const orders = await Order.find()
      .populate("table")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders,
    });

  } catch (err) {

    console.log(err);

    next(err);
  }
};

// =====================================================
// 🔍 4. ดึง Order รายบิล
// =====================================================
const getOrderById = async (req, res, next) => {
  try {

    const order = await Order.findById(req.params.id)
      .populate("table");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      data: order,
    });

  } catch (err) {

    console.log(err);

    next(err);
  }
};

// =====================================================
// ➕ 5. เพิ่ม Item เข้า Order เดิม
// =====================================================
const addItemToOrder = async (req, res, next) => {
  try {

    console.log("ADD ITEM BODY:", req.body);

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ✅ กัน undefined
    const items = req.body.items || [];

    for (const i of items) {

      // ✅ ใช้ _id จาก frontend
      const item = await Item.findById(i._id);

      if (!item) continue;

      // ✅ เช็ค item ซ้ำ
      const existing = order.items.find(
        (x) => x.name === item.name
      );

      if (existing) {

        existing.quantity += i.quantity;

        existing.total =
          existing.quantity * existing.price;

      } else {

        order.items.push({
          name: item.name,
          price: item.price,
          quantity: i.quantity,
          total: item.price * i.quantity,
        });
      }
    }

    // ✅ update bills ใหม่
    order.bills = calculateBills(order.items);

    // ✅ status
    order.orderStatus = "In Progress";

    await order.save();

    res.status(200).json({
      success: true,
      message: "Items added successfully",
      data: order,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =====================================================
// ✅ 6. อัปเดตสถานะ Order
// =====================================================
const updateOrderStatus = async (req, res, next) => {
  try {

    const { orderStatus } = req.body;

    const { id } = req.params;

    const order = await Order.findByIdAndUpdate(
      id,
      { orderStatus },
      { returnDocument: "after" }
    ).populate("table");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ✅ update table status
    if (orderStatus === "Completed") {

      await Table.findByIdAndUpdate(order.table._id, {
        status: "available",
        currentOrder: null,
      });

    } else if (
      orderStatus === "In Progress" ||
      orderStatus === "Ready" ||
      orderStatus === "pending"
    ) {

      await Table.findByIdAndUpdate(order.table._id, {
        status: "booked",
        currentOrder: order._id,
      });
    }

    res.json({
      success: true,
      message: `Status updated to ${orderStatus}`,
      data: order,
    });

  } catch (err) {

    console.log(err);

    next(err);
  }
};

module.exports = {
  addOrder,
  getOrders,
  getOrderById,
  getOrderByTableId,
  addItemToOrder,
  updateOrderStatus,
};