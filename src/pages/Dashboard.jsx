import React, { useState, useEffect } from "react";
import { MdTableBar, MdCategory } from "react-icons/md";
import { BiSolidDish } from "react-icons/bi";
import Metrics from "../components/dashboard/Metrics";
import RecentOrders from "../components/dashboard/RecentOrders";
import Modal from "../components/dashboard/Modal";

const buttons = [
  { label: "Add Table", icon: <MdTableBar />, action: "table" },
  { label: "Add Category", icon: <MdCategory />, action: "category" },
  { label: "Add Dishes", icon: <BiSolidDish />, action: "dishes" },
];

const tabs = ["Metrics", "Orders", "Payments"];

const Dashboard = () => {
  useEffect(() => {
    document.title = "POS | Admin Dashboard";
  }, []);

  const [modalType, setModalType] = useState(null);
  const [activeTab, setActiveTab] = useState("Metrics");

  const handleOpenModal = (action) => {
    setModalType(action);
  };

  return (
    <section className="bg-[#1f1f1f] h-full flex flex-col">
      <div className="container mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-14 px-6 md:px-4">

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {buttons.map(({ label, icon, action }) => (
            <button
              key={action}
              onClick={() => handleOpenModal(action)}
              className="bg-[#1a1a1a] hover:bg-[#262626] px-6 py-3 rounded-lg text-[#f5f5f5] font-semibold flex items-center gap-2"
            >
              {label} {icon}
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-6 py-3 rounded-lg text-[#f5f5f5] font-semibold ${activeTab === tab
                  ? "bg-[#262626]"
                  : "bg-[#1a1a1a] hover:bg-[#262626]"
                }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="transition-all duration-300">
        {activeTab === "Metrics" && <Metrics />}
        {activeTab === "Orders" && <RecentOrders />}
        {activeTab === "Payments" && (
          <div className="text-white p-6 container mx-auto">
            Payment Component Coming Soon
          </div>
        )}
      </div>

      {/* Modal */}
      {modalType && (
        <Modal type={modalType} setModalType={setModalType} />
      )}
    </section>
  );
};

export default Dashboard;