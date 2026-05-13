import React from "react";
import { useNavigate } from "react-router-dom";
import { getAvatarName, getBgColor } from "../../utils";
import { FaLongArrowAltRight } from "react-icons/fa";

const TableCard = ({ id, name, status, initials, seats }) => { 
  const navigate = useNavigate();

  const handleClick = () => {
    // ✅ ไม่ต้องสนสถานะ ได้ ID มาปุ๊บ พาเข้าหน้าเมนูทันที!
    navigate(`/menu?tableId=${id}`); 
  };

  return (
    <div
      onClick={handleClick}
      className="w-full hover:bg-[#2c2c2c] bg-[#262626] p-4 rounded-lg cursor-pointer transition-all"
    >
      <div className="flex items-center justify-between px-1">
        <h1 className="text-[#f5f5f5] text-xl font-semibold">
          Table <FaLongArrowAltRight className="text-[#ababab] ml-2 inline" size={15} /> {name}
        </h1>
        <p className={`${
          status === "booked" 
            ? "text-[#4ade80] bg-[#1a2e25]" 
            : "text-[#fbbf24] bg-[#3a2a0d]" 
          } px-3 py-1 rounded-lg text-xs font-bold uppercase`}
        >
          {status}
        </p>
      </div>

      <div className="flex items-center justify-center mt-5 mb-8">
        <h1
          className="text-white rounded-full w-16 h-16 flex items-center justify-center text-xl font-bold"
          style={{ 
            backgroundColor: initials && initials !== "N/A" ? getBgColor(initials) : "#1f1f1f" 
          }}
        >
          {getAvatarName(initials) || "N/A"}
        </h1>
      </div>
    </div>
  );
};

export default TableCard;