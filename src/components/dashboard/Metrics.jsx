import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrders, getMenus, getItems, deleteMenu } from "../../https";
import { FaMoneyBillWave, FaClipboardList, FaCheckCircle } from "react-icons/fa";
import CategoryCard from "./CategoryCard";
import ItemCard from "./ItemCard";
import { filterOrdersByTime } from "../../utils";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Metrics = () => {

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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

  const filteredOrders = filterOrdersByTime(orders, startDate, endDate);

  // ===== 💰 TOTAL REVENUE =====
  const totalRevenue =
    filteredOrders.reduce(
      (sum, order) =>
        sum +
        (order?.bills?.total || 0),
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
    filteredOrders.filter(
      (o) =>
        o.orderStatus ===
        "Completed"
    ).length;

  // ===== 📊 OTHER =====
  const totalCategories =
    menus.length;

  const totalDishes =
    items.length;

  // ===== 📈 CHART DATA =====
  const chartDataMap = {};

  filteredOrders.forEach((order) => {
    const orderDate = new Date(order.createdAt);
    const dateStr = orderDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const sortKey = orderDate.toISOString().split("T")[0]; // YYYY-MM-DD
    
    if (!chartDataMap[dateStr]) {
      chartDataMap[dateStr] = { date: dateStr, sortKey, revenue: 0, orders: 0 };
    }
    
    chartDataMap[dateStr].revenue += (order?.bills?.total || 0);
    chartDataMap[dateStr].orders += 1;
  });

  const chartData = Object.values(chartDataMap).sort((a, b) => a.sortKey.localeCompare(b.sortKey));

  return (
    <div className="container mx-auto py-2 px-6">

      {/* HEADER & FILTER */}
      <div className="flex justify-between items-center">
        <h2 className="text-white text-2xl font-bold">
          Overall Performance
        </h2>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-[#1a1a1a] text-white border border-[#333] px-3 py-1.5 rounded-lg outline-none cursor-pointer text-sm"
          />
          <span className="text-[#f5f5f5] text-sm">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-[#1a1a1a] text-white border border-[#333] px-3 py-1.5 rounded-lg outline-none cursor-pointer text-sm"
          />
        </div>
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
                {totalRevenue.toLocaleString()} ฿
              </h1>

            </div>

            <div className="text-green-500 text-4xl">
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

            <div className="text-yellow-500 text-4xl">
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

            <div className="text-blue-500 text-4xl">
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

      {/* REVENUE CHART */}
      <div className="mt-6 bg-[#262626] p-6 rounded-2xl border border-[#333]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-xl font-bold">Revenue & Orders Overview</h2>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#02ca3a]"></div>
              <span className="text-gray-300">Revenue (฿)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#f6b100]"></div>
              <span className="text-gray-300">Orders</span>
            </div>
          </div>
        </div>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#02ca3a" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#02ca3a" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f6b100" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f6b100" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#ababab" tick={{ fill: "#ababab" }} tickMargin={10} />
              <YAxis yAxisId="left" stroke="#ababab" tick={{ fill: "#ababab" }} tickFormatter={(value) => `${value} ฿`} />
              <YAxis yAxisId="right" orientation="right" stroke="#ababab" tick={{ fill: "#ababab" }} />
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1a1a1a", borderColor: "#333", borderRadius: "8px", color: "#fff" }}
                itemStyle={{ color: "#fff" }}
              />
              <Area yAxisId="left" type="monotone" dataKey="revenue" name="Revenue (฿)" stroke="#02ca3a" fillOpacity={1} fill="url(#colorRevenue)" />
              <Area yAxisId="right" type="monotone" dataKey="orders" name="Orders" stroke="#f6b100" fillOpacity={1} fill="url(#colorOrders)" />
            </AreaChart>
          </ResponsiveContainer>
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