import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { formatDate, getAvatarName } from "../../utils";
import { useSearchParams } from "react-router-dom";
import { getOrderByTableId } from "../../https/index";
import { updateTable } from "../../redux/slices/customerSlice";

const CustomerInfo = () => {
  const [dateTime] = useState(new Date());
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const customerData = useSelector((state) => state.customer);

  // ✅ ประกาศตัวแปรเพื่อดึงค่าจาก URL ?tableId=xxxx
  const tableIdFromURL = searchParams.get("tableId");

  useEffect(() => {
    const fetchOrder = async () => {
      // 🔍 Log เช็คค่า ID จาก URL
      console.log("1. ตรวจสอบ ID จาก URL:", tableIdFromURL);

      if (tableIdFromURL) {
        try {
          const res = await getOrderByTableId(tableIdFromURL);
          
          // 🔍 Log เช็คข้อมูลที่ได้จาก API (ต้องเหมือนใน Postman)
          console.log("2. ข้อมูลจาก API:", res.data);

          if (res.data.success) {
            const order = res.data.data;
            dispatch(updateTable({
              customerName: order.customerDetails.name, // จะได้ "porlaaa"
              orderId: order._id,
            }));
          }
        } catch (error) {
          console.error("3. เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
        }
      } else {
        console.warn("⚠️ ไม่พบ tableId ใน URL");
      }
    };
    fetchOrder();
  }, [tableIdFromURL, dispatch]);

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex flex-col items-start">
        <h1 className="text-md text-[#f5f5f5] font-semibold">
          {customerData.customerName || "Customer Name"}
        </h1>
        <p className="text-xs text-[#ababab]">
          #{customerData.orderId || "N/A"} / Dine in
        </p>
        <p className="text-xs text-[#ababab] mt-2">
          {formatDate(dateTime)}
        </p>
      </div>
      <button className="bg-[#f6b100] p-3 text-xl font-bold rounded-lg">
        {getAvatarName(customerData.customerName) || "CN"}
      </button>
    </div>
  );
};

export default CustomerInfo;