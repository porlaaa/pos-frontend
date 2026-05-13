import React, { useEffect, useRef } from "react";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { FaNotesMedical } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { removeItem, setItems } from "../../redux/slices/cartSlice";
import { useSearchParams } from "react-router-dom";
import { getOrderByTableId } from "../../https/index";

const CartInfo = () => {
  const cartData = useSelector((state) => state.cart);
  const scrolLRef = useRef();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const tableId = searchParams.get("tableId");

  // Removed the useEffect that fetches existing order items
  // to prevent confusing the user and to fix the double-billing issue
  // when adding new items to an existing order.

  useEffect(() => {
    if (scrolLRef.current) {
      scrolLRef.current.scrollTo({ top: scrolLRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [cartData]);

  return (
    <div className="px-4 py-2">
      <h1 className="text-lg text-[#e4e4e4] font-semibold tracking-wide">Order Details</h1>
      <div className="mt-4 overflow-y-scroll scrollbar-hide h-[380px]" ref={scrolLRef}>
        {cartData.length === 0 ? (
          <p className="text-[#ababab] text-sm flex justify-center items-center h-[380px]">Your cart is empty.</p>
        ) : (
          cartData.map((item, index) => (
            <div key={item.itemId || index} className="bg-[#1f1f1f] rounded-lg px-4 py-4 mb-2">
              <div className="flex items-center justify-between">
                <h1 className="text-[#ababab] font-semibold text-md">{item.name}</h1>
                <p className="text-[#ababab] font-semibold">x{item.quantity}</p>
              </div>
              <div className="flex items-center justify-between mt-3">
                <RiDeleteBin2Fill 
                  onClick={() => dispatch(removeItem(item.itemId))}
                  className="text-[#ababab] cursor-pointer hover:text-red-500" 
                  size={20} 
                />
                <p className="text-[#f5f5f5] text-md font-bold">${item.price}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CartInfo;