import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrders, getMenus, getItems, deleteMenu } from "../../https";
import ItemCard from "./ItemCard";
import CategoryCard from "./CategoryCard";
import { enqueueSnackbar } from "notistack";

const Metrics = () => {
  
  const queryClient = useQueryClient();

  // deleteCategoryMutation is now handled inside CategoryCard

  const [timeFilter, setTimeFilter] = useState("All Time");

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

  // ===== FILTERING LOGIC =====
  const filterOrdersByTime = (ordersToFilter, filter) => {
    if (filter === "All Time") return ordersToFilter;

    const now = new Date();
    
    return ordersToFilter.filter((order) => {
      const orderDate = new Date(order.createdAt);
      if (isNaN(orderDate)) return true; // fallback if date is invalid or missing

      if (filter === "Today") {
        return (
          orderDate.getDate() === now.getDate() &&
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );
      }

      if (filter === "This Week") {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        return orderDate >= oneWeekAgo;
      }

      if (filter === "This Month") {
        return (
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );
      }

      return true;
    });
  };

  const filteredOrders = filterOrdersByTime(orders, timeFilter);

  // ===== 💰 TOTAL EARNINGS =====
  const totalEarnings = filteredOrders.reduce(
    (sum, order) => sum + (order?.bills?.totalWithTax || 0),
    0
  );

  // ===== 🔄 IN PROGRESS =====
  const inProgressCount = filteredOrders.filter(
    (o) => o.orderStatus === "In Progress"
  ).length;

  // ===== 📊 METRICS =====
  const totalCategories = menus.length;
  const totalDishes = items.length;

  return (
    <div className="container mx-auto py-2 px-6">

      {/* HEADER & FILTER */}
      <div className="flex justify-between items-center">
        <h2 className="text-white text-xl font-semibold">
          Overall Performance
        </h2>
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="bg-[#1a1a1a] text-white border border-[#333] p-2 rounded-lg outline-none cursor-pointer"
        >
          <option value="Today">Today</option>
          <option value="This Week">This Week</option>
          <option value="This Month">This Month</option>
          <option value="All Time">All Time</option>
        </select>
      </div>

      {/* METRICS */}
      <div className="mt-6 grid grid-cols-4 gap-4">

        <div className="bg-[#F6B100] p-4 rounded-xl shadow-lg">
          <p className="text-[#1f1f1f] text-sm font-semibold">Total Earnings</p>
          <p className="text-[#1f1f1f] text-3xl font-bold mt-1">
            ${totalEarnings.toLocaleString()}
          </p>
        </div>

        <div className="bg-[#F6B100] p-4 rounded-xl shadow-lg">
          <p className="text-[#1f1f1f] text-sm font-semibold">In Progress</p>
          <p className="text-[#1f1f1f] text-3xl font-bold mt-1">
            {inProgressCount}
          </p>
        </div>

        <div className="bg-[#F6B100] p-4 rounded-xl shadow-lg">
          <p className="text-[#1f1f1f] text-sm font-semibold">Categories</p>
          <p className="text-[#1f1f1f] text-3xl font-bold mt-1">
            {totalCategories}
          </p>
        </div>

        <div className="bg-[#F6B100] p-4 rounded-xl shadow-lg">
          <p className="text-[#1f1f1f] text-sm font-semibold">Dishes</p>
          <p className="text-[#1f1f1f] text-3xl font-bold mt-1">
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

              <CategoryCard menu={menu} />

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