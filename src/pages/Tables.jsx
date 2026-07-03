import React, {
  useEffect,
  useState,
} from "react";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { enqueueSnackbar } from "notistack";

import {
  FaArrowLeft,
  FaPlus,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import TableCard from "../components/tables/TableCard";

import {
  getTables,
  addTable,
  deleteTable,
} from "../https";

const Tables = () => {

  const navigate = useNavigate();

  const queryClient =
    useQueryClient();

  useEffect(() => {

    document.title =
      "POS | Tables";

  }, []);

  // ===== FILTER =====
  const [status, setStatus] =
    useState("all");

  // ===== ADD MODAL =====
  const [showModal, setShowModal] =
    useState(false);

  // ===== DELETE MODAL =====
  const [deleteModal, setDeleteModal] =
    useState(false);

  const [selectedTable, setSelectedTable] =
    useState(null);

  // ===== FORM =====
  const [tableNo, setTableNo] =
    useState("");

  const [seats, setSeats] =
    useState(4);

  // ===== GET TABLES =====
  const {
    data: resData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tables"],

    queryFn: async () =>
      await getTables(),
  });

  // ===== ADD TABLE =====
  const addTableMutation =
    useMutation({
      mutationFn: (data) =>
        addTable(data),

      onSuccess: () => {

        enqueueSnackbar(
          "Table created successfully!",
          {
            variant: "success",
          }
        );

        queryClient.invalidateQueries({ queryKey: ["tables"] });

        setShowModal(false);

        setTableNo("");

        setSeats(4);
      },

      onError: (error) => {

        console.log(error);

        enqueueSnackbar(
          "Failed to create table!",
          {
            variant: "error",
          }
        );
      },
    });

  // ===== DELETE TABLE =====
  const deleteTableMutation =
    useMutation({
      mutationFn: deleteTable,

      onSuccess: () => {

        enqueueSnackbar(
          "Table deleted successfully!",
          {
            variant: "success",
          }
        );

        queryClient.invalidateQueries({ queryKey: ["tables"] });
      },

      onError: (error) => {

        console.log(error);

        enqueueSnackbar(
          "Failed to delete table!",
          {
            variant: "error",
          }
        );
      },
    });

  if (isError) {

    enqueueSnackbar(
      "Failed to fetch tables!",
      {
        variant: "error",
      }
    );
  }

  const tables =
    (resData?.data?.data || [])
      .sort(
        (a, b) =>
          a.tableNo -
          b.tableNo
      );

  // ===== FILTER =====
  const filteredTables =
    status === "all"
      ? tables
      : tables.filter(
          (table) =>
            table.status ===
            "Booked"
        );

  // ===== CREATE TABLE =====
  const handleAddTable = () => {

    if (!tableNo) {

      enqueueSnackbar(
        "Please enter table number",
        {
          variant: "warning",
        }
      );

      return;
    }

    addTableMutation.mutate({
      tableNo:
        Number(tableNo),

      seats:
        Number(seats),

      status: "Available",
    });
  };

  // ===== OPEN DELETE MODAL =====
  const handleDeleteTable = (
    table
  ) => {

    if (
      table.status === "Booked"
    ) {

      enqueueSnackbar(
        "Cannot delete booked table!",
        {
          variant: "warning",
        }
      );

      return;
    }

    setSelectedTable(table);

    setDeleteModal(true);
  };

  // ===== CONFIRM DELETE =====
  const confirmDeleteTable = () => {

    if (!selectedTable)
      return;

    deleteTableMutation.mutate(
      selectedTable._id
    );

    setDeleteModal(false);

    setSelectedTable(null);
  };

  if (isLoading) {

    return (
      <div className="text-white p-5">
        Loading...
      </div>
    );
  }

  return (
    <section className="bg-[#1f1f1f] min-h-screen p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">

        {/* LEFT */}
        <div className="flex items-center gap-4">

          <button
            onClick={() =>
              navigate(-1)
            }
            className="bg-[#025cca] hover:bg-blue-700 transition p-3 rounded-full text-white"
          >
            <FaArrowLeft />
          </button>

          <h1 className="text-4xl font-bold text-white">
            Tables
          </h1>

        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {/* FILTER */}
          <button
            onClick={() =>
              setStatus("all")
            }
            className={`px-5 py-2 rounded-lg font-semibold transition ${
              status === "all"
                ? "bg-[#333] text-white"
                : "bg-[#262626] text-gray-400"
            }`}
          >
            All
          </button>

          <button
            onClick={() =>
              setStatus("Booked")
            }
            className={`px-5 py-2 rounded-lg font-semibold transition ${
              status === "Booked"
                ? "bg-[#333] text-white"
                : "bg-[#262626] text-gray-400"
            }`}
          >
            Booked
          </button>

          {/* ADD TABLE */}
          <button
            onClick={() =>
              setShowModal(true)
            }
            className="bg-[#f6b100] hover:bg-[#ffcc33] text-black px-5 py-2 rounded-lg font-semibold flex items-center gap-2"
          >
            <FaPlus />
            Add Table
          </button>

        </div>

      </div>

      {/* TABLE GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">

        {filteredTables.map(
          (table) => (

            <div
              key={table._id}
              className="relative"
            >

              <TableCard
                id={table._id}
                name={table.tableNo}
                status={table.status}
                initials={
                  table?.currentOrder
                    ?.customerDetails
                    ?.name || "N/A"
                }
                seats={table.seats}
              />

              {/* DELETE BUTTON */}
              <button
                onClick={() =>
                  handleDeleteTable(
                    table
                  )
                }
                className="absolute bottom-3 right-3 bg-red-500 hover:bg-red-600 transition text-white text-xs px-3 py-1 rounded-lg"
              >
                Delete
              </button>

            </div>
          )
        )}

      </div>

      {/* CREATE TABLE MODAL */}
      {showModal && (

        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

          <div className="bg-[#262626] w-[400px] rounded-2xl p-6 border border-[#333]">

            <h1 className="text-white text-2xl font-bold mb-6">
              Create Table
            </h1>

            {/* TABLE NUMBER */}
            <div className="mb-4">

              <label className="text-gray-300 text-sm">
                Table Number
              </label>

              <input
                type="number"
                value={tableNo}
                onChange={(e) =>
                  setTableNo(
                    e.target.value
                  )
                }
                className="w-full mt-2 bg-[#1f1f1f] border border-[#444] rounded-lg px-4 py-3 text-white outline-none"
                placeholder="Enter table number"
              />

            </div>

            {/* SEATS */}
            <div className="mb-6">

              <label className="text-gray-300 text-sm">
                Seats
              </label>

              <input
                type="number"
                value={seats}
                onChange={(e) =>
                  setSeats(
                    e.target.value
                  )
                }
                className="w-full mt-2 bg-[#1f1f1f] border border-[#444] rounded-lg px-4 py-3 text-white outline-none"
                placeholder="Enter seats"
              />

            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3">

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="bg-[#333] hover:bg-[#444] px-5 py-2 rounded-lg text-white"
              >
                Cancel
              </button>

              <button
                onClick={
                  handleAddTable
                }
                className="bg-[#f6b100] hover:bg-[#ffcc33] px-5 py-2 rounded-lg text-black font-semibold"
              >
                Create
              </button>

            </div>

          </div>

        </div>

      )}

      {/* DELETE MODAL */}
      {deleteModal && (

        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

          <div className="bg-[#262626] w-[380px] rounded-2xl p-6 border border-[#333] shadow-2xl">

            <h1 className="text-white text-2xl font-bold">
              Delete Table
            </h1>

            <p className="text-gray-400 mt-3 leading-relaxed">
              Are you sure you want to
              delete{" "}

              <span className="text-gray-400 mt-3 font-bold">
                Table{" "}
                {
                  selectedTable?.tableNo
                }
              </span>

              ?
            </p>

            <div className="flex justify-end gap-3 mt-8">

              <button
                onClick={() => {

                  setDeleteModal(
                    false
                  );

                  setSelectedTable(
                    null
                  );
                }}
                className="bg-[#333] hover:bg-[#444] transition px-5 py-2 rounded-lg text-white"
              >
                Cancel
              </button>

              <button
                onClick={
                  confirmDeleteTable
                }
                className="bg-red-500 hover:bg-red-600 transition px-5 py-2 rounded-lg text-white font-semibold"
              >
                Delete
              </button>

            </div>

          </div>

        </div>

      )}

    </section>
  );
};

export default Tables;