import React, { useEffect, useState } from "react";
import Greetings from "../components/home/Greetings";
import { BsCashCoin } from "react-icons/bs";
import { GrInProgress } from "react-icons/gr";
import MiniCard from "../components/home/MiniCard";
import RecentOrders from "../components/home/RecentOrders";
import PopularDishes from "../components/home/PopularDishes";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../https";
import { filterOrdersByTime } from "../utils";

const Home = () => {

  const [timeFilter, setTimeFilter] = useState("All Time");

  useEffect(() => {
    document.title = "POS | Home";
  }, []);

  // 🔥 ดึง orders จาก backend
  const { data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  const orders = data?.data?.data || [];

  const filteredOrders = filterOrdersByTime(orders, timeFilter);

  // 🔥 คำนวณจริง
  const totalEarnings = filteredOrders.reduce(
    (sum, order) => sum + (order?.bills?.totalWithTax || 0),
    0
  );

  const inProgressCount = filteredOrders.filter(
    (order) => order.orderStatus === "In Progress"
  ).length;

  if (isLoading) {
    return <div className="text-white p-10">Loading...</div>;
  }

  return (
    <section className="bg-[#1f1f1f] flex flex-col lg:flex-row gap-3 p-6 h-full">

      {/* Left */}
      <div className="flex-[3]">
        <Greetings />

        <div className="flex justify-end px-8 mt-6">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="bg-[#1a1a1a] text-white border border-[#333] px-3 py-1.5 rounded-lg outline-none cursor-pointer text-sm"
          >
            <option value="Today">Today</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
            <option value="All Time">All Time</option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row items-center w-full gap-3 px-8 mt-3">

          <MiniCard
            title="Total Earnings"
            icon={<BsCashCoin />}
            number={totalEarnings.toLocaleString()}
            footerNum={0} // เอาไว้ทำ % ทีหลัง
          />

          <MiniCard
            title="In Progress"
            icon={<GrInProgress />}
            number={inProgressCount}
            footerNum={0}
          />

        </div>

        <RecentOrders />
      </div>

      {/* Right */}
      <div className="flex-[2]">
        <PopularDishes />
      </div>
    </section>
  );
};

export default Home;