import React from "react";
import { FaCheckDouble, FaLongArrowAltRight, FaCircle } from "react-icons/fa";
import { formatDateAndTime, getAvatarName } from "../../utils/index";

const OrderCard = ({ order }) => {
  if (!order) return null;

  const customerName = order.customerDetails?.name || "Guest";
  const tableNo = order.table?.tableNo || "-";
  const itemsCount = (order.items || []).length;
  const total = order.bills?.totalWithTax || 0;

  return (
    <div className="w-full bg-[#262626] p-4 rounded-lg mb-4">
      <div className="flex items-center gap-5">

        {/* Avatar */}
        <button className="bg-[#f6b100] p-3 text-xl font-bold rounded-lg">
          {getAvatarName(customerName)}
        </button>

        <div className="flex items-center justify-between w-full">

          {/* Left */}
          <div className="flex flex-col items-start gap-1">
            <h1 className="text-[#f5f5f5] text-lg font-semibold tracking-wide">
              {customerName}
            </h1>

            <p className="text-[#ababab] text-sm">
              #{Math.floor(new Date(order.orderDate).getTime())} / Dine in
            </p>

            <p className="text-[#ababab] text-sm">
              Table <FaLongArrowAltRight className="inline ml-2" /> {tableNo}
            </p>
          </div>

          {/* Right */}
          <div className="flex flex-col items-end gap-2">
            {order.orderStatus === "Ready" ? (
              <>
                <p className="text-green-600 bg-[#2e4a40] px-2 py-1 rounded-lg">
                  <FaCheckDouble className="inline mr-2" /> Ready
                </p>
                <p className="text-[#ababab] text-sm">
                  <FaCircle className="inline mr-2 text-green-600" />
                  Ready to serve
                </p>
              </>
            ) : order.orderStatus === "Completed" ? (
              <>
                <p className="text-blue-600 bg-[#2e3a4a] px-2 py-1 rounded-lg">
                  <FaCheckDouble className="inline mr-2" /> Completed
                </p>
                <p className="text-[#ababab] text-sm">
                  <FaCircle className="inline mr-2 text-blue-600" />
                  Order completed
                </p>
              </>
            ) : (
              <>
                <p className="text-yellow-600 bg-[#4a452e] px-2 py-1 rounded-lg">
                  <FaCircle className="inline mr-2" />
                  {order.orderStatus || "Pending"}
                </p>
                <p className="text-[#ababab] text-sm">
                  <FaCircle className="inline mr-2 text-yellow-600" />
                  Preparing your order
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="flex justify-between items-center mt-4 text-[#ababab]">
        <p>{formatDateAndTime(order.orderDate)}</p>
        <p>{itemsCount} Items</p>
      </div>

      <hr className="w-full mt-4 border-gray-500" />

      <div className="flex items-center justify-between mt-4">
        <h1 className="text-[#f5f5f5] text-lg font-semibold">Total</h1>
        <p className="text-[#f5f5f5] text-lg font-semibold">
          ${total.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default OrderCard;