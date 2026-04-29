import React, { useState, useEffect } from "react";
import { enqueueSnackbar } from "notistack";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getTables } from "../https";
import TableCard from "../components/tables/TableCard";
import BottomNav from "../components/shared/BottomNav";
import BackButton from "../components/shared/BackButton";
const Tables = () => {
  const [status, setStatus] = useState("all");

  useEffect(() => {
    document.title = "POS | Tables";
  }, []);

  const { data: resData, isError, isLoading } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => await getTables(),
    placeholderData: keepPreviousData,
  });

  if (isError) {
    enqueueSnackbar("Something went wrong!", { variant: "error" });
  }

  if (isLoading) {
    return <div className="text-white p-10">Loading...</div>;
  }

  const tables = resData?.data?.data || [];

  const filteredTables = tables.filter((table) => {
    if (status === "booked") return table.status === "Booked";
    return true;
  });

  return (
    <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-y-auto overflow-x-hidden flex flex-col pb-24 lg:pb-0">

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 sm:px-10 py-4 gap-4 sm:gap-0">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wider">
            Tables
          </h1>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setStatus("all")}
            className={`px-5 py-2 rounded-lg font-semibold ${status === "all"
                ? "bg-[#383838] text-white"
                : "text-[#ababab]"
              }`}
          >
            All
          </button>

          <button
            onClick={() => setStatus("booked")}
            className={`px-5 py-2 rounded-lg font-semibold ${status === "booked"
                ? "bg-[#383838] text-white"
                : "text-[#ababab]"
              }`}
          >
            Booked
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-6 sm:px-16 py-4 flex-1 pb-4 overflow-y-auto scrollbar-hide">
        {filteredTables.map((table) => (
          <TableCard
            key={table._id}
            id={table._id}
            name={table.tableNo}
            status={table.status}
            initials={table?.currentOrder?.customerDetails?.name}
            seats={table.seats}
          />
        ))}
      </div>

      <BottomNav />
    </section>
  );
};
export default Tables;