import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrders, getMenus, getItems, deleteMenu } from "../../https";
import { FaMoneyBillWave, FaClipboardList, FaCheckCircle } from "react-icons/fa";
import CategoryCard from "./CategoryCard";
import ItemCard from "./ItemCard";
import { filterOrdersByTime } from "../../utils";

const Metrics = () => {

  const [timeFilter, setTimeFilter] = useState("All Time");

  // ===== ORDERS =====
  const {
    data: orderRes,
    isLoading: orderLoading,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  // ===== MENUS =====
  const {
    data: menuRes,
    isLoading: menuLoading,
  } = useQuery({
    queryKey: ["menus"],
    queryFn: getMenus,
  });

  // ===== ITEMS =====
  const {
    data: itemRes,
    isLoading: itemLoading,
  } = useQuery({
    queryKey: ["items"],
    queryFn: getItems,
  });

  const orders =
    orderRes?.data?.data || [];

  const menus =
    menuRes?.data?.data || [];

  const items =
    itemRes?.data?.data || [];

  // ===== LOADING =====
  if (
    orderLoading ||
    menuLoading ||
    itemLoading
  ) {

    return (
      <p className="text-white p-5">
        Loading...
      </p>
    );
  }

  const filteredOrders = filterOrdersByTime(orders, timeFilter);

  // ===== 💰 TOTAL REVENUE =====
  const totalRevenue =
    filteredOrders.reduce(
      (sum, order) =>
        sum +
        (order?.bills?.totalWithTax || 0),
      0
    );

  // ===== 🔄 ACTIVE ORDERS =====
  const activeOrders =
    filteredOrders.filter(
      (o) =>
        o.orderStatus ===
          "In Progress" ||
        o.orderStatus === "Ready"
    ).length;

  // ===== ✅ COMPLETED =====
  const completedOrders =
    orders.filter(
      (o) =>
        o.orderStatus ===
        "Completed"
    ).length;

  // ===== 📊 OTHER =====
  const totalCategories =
    menus.length;

  const totalDishes =
    items.length;

  return (
    <div className="container mx-auto py-2 px-6">

      {/* HEADER & FILTER */}
      <div className="flex justify-between items-center">
        <h2 className="text-white text-2xl font-bold">
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

      {/* STATS */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

        {/* Revenue */}
        <div className="bg-[#262626] p-6 rounded-2xl border border-[#333]">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-400">
                Total Revenue
              </p>

              <h1 className="text-4xl font-bold mt-2">
                $
                {totalRevenue.toLocaleString()}
              </h1>

            </div>

            <div className="bg-green-500 p-4 rounded-xl text-2xl">
              <FaMoneyBillWave />
            </div>

          </div>

        </div>

        {/* Active Orders */}
        <div className="bg-[#262626] p-6 rounded-2xl border border-[#333]">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-400">
                Active Orders
              </p>

              <h1 className="text-4xl font-bold mt-2">
                {activeOrders}
              </h1>

            </div>

            <div className="bg-yellow-500 p-4 rounded-xl text-2xl">
              <FaClipboardList />
            </div>

          </div>

        </div>

        {/* Completed */}
        <div className="bg-[#262626] p-6 rounded-2xl border border-[#333]">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-400">
                Completed
              </p>

              <h1 className="text-4xl font-bold mt-2">
                {completedOrders}
              </h1>

            </div>

            <div className="bg-blue-500 p-4 rounded-xl text-2xl">
              <FaCheckCircle />
            </div>

          </div>

        </div>

      </div>

      {/* EXTRA STATS */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">

        <div className="bg-[#262626] p-6 rounded-2xl border border-[#333]">

          <p className="text-gray-400">
            Categories
          </p>

          <h1 className="text-4xl font-bold mt-2">
            {totalCategories}
          </h1>

        </div>

        <div className="bg-[#262626] p-6 rounded-2xl border border-[#333]">

          <p className="text-gray-400">
            Dishes
          </p>

          <h1 className="text-4xl font-bold mt-2">
            {totalDishes}
          </h1>

        </div>

      </div>

      {/* MENU + ITEMS */}
      <div className="mt-12">

        <h2 className="text-white text-2xl font-bold mb-6">
          Menu Items
        </h2>

        {menus.map((menu) => {

          const categoryItems =
            items.filter(
              (item) =>
                String(
                  item.category
                ) ===
                String(menu._id)
            );

          return (
            <div
              key={menu._id}
              className="mb-8 bg-[#1a1a1a] p-6 rounded-2xl border border-[#2a2a2a]"
            >

              <CategoryCard
                menu={menu}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-5">

                {categoryItems.length ===
                  0 && (
                  <p className="text-gray-400 italic">
                    No items available
                    in this category.
                  </p>
                )}

                {categoryItems.map(
                  (item) => (

                    <ItemCard
                      key={item._id}
                      item={item}
                      menuId={
                        menu._id
                      }
                    />

                  )
                )}

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
};

export default Metrics;