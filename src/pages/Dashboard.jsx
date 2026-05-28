import React, { useState, useEffect } from "react";
import { MdCategory } from "react-icons/md";
import { BiSolidDish } from "react-icons/bi";
import Metrics from "../components/dashboard/Metrics";
import RecentOrders from "../components/dashboard/RecentOrders";
import Modal from "../components/dashboard/Modal";

const buttons = [
  {
    label: "Add Category",
    icon: <MdCategory />,
    action: "category",
  },

  {
    label: "Add Dishes",
    icon: <BiSolidDish />,
    action: "dishes",
  },
];

const tabs = [
  "Sales Revenue",
  "Orders",
];

const Dashboard = () => {

  useEffect(() => {
    document.title =
      "POS | Admin Dashboard";
  }, []);

  const [modalType, setModalType] =
    useState(null);

  const [activeTab, setActiveTab] =
    useState("Sales Revenue");

  const handleOpenModal = (
    action
  ) => {
    setModalType(action);
  };

  return (
    <section className="bg-[#1f1f1f] min-h-screen text-white">

      {/* HEADER */}
      <div className="border-b border-[#2a2a2a]">

        <div className="container mx-auto px-6 py-8">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

            {/* LEFT */}
            <div>

              <h1 className="text-4xl font-bold">
                Dashboard
              </h1>

              <p className="text-gray-400 mt-2">
                Manage your restaurant
                performance
              </p>

            </div>

            {/* RIGHT */}
            <div className="flex flex-wrap gap-3">

              {buttons.map(
                ({
                  label,
                  icon,
                  action,
                }) => (

                  <button
                    key={action}
                    onClick={() =>
                      handleOpenModal(
                        action
                      )
                    }
                    className="bg-[#262626] hover:bg-[#333] transition px-6 py-3 rounded-xl flex items-center gap-2 font-semibold"
                  >
                    {icon}
                    {label}
                  </button>
                )
              )}

            </div>

          </div>

        </div>

      </div>

      {/* TABS */}
      <div className="container mx-auto px-6 mt-8">

        <div className="flex flex-wrap gap-3">

          {tabs.map((tab) => (

            <button
              key={tab}
              onClick={() =>
                setActiveTab(tab)
              }
              className={`px-6 py-3 rounded-xl font-semibold transition ${
                activeTab === tab
                  ? "bg-[#f6b100] text-black"
                  : "bg-[#262626] hover:bg-[#333]"
              }`}
            >
              {tab}
            </button>

          ))}

        </div>

      </div>

      {/* CONTENT */}
      <div className="container mx-auto px-6 mt-8 pb-10">

        {activeTab ===
          "Sales Revenue" && (
          <Metrics />
        )}

        {activeTab ===
          "Orders" && (
          <RecentOrders />
        )}

      </div>

      {/* MODAL */}
      {modalType && (
        <Modal
          type={modalType}
          setModalType={
            setModalType
          }
        />
      )}

    </section>
  );
};

export default Dashboard;