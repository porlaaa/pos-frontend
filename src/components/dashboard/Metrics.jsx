import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrders, getMenus, getItems, deleteMenu } from "../../https";
import ItemCard from "./ItemCard";
import { enqueueSnackbar } from "notistack";
import { FaTrash } from "react-icons/fa";

const Metrics = () => {
  
  const queryClient = useQueryClient();

  const deleteCategoryMutation = useMutation({
    mutationFn: (id) => deleteMenu(id),
    onSuccess: () => {
      enqueueSnackbar("Category deleted successfully", { variant: "success" });
      queryClient.invalidateQueries(["menus"]);
    },
    onError: () => {
      enqueueSnackbar("Failed to delete category", { variant: "error" });
    }
  });

  const handleDeleteCategory = (id) => {
    if (window.confirm("Delete this category?")) {
      deleteCategoryMutation.mutate(id);
    }
  };

  // ===== ORDERS =====
  const { data: orderRes, isLoading: orderLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  // ===== MENUS =====
  const { data: menuRes, isLoading: menuLoading } = useQuery({
    queryKey: ["menus"],
    queryFn: getMenus,
  });

  // ===== ITEMS =====
  const { data: itemRes, isLoading: itemLoading } = useQuery({
    queryKey: ["items"],
    queryFn: getItems,
  });

  const orders = orderRes?.data?.data || [];
  const menus = menuRes?.data?.data || [];
  const items = itemRes?.data?.data || [];

  // ===== LOADING =====
  if (orderLoading || menuLoading || itemLoading) {
    return <p className="text-white p-5">Loading...</p>;
  }

  // ===== 💰 TOTAL EARNINGS =====
  const totalEarnings = orders.reduce(
    (sum, order) => sum + (order?.bills?.totalWithTax || 0),
    0
  );

  // ===== 🔄 IN PROGRESS =====
  const inProgressCount = orders.filter(
    (o) => o.orderStatus === "In Progress"
  ).length;

  // ===== 📊 METRICS =====
  const totalCategories = menus.length;
  const totalDishes = items.length;

  return (
    <div className="container mx-auto py-2 px-6">

      {/* HEADER */}
      <h2 className="text-white text-xl font-semibold">
        Overall Performance
      </h2>

      {/* METRICS */}
      <div className="mt-6 grid grid-cols-4 gap-4">

        <div className="bg-green-600 p-4 rounded">
          <p className="text-white text-sm">Total Earnings</p>
          <p className="text-white text-2xl font-bold">
            ${totalEarnings.toLocaleString()}
          </p>
        </div>

        <div className="bg-yellow-500 p-4 rounded">
          <p className="text-white text-sm">In Progress</p>
          <p className="text-white text-2xl font-bold">
            {inProgressCount}
          </p>
        </div>

        <div className="bg-blue-500 p-4 rounded">
          <p className="text-white text-sm">Categories</p>
          <p className="text-white text-2xl font-bold">
            {totalCategories}
          </p>
        </div>

        <div className="bg-purple-500 p-4 rounded">
          <p className="text-white text-sm">Dishes</p>
          <p className="text-white text-2xl font-bold">
            {totalDishes}
          </p>
        </div>

      </div>

      {/* MENU + ITEMS */}
      <div className="mt-12">
        <h2 className="text-white text-xl mb-4">
          Menu Items (Manage)
        </h2>

        {menus.map((menu) => {

          // ✅ FIX: convert to string กันพลาด ObjectId
          const categoryItems = items.filter(
            (item) => String(item.category) === String(menu._id)
          );

          return (
            <div key={menu._id} className="mb-8 bg-[#1a1a1a] p-6 rounded-xl border border-[#2a2a2a] shadow-sm">

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl shadow-lg" style={{ backgroundColor: menu.bgColor || "#f6b100" }}>
                    {menu.icon}
                  </div>
                  <h3 className="text-white text-xl font-bold tracking-wide">
                    {menu.name}
                  </h3>
                </div>

                <button
                  onClick={() => handleDeleteCategory(menu._id)}
                  className="text-gray-500 hover:text-red-500 hover:bg-red-500/10 p-3 rounded-lg transition-colors duration-200"
                  title="Delete Category"
                >
                  <FaTrash size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

                {categoryItems.length === 0 && (
                  <p className="text-gray-400 italic">No items available in this category.</p>
                )}

                {categoryItems.map((item) => (
                  <ItemCard
                    key={item._id}
                    item={item}
                    menuId={menu._id}
                  />
                ))}

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default Metrics;