import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { getTotalPrice, getTotalQuantity } from "../../redux/slices/cartSlice";

import {
  addOrder,
  addItemToOrder,
  updateTable,
  updatePaymentMethod,
} from "../../https/index";

import { enqueueSnackbar } from "notistack";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { removeAllItems } from "../../redux/slices/cartSlice";

import {
  setCustomer,
  removeCustomer,
} from "../../redux/slices/customerSlice";

import Invoice from "../invoice/Invoice";

import qrCodeImg from "../../assets/images/qrcode.jpg";
import { formatCurrency } from "../../utils";

const Bill = () => {

  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const customerData = useSelector(
    (state) => state.customer
  );

  const cartData = useSelector(
    (state) => state.cart
  );

  const total = useSelector(
    getTotalPrice
  );

  const totalQuantity = useSelector(
    getTotalQuantity
  );

  const taxRate = 7;

  const tax =
    (total * taxRate) / 100;

  const totalPriceWithTax =
    total + tax;

  const [paymentMethod,
    setPaymentMethod] =
    useState();

  const [showInvoice,
    setShowInvoice] =
    useState(false);

  const [orderInfo,
    setOrderInfo] =
    useState();

  const [showQRModal,
    setShowQRModal] =
    useState(false);

  // =====================================================
  // ✅ CREATE ORDER
  // =====================================================

  const submitOrder = () => {

    const orderData = {

      customerDetails: {
        name:
          customerData.customerName,

        phone:
          customerData.customerPhone,

        guests:
          customerData.guests,
      },

      orderStatus:
        "In Progress",

      bills: {
        total: total,
        tax: tax,
        totalWithTax:
          totalPriceWithTax,
      },

      items: cartData.map(
        (item) => ({
          _id:
            item.itemId ||
            item._id ||
            item.id,

          quantity:
            item.quantity,

          note: item.note,
        })
      ),

      table: Number(
        customerData.table
      ),
    };

    orderMutation.mutate(
      orderData
    );
  };

  // =====================================================
  // ✅ PLACE ORDER
  // =====================================================

  const handleSaveOrder = () => {

    if (!cartData.length) {

      enqueueSnackbar(
        "กรุณาเพิ่มรายการอาหารก่อน",
        {
          variant: "warning",
        }
      );

      return;
    }

    submitOrder();
  };

  // =====================================================
  // ✅ CHECK BILL
  // =====================================================

  const handlePlaceOrder = () => {

    if (!customerData.orderId) {

      enqueueSnackbar(
        "Please place an order before checking bill!",
        {
          variant:
            "warning",
        }
      );

      return;
    }

    if (!paymentMethod) {

      enqueueSnackbar(
        "Please select a payment method!",
        {
          variant:
            "warning",
        }
      );

      return;
    }

    // ✅ ONLINE
    if (
      paymentMethod ===
      "Online"
    ) {

      setShowQRModal(true);

    } else {

      // ✅ CASH
      paymentMutation.mutate({
        orderId:
          customerData.orderId,

        paymentMethod:
          "Cash",
      });
    }
  };

  // =====================================================
  // ✅ CREATE ORDER MUTATION
  // =====================================================

  const orderMutation =
    useMutation({

      mutationFn:
        async (reqData) => {

          // ✅ add item to existing order
          if (
            customerData.orderId
          ) {

            return await addItemToOrder(
              customerData.orderId,
              reqData
            );
          }

          // ✅ create new order
          return await addOrder(
            reqData
          );
        },

      onSuccess:
        (resData) => {

          const { data } =
            resData.data;

          console.log(data);

          setOrderInfo(data);

          // ✅ SAVE ORDER ID
          dispatch(
            setCustomer({
              ...customerData,
              orderId:
                data._id,
            })
          );

          // ✅ create new order
          if (
            !customerData.orderId
          ) {

            if (data.table) {

              const tableData = {
                status:
                  "Booked",

                currentOrder:
                  data._id,

                tableId:
                  data.table,
              };

              setTimeout(() => {

                tableUpdateMutation.mutate(
                  tableData
                );

              }, 1500);

            } else {

              dispatch(
                removeAllItems()
              );
            }

          } else {

            // ✅ existing order
            dispatch(
              removeAllItems()
            );
          }

          enqueueSnackbar(
            "Order Placed!",
            {
              variant:
                "success",
            }
          );
        },

      onError: (error) => {

        console.log(error);

        enqueueSnackbar(
          "Failed to place order!",
          {
            variant:
              "error",
          }
        );
      },
    });

  // =====================================================
  // ✅ UPDATE PAYMENT
  // =====================================================

  const paymentMutation =
    useMutation({

      mutationFn:
        ({
          orderId,
          paymentMethod,
        }) =>

          updatePaymentMethod(
            orderId,
            {
              paymentMethod,
            }
          ),

      onSuccess:
        (resData) => {

          const { data } =
            resData.data;

          console.log(data);

          setOrderInfo(data);

          // ✅ clear after payment
          dispatch(
            removeAllItems()
          );

          dispatch(
            removeCustomer()
          );

          enqueueSnackbar(
            "Payment Updated!",
            {
              variant:
                "success",
            }
          );

          queryClient.invalidateQueries({ queryKey: ["orders"] });
          queryClient.invalidateQueries({ queryKey: ["tables"] });

          setShowInvoice(true);
        },

      onError: (error) => {

        console.log(error);

        enqueueSnackbar(
          "Payment update failed!",
          {
            variant:
              "error",
          }
        );
      },
    });

  // =====================================================
  // ✅ UPDATE TABLE
  // =====================================================

  const tableUpdateMutation =
    useMutation({

      mutationFn:
        (reqData) =>
          updateTable(
            reqData
          ),

      onSuccess:
        (resData) => {

          console.log(
            resData
          );

          dispatch(
            removeAllItems()
          );
        },

      onError: (error) => {

        console.log(error);
      },
    });

  return (
    <>

      {/* TOTALS */}

      <div className="flex items-center justify-between px-5 mt-2">

        <p className="text-xs text-[#ababab] font-medium mt-2">

          Items(
          {totalQuantity}
          )

        </p>

        <h1 className="text-[#f5f5f5] text-md font-bold">

          {formatCurrency(total)}

        </h1>
      </div>

      <div className="flex items-center justify-between px-5 mt-2">

        <p className="text-xs text-[#ababab] font-medium mt-2">

          VAT(7%)

        </p>

        <h1 className="text-[#f5f5f5] text-md font-bold">

          {formatCurrency(tax)}

        </h1>
      </div>

      <div className="flex items-center justify-between px-5 mt-2">

        <p className="text-xs text-[#ababab] font-medium mt-2">

          Total With VAT

        </p>

        <h1 className="text-[#f5f5f5] text-md font-bold">

          {formatCurrency(totalPriceWithTax)}

        </h1>
      </div>

      {/* PAYMENT */}

      <div className="flex items-center gap-3 px-5 mt-4">

        <button
          onClick={() =>
            setPaymentMethod(
              "Cash"
            )
          }

          className={`bg-[#1f1f1f] px-4 py-3 w-full rounded-lg text-[#ababab] font-semibold ${paymentMethod ===
              "Cash"

              ? "bg-[#383737]"
              : ""
            }`}
        >

          Cash

        </button>

        <button
          onClick={() =>
            setPaymentMethod(
              "Online"
            )
          }

          className={`bg-[#1f1f1f] px-4 py-3 w-full rounded-lg text-[#ababab] font-semibold ${paymentMethod ===
              "Online"

              ? "bg-[#383737]"
              : ""
            }`}
        >
          QR Code

        </button>
      </div>

      {/* BUTTONS */}

      <div className="flex flex-col gap-3 px-5 mt-4">

        <div className="flex items-center gap-3 w-full">

          <button className="bg-[#025cca] px-4 py-3 w-full rounded-lg text-[#f5f5f5] font-semibold text-lg">

            Print Receipt

          </button>

          <button
            onClick={
              handleSaveOrder
            }

            className="bg-[#f6b100] px-4 py-3 w-full rounded-lg text-[#1f1f1f] font-semibold text-lg"
          >

            Place Order

          </button>
        </div>

        <button
          onClick={
            handlePlaceOrder
          }

          className="bg-[#02ca3a] px-4 py-3 w-full rounded-lg text-[#f5f5f5] font-semibold text-lg hover:bg-[#02b333] transition"
        >

          Check Bill

        </button>
      </div>

      {/* INVOICE */}

      {showInvoice && (

        <Invoice
          orderInfo={
            orderInfo
          }

          currentItems={
            cartData
          }

          setShowInvoice={
            setShowInvoice
          }
        />
      )}

      {/* QR MODAL */}

      {showQRModal && (

        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

          <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#333] flex flex-col items-center max-w-md w-full mx-4">

            <h2 className="text-white text-xl font-bold mb-4">

              Scan QR Code to Pay

            </h2>

            <div className="bg-white p-2 rounded-xl mb-6">

              <img
                src={qrCodeImg}
                alt="QR Code"
                className="w-72 h-72 object-cover"
              />
            </div>

            <div className="flex gap-4 w-full">

              <button
                onClick={() =>
                  setShowQRModal(
                    false
                  )
                }

                className="flex-1 bg-[#333] hover:bg-[#444] text-white py-3 rounded-lg font-semibold transition"
              >

                Cancel

              </button>

              <button
                onClick={() => {

                  setShowQRModal(
                    false
                  );

                  paymentMutation.mutate({
                    orderId:
                      customerData.orderId,

                    paymentMethod:
                      "Online",
                  });
                }}

                className="flex-1 bg-[#02ca3a] hover:bg-[#02b333] text-white py-3 rounded-lg font-semibold transition"
              >

                Done

              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Bill;