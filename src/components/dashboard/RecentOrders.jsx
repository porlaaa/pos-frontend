import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { enqueueSnackbar } from "notistack";

import {
  getOrders,
  updateOrderStatus,
  updateTable,
} from "../../https/index";

import { formatDateAndTime } from "../../utils";

import {
  useDispatch,
} from "react-redux";

import {
  updateTable as updateCustomerTable,
} from "../../redux/slices/customerSlice";

const RecentOrders = () => {

  const dispatch =
    useDispatch();

  const queryClient =
    useQueryClient();

  // 🔔 refs
  const prevOrderCount =
    useRef(0);


  const handleStatusChange = ({
    orderId,
    orderStatus,
    tableId,
  }) => {

    orderStatusUpdateMutation.mutate({
      orderId,
      orderStatus,
    });

    // ✅ clear table
    if (
      orderStatus ===
        "Completed" &&
      tableId
    ) {

      tableUpdateMutation.mutate({
        tableId,
        status:
          "available",

        currentOrder:
          null,
      });

      // ✅ clear redux
      dispatch(
        updateCustomerTable({
          table: "",
          orderId: "",
          customerName:
            "",
        })
      );
    }
  };

  // ✅ update table
  const tableUpdateMutation =
    useMutation({
      mutationFn: (
        reqData
      ) =>
        updateTable(
          reqData
        ),

      onSuccess: () => {

        queryClient.invalidateQueries(
          [
            "tables",
          ]
        );
      },
    });

  // ✅ update order status
  const orderStatusUpdateMutation =
    useMutation({
      mutationFn: ({
        orderId,
        orderStatus,
      }) =>
        updateOrderStatus({
          orderId,
          orderStatus,
        }),

      onSuccess: () => {

        enqueueSnackbar(
          "Order status updated successfully!",
          {
            variant:
              "success",
          }
        );

        queryClient.invalidateQueries(
          [
            "orders",
          ]
        );
      },

      onError: () => {

        enqueueSnackbar(
          "Failed to update order status!",
          {
            variant:
              "error",
          }
        );
      },
    });

  // ✅ get orders
  const {
    data: resData,
    isError,
    isLoading,
  } = useQuery({
    queryKey: [
      "orders",
    ],

    queryFn:
      async () =>
        await getOrders(),

    placeholderData:
      keepPreviousData,

    // 🔥 realtime refresh
    refetchInterval:
      3000,
  });

  if (isError) {

    enqueueSnackbar(
      "Something went wrong!",
      {
        variant:
          "error",
      }
    );
  }

  // ✅ orders
  const orders =
    (
      resData?.data
        ?.data || []
    ).filter(
      (order) =>
        order.orderStatus?.trim() !==
        "Completed"
    );

  // 🔔 NEW ORDER SOUND
  useEffect(() => {

    if (!orders)
      return;

    if (
      prevOrderCount.current !==
        0 &&
      orders.length >
        prevOrderCount.current
    ) {

      enqueueSnackbar(
        "New Order Received!",
        {
          variant:
            "info",
        }
      );
    }

    prevOrderCount.current =
      orders.length;

  }, [
    orders,
  ]);


  if (isLoading) {

    return (
      <div className="text-white">
        Loading...
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
              <th className="p-3">
                Order ID
              </th>

              <th className="p-3">
                Customer
              </th>

              <th className="p-3">
                Status
              </th>

              <th className="p-3">
                Date & Time
              </th>

              <th className="p-3">
                Items
              </th>

              <th className="p-3">
                Table No
              </th>

              <th className="p-3">
                Total
              </th>

              <th className="p-3 text-center">
                Payment Method
              </th>
            </tr>

          </thead>

          <tbody>

            {orders.map(
              (
                order,
                index
              ) => (

                <tr
                  key={index}
                  className="border-b border-gray-600 hover:bg-[#333]"
                >

                  <td className="p-4">
                    #
                    {order._id.slice(
                      -6
                    )}
                  </td>

                  <td className="p-4">
                    {order
                      .customerDetails
                      ?.name ||
                      "-"}
                  </td>

                  <td className="p-4">

                    <select
                      className={`bg-[#1a1a1a] border border-gray-500 p-2 rounded-lg ${
                        order.orderStatus ===
                        "Ready"
                          ? "text-green-500"
                          : order.orderStatus ===
                            "Completed"
                          ? "text-blue-500"
                          : "text-yellow-500"
                      }`}
                      value={
                        order.orderStatus
                      }
                      onChange={(
                        e
                      ) =>
                        handleStatusChange(
                          {
                            orderId:
                              order._id,

                            orderStatus:
                              e
                                .target
                                .value,

                            tableId:
                              order.table,
                          }
                        )
                      }
                    >

                      <option value="In Progress">
                        In Progress
                      </option>

                      <option value="Ready">
                        Ready
                      </option>

                      <option value="Completed">
                        Completed
                      </option>

                    </select>

                  </td>

                  <td className="p-4">
                    {formatDateAndTime(
                      order.createdAt
                    )}
                  </td>

                  <td className="p-4">
                    {
                      (
                        order.items ||
                        []
                      ).length
                    }{" "}
                    Items
                  </td>

                  <td className="p-4">
                    Table -{" "}
                    {order.table ||
                      "-"}
                  </td>

                  <td className="p-4">
                    ฿
                    {order.bills
                      ?.total ||
                      0}
                  </td>

                  <td className="p-4">
                    {order.paymentMethod ||
                      "Cash"}
                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default RecentOrders;