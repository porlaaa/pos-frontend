import React, { useEffect } from "react";
import Greetings from "../components/home/Greetings";
import { BsCashCoin } from "react-icons/bs";
import { GrInProgress } from "react-icons/gr";
import MiniCard from "../components/home/MiniCard";
import RecentOrders from "../components/home/RecentOrders";
import PopularDishes from "../components/home/PopularDishes";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../https";

const Home = () => {

  useEffect(() => {
    document.title = "POS | Home";
  }, []);

  // 🔥 ดึง orders จาก backend
  const { data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  const orders = data?.data?.data || [];

  // 🔥 คำนวณจริง
  const totalEarnings = orders.reduce(
    (sum, order) => sum + (order?.bills?.totalWithTax || 0),
    0
  );

  const inProgressCount = orders.filter(
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

        <div className="flex flex-col sm:flex-row items-center w-full gap-3 px-8 mt-8">

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