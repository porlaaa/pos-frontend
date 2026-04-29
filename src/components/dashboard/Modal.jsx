import React, { useState } from "react";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addTable,
  createMenu,
  createItem, // ✅ ใช้ตัวใหม่
  getMenus,
} from "../../https";
import { enqueueSnackbar } from "notistack";

const Modal = ({ type, setModalType }) => {
  const queryClient = useQueryClient();

  // ===== TABLE =====
  const [tableData, setTableData] = useState({
    tableNo: "",
    seats: "",
  });

  // ===== CATEGORY =====
  const [categoryData, setCategoryData] = useState({
    name: "",
    icon: "",
    bgColor: "",
  });

  // ===== DISH =====
  const [dishData, setDishData] = useState({
    menuId: "",
    name: "",
    price: "",
  });

  // 🔥 โหลด categories
  const { data } = useQuery({
    queryKey: ["menus"],
    queryFn: getMenus,
  });

  const menus = data?.data?.data || [];

  // ================== MUTATIONS ==================

  // TABLE
  const tableMutation = useMutation({
    mutationFn: addTable,
    onSuccess: (res) => {
      enqueueSnackbar(res.data.message, { variant: "success" });
      setModalType(null);
      queryClient.invalidateQueries(["tables"]);
    },
  });

  // CATEGORY
  const categoryMutation = useMutation({
    mutationFn: createMenu,
    onSuccess: () => {
      enqueueSnackbar("Category created!", { variant: "success" });
      setModalType(null);
      queryClient.invalidateQueries(["menus"]);
    },
  });

  // DISH (🔥 FIX ใหม่)
  const dishMutation = useMutation({
    mutationFn: createItem,

    onSuccess: () => {
      enqueueSnackbar("Dish added!", { variant: "success" });
      setModalType(null);

      // 🔥 สำคัญ: refresh items
      queryClient.invalidateQueries(["items"]);
    },

    onError: () => {
      enqueueSnackbar("Add dish failed", { variant: "error" });
    },
  });

  // ================== HANDLERS ==================

  const handleCloseModal = () => setModalType(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    // TABLE
    if (type === "table") {
      tableMutation.mutate(tableData);
    }

    // CATEGORY
    if (type === "category") {
      categoryMutation.mutate(categoryData);
    }

    // DISH (🔥 FIX ใหม่)
    if (type === "dishes") {
      if (!dishData.menuId) {
        return enqueueSnackbar("Select category first", {
          variant: "warning",
        });
      }

      dishMutation.mutate({
        name: dishData.name,
        price: Number(dishData.price),
        category: dishData.menuId, // 🔥 สำคัญ
      });
    }
  };

  // ================== TITLE ==================
  const title =
    type === "table"
      ? "Add Table"
      : type === "category"
      ? "Add Category"
      : "Add Dish";

  // ================== UI ==================
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#262626] p-6 rounded-lg w-96"
      >
        {/* HEADER */}
        <div className="flex justify-between mb-4">
          <h2 className="text-white text-xl font-semibold">{title}</h2>
          <button onClick={handleCloseModal}>
            <IoMdClose size={24} className="text-white" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* ===== TABLE ===== */}
          {type === "table" && (
            <>
              <input
                type="number"
                placeholder="Table No"
                value={tableData.tableNo}
                onChange={(e) =>
                  setTableData({ ...tableData, tableNo: e.target.value })
                }
                className="w-full p-3 bg-[#1f1f1f] text-white rounded"
              />

              <input
                type="number"
                placeholder="Seats"
                value={tableData.seats}
                onChange={(e) =>
                  setTableData({ ...tableData, seats: e.target.value })
                }
                className="w-full p-3 bg-[#1f1f1f] text-white rounded"
              />
            </>
          )}

          {/* ===== CATEGORY ===== */}
          {type === "category" && (
            <>
              <input
                placeholder="Category Name"
                value={categoryData.name}
                onChange={(e) =>
                  setCategoryData({ ...categoryData, name: e.target.value })
                }
                className="w-full p-3 bg-[#1f1f1f] text-white rounded"
              />

              <input
                placeholder="Icon 🍕"
                value={categoryData.icon}
                onChange={(e) =>
                  setCategoryData({ ...categoryData, icon: e.target.value })
                }
                className="w-full p-3 bg-[#1f1f1f] text-white rounded"
              />

              <input
                placeholder="Color (#xxxxxx)"
                value={categoryData.bgColor}
                onChange={(e) =>
                  setCategoryData({ ...categoryData, bgColor: e.target.value })
                }
                className="w-full p-3 bg-[#1f1f1f] text-white rounded"
              />
            </>
          )}

          {/* ===== DISH ===== */}
          {type === "dishes" && (
            <>
              <select
                className="w-full p-3 bg-[#1f1f1f] text-white rounded"
                value={dishData.menuId}
                onChange={(e) =>
                  setDishData({ ...dishData, menuId: e.target.value })
                }
              >
                <option value="">Select Category</option>
                {menus.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name}
                  </option>
                ))}
              </select>

              <input
                placeholder="Dish Name"
                value={dishData.name}
                onChange={(e) =>
                  setDishData({ ...dishData, name: e.target.value })
                }
                className="w-full p-3 bg-[#1f1f1f] text-white rounded"
              />

              <input
                type="number"
                placeholder="Price"
                value={dishData.price}
                onChange={(e) =>
                  setDishData({ ...dishData, price: e.target.value })
                }
                className="w-full p-3 bg-[#1f1f1f] text-white rounded"
              />
            </>
          )}

          {/* BUTTON */}
          <button className="w-full bg-yellow-400 py-3 rounded font-bold">
            Submit
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Modal;