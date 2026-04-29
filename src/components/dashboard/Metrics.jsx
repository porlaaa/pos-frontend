import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getOrders, getMenus, getItems } from "../../https";
import ItemCard from "./ItemCard";

const Metrics = () => {

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
            ₹{totalEarnings.toLocaleString()}
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
            <div key={menu._id} className="mb-8">

              <h3 className="text-yellow-400 text-lg mb-3">
                {menu.name}
              </h3>

              <div className="grid grid-cols-4 gap-4">

                {categoryItems.length === 0 && (
                  <p className="text-gray-400">No items</p>
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