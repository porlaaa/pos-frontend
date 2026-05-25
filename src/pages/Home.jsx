import React, {
  useEffect,
  useState,
} from "react";

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

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {

    document.title =
      "POS | Home";

  }, []);

  // ===== GET ORDERS =====
  const {
    data,
    isLoading,
  } = useQuery({
    queryKey: ["orders"],

    queryFn: getOrders,
  });

  const orders =
    data?.data?.data || [];

  // ===== FILTER ORDERS =====
  const filteredOrders =
    filterOrdersByTime(
      orders,
      startDate,
      endDate
    );

  // ===== CURRENT TOTAL =====
  const totalEarnings =
    filteredOrders.reduce(
      (sum, order) =>
        sum +
        (order?.bills?.total || 0),
      0
    );

  // ===== IN PROGRESS =====
  const inProgressCount =
    filteredOrders.filter(
      (order) =>
        order.orderStatus ===
        "In Progress"
    ).length;

  // ===== PREVIOUS PERIOD =====
  const now = new Date();

  let previousOrders = [];

  let compareLabel = "";
  if (startDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = endDate ? new Date(endDate) : new Date();
    end.setHours(23, 59, 59, 999);

    const durationMs = end - start;
    const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));

    const previousEnd = new Date(start);
    previousEnd.setDate(previousEnd.getDate() - 1);
    previousEnd.setHours(23, 59, 59, 999);

    const previousStart = new Date(previousEnd);
    previousStart.setDate(previousStart.getDate() - durationDays + 1);
    previousStart.setHours(0, 0, 0, 0);

    compareLabel = `than previous ${durationDays} day(s)`;

    previousOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= previousStart && orderDate <= previousEnd;
    });
  }

  // ===== PREVIOUS TOTAL =====
  const previousTotal =
    previousOrders.reduce(
      (sum, order) =>
        sum +
        (order?.bills?.total || 0),
      0
    );

  // ===== PERCENT =====
  let percentChange = 0;

  if (previousTotal > 0) {

    percentChange =
      (
        ((totalEarnings -
          previousTotal) /
          previousTotal) *
        100
      ).toFixed(1);
  }



  if (isLoading) {

    return (
      <div className="text-white p-10">
        Loading...
      </div>
    );
  }

  return (
    <section className="bg-[#1f1f1f] flex flex-col lg:flex-row gap-3 p-6 h-full">

      {/* LEFT */}
      <div className="flex-[3]">

        <Greetings />

        {/* FILTER */}
        <div className="flex justify-end items-center px-8 mt-6 gap-3">
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

        {/* CARDS */}
        <div className="flex flex-col sm:flex-row items-center w-full gap-3 px-8 mt-3">

          <MiniCard
            title="Total Earnings"
            icon={<BsCashCoin />}
            number={totalEarnings.toLocaleString()}
            footerNum={`${percentChange}% ${compareLabel}`}
          />

          <MiniCard
            title="In Progress"
            icon={<GrInProgress />}
            number={inProgressCount}
            footerNum={
              inProgressCount > 0
                ? `${inProgressCount} Orders Running`
                : "No Active Orders"
            }
          />

        </div>

        <RecentOrders />

      </div>

      {/* RIGHT */}
      <div className="flex-[2]">

        <PopularDishes />

      </div>

    </section>
  );
};

export default Home;