import React, { useEffect, useRef } from "react";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import {
  removeItem,
  updateNote,
} from "../../redux/slices/cartSlice";
import { formatCurrency } from "../../utils";

const CartInfo = () => {
  const cartData = useSelector(
    (state) => state.cart
  );

  console.log("CART DATA:", cartData);

  const scrolLRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    if (scrolLRef.current) {
      scrolLRef.current.scrollTo({
        top: scrolLRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [cartData]);

  return (
    <div className="px-4 py-2">
      <h1 className="text-lg text-[#e4e4e4] font-semibold tracking-wide">
        Order Details
      </h1>

      <div
        className="mt-4 overflow-y-scroll scrollbar-hide h-[300px]"
        ref={scrolLRef}
      >
        {cartData.length === 0 ? (
          <p className="text-[#ababab] text-sm flex justify-center items-center h-[300px]">
            Your cart is empty.
          </p>
        ) : (
          cartData.map((item) => (
            <div
              key={item.cartItemId}
              className="bg-[#1f1f1f] rounded-lg px-4 py-4 mb-2"
            >
              <div className="flex items-center justify-between">
                <h1 className="text-[#ababab] font-semibold text-md">
                  {item.name}
                </h1>

                <p className="text-[#ababab] font-semibold">
                  x{item.quantity}
                </p>
              </div>

              <div className="flex items-center justify-between mt-3">
                <RiDeleteBin2Fill
                  onClick={() =>
                    dispatch(
                      removeItem(
                        item.cartItemId
                      )
                    )
                  }
                  className="text-[#ababab] cursor-pointer hover:text-red-500"
                  size={20}
                />

                <p className="text-[#f5f5f5] text-md font-bold">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>

              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Additional request (e.g., no spicy)"
                  value={item.note || ""}
                  onChange={(e) =>
                    dispatch(
                      updateNote({
                        cartItemId:
                          item.cartItemId,
                        note:
                          e.target.value,
                      })
                    )
                  }
                  className="w-full bg-[#2a2a2a] text-[#ababab] text-sm px-3 py-2 rounded-md outline-none focus:ring-1 focus:ring-[#f6b100] border border-[#333]"
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CartInfo;