import React, { useEffect } from "react";
import BackButton from "../components/shared/BackButton";
import { MdRestaurantMenu } from "react-icons/md";
import MenuContainer from "../components/menu/MenuContainer";
import CustomerInfo from "../components/menu/CustomerInfo";
import CartInfo from "../components/menu/CartInfo";
import Bill from "../components/menu/Bill";

import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";

// Redux actions
import {
  removeCustomer,
  updateTable,
} from "../redux/slices/customerSlice";

import { removeAllItems } from "../redux/slices/cartSlice";

const Menu = () => {
  const dispatch = useDispatch();

  // Read tableId from URL.
  const [searchParams] = useSearchParams();
  const tableId = searchParams.get("tableId");

  const customerData = useSelector((state) => state.customer);

  // Set page title.
  useEffect(() => {
    document.title = "POS | Menu";
  }, []);

  // Change active table.
  useEffect(() => {
    if (!tableId) return;

    // Keep the current cart when reopening the same table.
    if (String(customerData.table) === String(tableId)) {
      return;
    }

    console.log("Current Table ID:", tableId);

    // Reset old order state.
    dispatch(removeCustomer());
    dispatch(removeAllItems());

    // Set the new table.
    dispatch(updateTable({
      table: Number(tableId),
    }));
  }, [tableId, dispatch, customerData.table]);

  return (
    <section className="bg-[#1f1f1f] h-full flex flex-col lg:flex-row gap-3">
      {/* Left Div */}
      <div className="flex-[3] flex flex-col">
        <div className="flex items-center justify-between px-10 py-4">
          <div className="flex items-center gap-4">
            <BackButton />

            <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wider">
              Menu
            </h1>
          </div>

          <div className="flex items-center justify-around gap-4">
            <div className="flex items-center gap-3 cursor-pointer">
              <MdRestaurantMenu className="text-[#f5f5f5] text-4xl" />

              <div className="flex flex-col items-start">
                <h1 className="text-md text-[#f5f5f5] font-semibold tracking-wide">
                  {customerData.customerName || "Customer Name"}
                </h1>

                <p className="text-xs text-[#ababab] font-medium">
                  Table : {customerData.table || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Menu */}
        <MenuContainer />
      </div>

      {/* Right Div */}
      <div className="flex-[1] bg-[#1a1a1a] lg:mt-4 mx-4 lg:mx-0 lg:mr-3 h-auto lg:h-[780px] rounded-lg pt-2 mb-4 lg:mb-0">
        {/* Customer Info */}
        <CustomerInfo />

        <hr className="border-[#2a2a2a] border-t-2" />

        {/* Cart Items */}
        <CartInfo />

        <hr className="border-[#2a2a2a] border-t-2" />

        {/* Bills */}
        <Bill />
      </div>
    </section>
  );
};

export default Menu;
