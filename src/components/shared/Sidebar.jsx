import React, { useState } from "react";
import { FaHome } from "react-icons/fa";
import { MdOutlineReorder, MdTableBar, MdDashboard } from "react-icons/md";
import { BiSolidDish } from "react-icons/bi";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "./Modal";
import { useDispatch, useSelector } from "react-redux";
import { setCustomer, updateTable } from "../../redux/slices/customerSlice";
import { removeAllItems } from "../../redux/slices/cartSlice";
import { useQuery } from "@tanstack/react-query";
import { getTables } from "../../https";
import logo from "../../assets/images/logo.png";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { role } = useSelector(state => state.user);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guestCount, setGuestCount] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedTable, setSelectedTable] = useState("");

  const { data: tablesData } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => await getTables(),
  });

  const tables = tablesData?.data?.data || [];
  const availableTables = tables.filter(t => t.status !== "Booked");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTable("");
  };

  const increment = () => {
    if (guestCount >= 6) return;
    setGuestCount((prev) => prev + 1);
  }
  const decrement = () => {
    if (guestCount <= 0) return;
    setGuestCount((prev) => prev - 1);
  }

  const isActive = (path) => location.pathname === path;

  const handleCreateOrder = () => {
    dispatch(removeAllItems());
    dispatch(setCustomer({ name, phone, guests: guestCount }));

    if (selectedTable) {
      const tableObj = tables.find(t => t._id === selectedTable);
      dispatch(updateTable({

        table: tableObj._id,

        customerName: name,
      }));
      setIsModalOpen(false);
      navigate("/menu");
    } else {
      setIsModalOpen(false);
      navigate("/tables");
    }
  }

  const navItems = [
    { name: "Home", icon: <FaHome size={20} />, path: "/" },
    { name: "Orders", icon: <MdOutlineReorder size={20} />, path: "/orders" },
    { name: "Tables", icon: <MdTableBar size={20} />, path: "/tables" },
    { name: "Menu", icon: <BiSolidDish size={20} />, path: "/menu" },
  ];

  if (role === "Admin") {
    navItems.push({ name: "Dashboard", icon: <MdDashboard size={20} />, path: "/dashboard" });
  }

  return (
    <div className="w-[260px] bg-[#1a1a1a] h-screen flex flex-col justify-between border-r border-[#333] shrink-0">
      <div>
        <div onClick={() => navigate("/")} className="flex items-center gap-3 p-6 cursor-pointer border-b border-[#333]">
          <img src={logo} className="h-10 w-10" alt="restro logo" />
          <h1 className="text-2xl font-bold text-[#f5f5f5] tracking-wide">
            Restro OS
          </h1>
        </div>

        <nav className="flex flex-col mt-6 px-4 gap-2">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-4 px-4 py-4 rounded-xl font-semibold transition-colors duration-200 ${isActive(item.path)
                ? "bg-[#343434] text-[#f6b100] shadow-sm"
                : "text-[#ababab] hover:bg-[#262626] hover:text-[#f5f5f5]"
                }`}
            >
              {item.icon}
              <span className="text-lg">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4">
        <button
          onClick={openModal}
          className="w-full flex items-center justify-center gap-2 bg-[#F6B100] text-[#1f1f1f] font-bold rounded-xl py-4 hover:bg-yellow-500 transition-colors shadow-lg"
        >
          <BiSolidDish size={24} />
          Create Order
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Create Order">
        <div>
          <label className="block text-[#ababab] mb-2 text-sm font-medium">Customer Name</label>
          <div className="flex items-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
            <input value={name} onChange={(e) => setName(e.target.value)} type="text" name="" placeholder="Enter customer name" id="" className="bg-transparent flex-1 text-white focus:outline-none" />
          </div>
        </div>
        <div>
          <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">Customer Phone</label>
          <div className="flex items-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
            <input value={phone} onChange={(e) => setPhone(e.target.value)} type="number" name="" placeholder="+91-9999999999" id="" className="bg-transparent flex-1 text-white focus:outline-none" />
          </div>
        </div>
        <div>
          <label className="block mb-2 mt-3 text-sm font-medium text-[#ababab]">Guest</label>
          <div className="flex items-center justify-between bg-[#1f1f1f] px-4 py-3 rounded-lg">
            <button onClick={decrement} className="text-yellow-500 text-2xl">&minus;</button>
            <span className="text-white">{guestCount} Person</span>
            <button onClick={increment} className="text-yellow-500 text-2xl">&#43;</button>
          </div>
        </div>

        <div>
          <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">Select Table</label>
          <div className="flex items-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className="bg-transparent flex-1 text-white focus:outline-none appearance-none"
            >
              <option value="" className="text-black bg-[#1f1f1f] border-none">-- Select a table (or skip) --</option>
              {availableTables.map(t => (
                <option key={t._id} value={t._id} className="text-black bg-[#1f1f1f] border-none">Table {t.tableNo}</option>
              ))}
            </select>
          </div>
        </div>
        <button onClick={handleCreateOrder} className="w-full bg-[#F6B100] text-[#1f1f1f] rounded-lg py-3 mt-8 font-bold hover:bg-yellow-500">
          Create Order
        </button>
      </Modal>
    </div>
  );
};

export default Sidebar;
