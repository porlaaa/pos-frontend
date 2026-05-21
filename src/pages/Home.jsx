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

  const [timeFilter, setTimeFilter] =
    useState("All Time");

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
      timeFilter
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

  // ===== TODAY =====
  if (timeFilter === "Today") {

    const yesterday =
      new Date();

    yesterday.setDate(
      yesterday.getDate() - 1
    );

    previousOrders =
      orders.filter((order) => {

        const orderDate =
          new Date(
            order.createdAt
          );

        return (
          orderDate.toDateString() ===
          yesterday.toDateString()
        );
      });
  }

  // ===== THIS WEEK =====
  else if (
    timeFilter ===
    "This Week"
  ) {

    const currentWeekStart =
      new Date();

    currentWeekStart.setDate(
      now.getDate() -
      now.getDay()
    );

    const previousWeekStart =
      new Date(
        currentWeekStart
      );

    previousWeekStart.setDate(
      previousWeekStart.getDate() -
      7
    );

    const previousWeekEnd =
      new Date(
        currentWeekStart
      );

    previousWeekEnd.setDate(
      previousWeekEnd.getDate() -
      1
    );

    previousOrders =
      orders.filter((order) => {

        const orderDate =
          new Date(
            order.createdAt
          );

        return (
          orderDate >=
          previousWeekStart &&
          orderDate <=
          previousWeekEnd
        );
      });
  }

  // ===== THIS MONTH =====
  else if (
    timeFilter ===
    "This Month"
  ) {

    const previousMonth =
      new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );

    const previousMonthEnd =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        0
      );

    previousOrders =
      orders.filter((order) => {

        const orderDate =
          new Date(
            order.createdAt
          );

        return (
          orderDate >=
          previousMonth &&
          orderDate <=
          previousMonthEnd
        );
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

  // ===== LABEL =====
  let compareLabel =
    "than yesterday";

  if (
    timeFilter ===
    "This Week"
  ) {

    compareLabel =
      "than last week";
  }

  if (
    timeFilter ===
    "This Month"
  ) {

    compareLabel =
      "than last month";
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
        <div className="flex justify-end px-8 mt-6">

          <select
            value={timeFilter}
            onChange={(e) =>
              setTimeFilter(
                e.target.value
              )
            }
            className="bg-[#1a1a1a] text-white border border-[#333] px-3 py-1.5 rounded-lg outline-none cursor-pointer text-sm"
          >

            <option value="Today">
              Today
            </option>

            <option value="This Week">
              This Week
            </option>

            <option value="This Month">
              This Month
            </option>

            <option value="All Time">
              All Time
            </option>

          </select>

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