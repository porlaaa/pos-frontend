import React, { useRef } from "react";
import { motion } from "framer-motion";
import { FaCheck } from "react-icons/fa6";

const Invoice = ({ orderInfo = {}, setShowInvoice }) => {
  const invoiceRef = useRef(null);

  // ✅ safe data
  const customer = orderInfo?.customerDetails || {};
  const bills = orderInfo?.bills || {};
  const items = orderInfo?.items || [];

  // ✅ safe date
  const orderId = orderInfo?.orderDate
    ? Math.floor(new Date(orderInfo.orderDate).getTime())
    : "-";

  const handlePrint = () => {
    if (!invoiceRef.current) return;

    const printContent = invoiceRef.current.innerHTML;
    const WinPrint = window.open("", "", "width=900,height=650");

    WinPrint.document.write(`
      <html>
        <head>
          <title>Order Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .receipt-container { width: 300px; }
            h2 { text-align: center; }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);

    WinPrint.document.close();
    WinPrint.focus();

    setTimeout(() => {
      WinPrint.print();
      WinPrint.close();
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-[400px]">

        {/* Receipt */}
        <div ref={invoiceRef} className="p-4">

          {/* Animation */}
          <div className="flex justify-center mb-4">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
              className="w-12 h-12 border-8 border-green-500 rounded-full flex items-center justify-center bg-green-500"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl"
              >
                <FaCheck className="text-white" />
              </motion.span>
            </motion.div>
          </div>

          <h2 className="text-xl font-bold text-center mb-2">
            Order Receipt
          </h2>
          <p className="text-gray-600 text-center">
            Thank you for your order!
          </p>

          {/* Order Info */}
          <div className="mt-4 border-t pt-4 text-sm text-gray-700">
            <p><strong>Order ID:</strong> {orderId}</p>
            <p><strong>Name:</strong> {customer.name || "Guest"}</p>
            <p><strong>Phone:</strong> {customer.phone || "-"}</p>
            <p><strong>Guests:</strong> {customer.guests || "-"}</p>
          </div>

          {/* Items */}
          <div className="mt-4 border-t pt-4">
            <h3 className="text-sm font-semibold">Items Ordered</h3>
            <ul className="text-sm text-gray-700">
              {(items || []).map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between text-xs"
                >
                  <span>
                    {item?.name || "Item"} x{item?.quantity || 0}
                  </span>
                  <span>
                    ₹{item?.price?.toFixed?.(2) || "0.00"}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bills */}
          <div className="mt-4 border-t pt-4 text-sm">
            <p>
              <strong>Subtotal:</strong>{" "}
              ₹{bills.total?.toFixed?.(2) || "0.00"}
            </p>
            <p>
              <strong>Tax:</strong>{" "}
              ₹{bills.tax?.toFixed?.(2) || "0.00"}
            </p>
            <p className="text-md font-semibold">
              <strong>Grand Total:</strong>{" "}
              ₹{bills.totalWithTax?.toFixed?.(2) || "0.00"}
            </p>
          </div>

          {/* Payment */}
          <div className="mt-2 text-xs">
            <p>
              <strong>Payment Method:</strong>{" "}
              {orderInfo?.paymentMethod || "-"}
            </p>

            {orderInfo?.paymentMethod !== "Cash" && (
              <>
                <p>
                  <strong>Order ID:</strong>{" "}
                  {orderInfo?.paymentData?.razorpay_order_id || "-"}
                </p>
                <p>
                  <strong>Payment ID:</strong>{" "}
                  {orderInfo?.paymentData?.razorpay_payment_id || "-"}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePrint}
            className="text-blue-500 hover:underline text-xs px-4 py-2"
          >
            Print Receipt
          </button>

          <button
            onClick={() => setShowInvoice(false)}
            className="text-red-500 hover:underline text-xs px-4 py-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Invoice;