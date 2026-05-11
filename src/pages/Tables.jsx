import React, { useState, useEffect } from "react";
import { enqueueSnackbar } from "notistack";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { getTables, addTable } from "../https";
import TableCard from "../components/tables/TableCard";
import BackButton from "../components/shared/BackButton";
import Modal from "../components/shared/Modal";

const Tables = () => {
  const [status, setStatus] = useState("all");
  const [isAddTableModalOpen, setIsAddTableModalOpen] = useState(false);
  const [tableData, setTableData] = useState({ tableNo: "", seats: "" });
  const queryClient = useQueryClient();

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

  const addTableMutation = useMutation({
    mutationFn: (reqData) => addTable(reqData),
    onSuccess: () => {
      enqueueSnackbar("Table added successfully!", { variant: "success" });
      setIsAddTableModalOpen(false);
      setTableData({ tableNo: "", seats: "" });
      queryClient.invalidateQueries(["tables"]);
    },
    onError: () => {
      enqueueSnackbar("Failed to add table!", { variant: "error" });
    },
  });

  const handleAddTable = (e) => {
    e.preventDefault();
    if (!tableData.tableNo || !tableData.seats) {
      enqueueSnackbar("Please fill all fields", { variant: "warning" });
      return;
    }
    addTableMutation.mutate({
      tableNo: Number(tableData.tableNo),
      seats: Number(tableData.seats),
    });
  };

  if (isLoading) {
    return <div className="text-white p-10">Loading...</div>;
  }

  const tables = resData?.data?.data || [];

  const filteredTables = tables.filter((table) => {
    if (status === "booked") return table.status === "Booked";
    return true;
  });

  return (
    <section className="bg-[#1f1f1f] h-full flex flex-col">

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 sm:px-10 py-4 gap-4 sm:gap-0">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wider">
            Tables
          </h1>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <button
            onClick={() => setIsAddTableModalOpen(true)}
            className="px-5 py-2 rounded-lg font-semibold bg-[#f6b100] text-[#1f1f1f] hover:bg-[#d69a00] transition-colors shadow-lg"
          >
            + Add Table
          </button>

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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-6 sm:px-16 py-4 flex-1 pb-4 overflow-y-auto scrollbar-hide content-start">
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

      <Modal isOpen={isAddTableModalOpen} onClose={() => setIsAddTableModalOpen(false)} title="Add New Table">
        <form onSubmit={handleAddTable} className="flex flex-col gap-4">
          <div>
            <label className="block text-[#ababab] mb-2 text-sm font-medium">Table Number</label>
            <input
              type="number"
              value={tableData.tableNo}
              onChange={(e) => setTableData({ ...tableData, tableNo: e.target.value })}
              className="w-full bg-[#2a2a2a] text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f6b100]"
              placeholder="Enter table number"
              required
            />
          </div>
          <div>
            <label className="block text-[#ababab] mb-2 text-sm font-medium">Number of Seats</label>
            <input
              type="number"
              value={tableData.seats}
              onChange={(e) => setTableData({ ...tableData, seats: e.target.value })}
              className="w-full bg-[#2a2a2a] text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f6b100]"
              placeholder="Enter number of seats"
              required
            />
          </div>
          <button
            type="submit"
            disabled={addTableMutation.isLoading}
            className="w-full bg-[#f6b100] hover:bg-[#d69a00] text-[#1f1f1f] font-bold py-3 rounded-lg mt-4 transition-colors disabled:opacity-50"
          >
            {addTableMutation.isLoading ? "Adding..." : "Add Table"}
          </button>
        </form>
      </Modal>

    </section>
  );
};
export default Tables;