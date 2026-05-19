const express = require("express");
const router = express.Router();

const {
  createMenu,
  getMenus,
  deleteMenu,
} = require("../controllers/menuController");

// Menu
router.post("/", createMenu);
router.get("/", getMenus);
router.delete("/:menuId", deleteMenu);

module.exports = router;