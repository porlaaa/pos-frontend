import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getItems, getOrders } from "../../https";

const PopularDishes = () => {

  const { data: itemRes } = useQuery({
    queryKey: ["items"],
    queryFn: getItems,
  });

  const { data: orderRes } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  const items = itemRes?.data?.data || [];
  const orders = orderRes?.data?.data || [];

  // 🔥 count orders per item
  const itemCountMap = {};

  orders.forEach(order => {
    order.items?.forEach(i => {
      // Fallback to name matching for older orders that don't have itemId
      const targetId = i.itemId || items.find(dish => dish.name === i.name)?._id;

      if (targetId) {
        if (!itemCountMap[targetId]) {
          itemCountMap[targetId] = 0;
        }
        itemCountMap[targetId] += i.quantity;
      }
    });
  });

  // 🔥 merge + sort
  const popular = items
    .map(item => ({
      ...item,
      orders: itemCountMap[item._id] || 0
    }))
    .sort((a, b) => b.orders - a.orders)
    .slice(0, 7);

  return (
    <div className="mt-6 px-6 lg:px-0 lg:pr-6">
      <div className="bg-[#1a1a1a] w-full rounded-lg h-[400px] lg:h-[680px] flex flex-col">

        <div className="flex justify-between items-center px-6 py-4">
          <h1 className="text-[#f5f5f5] text-lg font-semibold">
            Popular Dishes
          </h1>
        </div>

        <div className="overflow-y-scroll flex-1 pb-4 scrollbar-hide">

          {popular.map((dish, index) => (
            <div
              key={dish._id}
              className="flex items-center gap-4 bg-[#1f1f1f] rounded-[15px] px-6 py-4 mt-4 mx-6"
            >

              <h1 className="text-white font-bold text-xl">
                {index + 1 < 10 ? `0${index + 1}` : index + 1}
              </h1>

              <div>
                <h1 className="text-white font-semibold">
                  {dish.name}
                </h1>

                <p className="text-gray-400 text-sm">
                  Orders: {dish.orders}
                </p>
              </div>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default PopularDishes;