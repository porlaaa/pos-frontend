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

  const handleStatusChange = ({ orderId, orderStatus }) => {
    orderStatusUpdateMutation.mutate({ orderId, orderStatus });
  };

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

  const { data: resData, isLoading, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => await getOrders(),
    placeholderData: keepPreviousData,
  });

  // ✅ handle loading
  if (isLoading) {
    return <div className="text-white p-4">Loading orders...</div>;
  }

  // ✅ handle error
  if (isError) {
    return (
      <div className="text-red-500 p-4">
        Failed to load orders.
      </div>
    );
  }

  // ✅ safe default
  const orders = resData?.data?.data || [];

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
                <td colSpan="8" className="text-center p-4">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order, index) => (
                <tr
                  key={order._id || index}
                  className="border-b border-gray-600 hover:bg-[#333]"
                >
                  <td className="p-4">
                    #{Math.floor(new Date(order.orderDate).getTime())}
                  </td>

                  <td className="p-4">
                    {order.customerDetails?.name || "N/A"}
                  </td>

                  <td className="p-4">
                    <select
                      className={`bg-[#1a1a1a] text-[#f5f5f5] border border-gray-500 p-2 rounded-lg ${
                        order.orderStatus === "Ready"
                          ? "text-green-500"
                          : "text-yellow-500"
                      }`}
                      value={order.orderStatus}
                      onChange={(e) =>
                        handleStatusChange({
                          orderId: order._id,
                          orderStatus: e.target.value,
                        })
                      }
                    >
                      <option value="In Progress">In Progress</option>
                      <option value="Ready">Ready</option>
                    </select>
                  </td>

                  <td className="p-4">
                    {formatDateAndTime(order.orderDate)}
                  </td>

                  <td className="p-4">
                    {order.items?.length || 0} Items
                  </td>

                  <td className="p-4">
                    Table - {order.table?.tableNo || "N/A"}
                  </td>

                  <td className="p-4">
                    ₹{order.bills?.totalWithTax || 0}
                  </td>

                  <td className="p-4">
                    {order.paymentMethod || "N/A"}
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