import React, { useEffect, useRef } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { getOrders, updateOrderStatus } from "../../https/index";
import { updateTable as updateCustomerTable } from "../../redux/slices/customerSlice";
import { formatDateAndTime } from "../../utils";

const RecentOrders = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const prevOrderCount = useRef(0);

  const orderStatusUpdateMutation = useMutation({
    mutationFn: ({ orderId, orderStatus }) =>
      updateOrderStatus({
        orderId,
        orderStatus,
      }),

    onSuccess: (_resData, variables) => {
      enqueueSnackbar("Order status updated successfully!", {
        variant: "success",
      });

      if (variables.orderStatus === "Completed" && variables.tableId) {
        queryClient.invalidateQueries({ queryKey: ["tables"] });
        dispatch(
          updateCustomerTable({
            table: "",
            orderId: "",
            customerName: "",
          })
        );
      }

      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },

    onError: (error) => {
      enqueueSnackbar(
        error?.response?.data?.message || "Failed to update order status!",
        { variant: "error" }
      );
    },
  });

  const handleStatusChange = ({ orderId, orderStatus, tableId }) => {
    orderStatusUpdateMutation.mutate({
      orderId,
      orderStatus,
      tableId,
    });
  };

  const {
    data: resData,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => await getOrders(),
    placeholderData: keepPreviousData,
    refetchInterval: 3000,
  });

  const orders = (resData?.data?.data || []).filter(
    (order) => order.orderStatus?.trim() !== "Completed"
  );

  useEffect(() => {
    if (isError) {
      enqueueSnackbar("Something went wrong!", {
        variant: "error",
      });
    }
  }, [isError]);

  useEffect(() => {
    if (prevOrderCount.current !== 0 && orders.length > prevOrderCount.current) {
      enqueueSnackbar("New Order Received!", {
        variant: "info",
      });
    }

    prevOrderCount.current = orders.length;
  }, [orders]);

  if (isLoading) {
    return <div className="text-white">Loading...</div>;
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
            {orders.map((order) => (
              <tr
                key={order._id}
                className="border-b border-gray-600 hover:bg-[#333]"
              >
                <td className="p-4">#{order._id.slice(-6)}</td>

                <td className="p-4">{order.customerDetails?.name || "-"}</td>

                <td className="p-4">
                  <select
                    className={`bg-[#1a1a1a] border border-gray-500 p-2 rounded-lg ${
                      order.orderStatus === "Ready"
                        ? "text-green-500"
                        : order.orderStatus === "Completed"
                        ? "text-blue-500"
                        : "text-yellow-500"
                    }`}
                    value={order.orderStatus}
                    onChange={(e) =>
                      handleStatusChange({
                        orderId: order._id,
                        orderStatus: e.target.value,
                        tableId: order.table,
                      })
                    }
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Ready">Ready</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>

                <td className="p-4">{formatDateAndTime(order.createdAt)}</td>

                <td className="p-4">{(order.items || []).length} Items</td>

                <td className="p-4">Table - {order.table || "-"}</td>

                <td className="p-4">{order.bills?.total || 0} บาท</td>

                <td className="p-4">
                  {!order.paymentMethod ? (
                    <span className="text-red-500">Pending</span>
                  ) : order.paymentMethod === "Online" ? (
                    <span className="text-green-500">QR Code</span>
                  ) : (
                    <span className="text-green-500">Cash</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;