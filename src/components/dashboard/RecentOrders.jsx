import React from "react";
import { GrUpdate } from "react-icons/gr";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getOrders, updateOrderStatus } from "../../https/index";
import { formatDateAndTime } from "../../utils";

const RecentOrders = () => {
  const queryClient = useQueryClient();

  // ✅ Update Order Status
  const orderStatusUpdateMutation = useMutation({
    mutationFn: ({ orderId, orderStatus }) =>
      updateOrderStatus({ orderId, orderStatus }),

    onSuccess: () => {
      enqueueSnackbar("Order status updated successfully!", {
        variant: "success",
      });
      queryClient.invalidateQueries(["orders"]);
    },

    onError: () => {
      enqueueSnackbar("Failed to update order status!", {
        variant: "error",
      });
    },
  });

  const handleStatusChange = ({ orderId, orderStatus }) => {
    if (!orderId) return;
    orderStatusUpdateMutation.mutate({ orderId, orderStatus });
  };

  // ✅ Fetch Orders
  const {
    data: resData,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await getOrders();
      return res.data?.data || []; // 🔥 normalize data ตรงนี้
    },
    placeholderData: keepPreviousData,
  });

  // ✅ Handle Error
  if (isError) {
    enqueueSnackbar("Something went wrong!", { variant: "error" });
  }

  // ✅ Safe data
  const orders = resData || [];

  // ✅ Loading UI
  if (isLoading) {
    return (
      <div className="text-white p-4">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="container mx-auto bg-[#262626] p-4 rounded-lg">
      <h2 className="text-[#f5f5f5] text-xl font-semibold mb-4">
        Recent Orders
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-[#f5f5f5]">
          <thead className="bg-[#333] text-[#ababab]">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date & Time</th>
              <th className="p-3">Items</th>
              <th className="p-3">Table No</th>
              <th className="p-3">Total</th>
              <th className="p-3 text-center">Payment Method</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center p-5 text-gray-400">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order, index) => (
                <tr
                  key={order?._id || index}
                  className="border-b border-gray-600 hover:bg-[#333]"
                >
                  <td className="p-4">
                    #{Math.floor(new Date(order?.orderDate).getTime() || 0)}
                  </td>

                  <td className="p-4">
                    {order?.customerDetails?.name || "-"}
                  </td>

                  <td className="p-4">
                    <select
                      className={`bg-[#1a1a1a] border border-gray-500 p-2 rounded-lg ${
                        order?.orderStatus === "Ready"
                          ? "text-green-500"
                          : "text-yellow-500"
                      }`}
                      value={order?.orderStatus || "In Progress"}
                      onChange={(e) =>
                        handleStatusChange({
                          orderId: order?._id,
                          orderStatus: e.target.value,
                        })
                      }
                    >
                      <option value="In Progress">In Progress</option>
                      <option value="Ready">Ready</option>
                    </select>
                  </td>

                  <td className="p-4">
                    {formatDateAndTime(order?.orderDate)}
                  </td>

                  <td className="p-4">
                    {order?.items?.length || 0} Items
                  </td>

                  <td className="p-4">
                    Table - {order?.table?.tableNo || "-"}
                  </td>

                  <td className="p-4">
                    ₹{order?.bills?.totalWithTax || 0}
                  </td>

                  <td className="p-4">
                    {order?.paymentMethod || "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;