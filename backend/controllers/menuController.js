const Menu = require("../models/menuModel");
const Item = require("../models/itemModel");

// CREATE
const createMenu = async (req, res, next) => {
  try {
    const menu = await Menu.create(req.body);
    res.status(201).json({ success: true, data: menu });
  } catch (err) {
    next(err);
  }
};

// GET
const getMenus = async (req, res, next) => {
  try {
    const menus = await Menu.find();
    res.json({ success: true, data: menus });
  } catch (err) {
    next(err);
  }
};

// DELETE
const deleteMenu = async (req, res, next) => {
  try {
    const { menuId } = req.params;

    await Menu.findByIdAndDelete(menuId);
    await Item.deleteMany({ category: menuId });

    res.json({ success: true, message: "Menu & items deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMenu,
  getMenus,
  deleteMenu,
};