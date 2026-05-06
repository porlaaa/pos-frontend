import React, { useState, useEffect } from "react";
import { GrRadialSelected } from "react-icons/gr";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addItems } from "../../redux/slices/cartSlice";
import { useQuery } from "@tanstack/react-query";
import { getMenus, getItems } from "../../https";

const MenuContainer = () => {
  const [selected, setSelected] = useState(null);
  const [itemCount, setItemCount] = useState(0);
  const [itemId, setItemId] = useState();
  const dispatch = useDispatch();

  const { data: menuRes, isLoading: isMenuLoading } = useQuery({
    queryKey: ["menus"],
    queryFn: getMenus,
  });

  const { data: itemRes, isLoading: isItemLoading } = useQuery({
    queryKey: ["items"],
    queryFn: getItems,
  });

  const menus = menuRes?.data?.data || [];
  const items = itemRes?.data?.data || [];

  useEffect(() => {
    if (menus.length > 0 && !selected) {
      setSelected(menus[0]);
    }
  }, [menus, selected]);

  const increment = (id) => {
    setItemId(id);
    if (itemCount >= 4) return;
    setItemCount((prev) => prev + 1);
  };

  const decrement = (id) => {
    setItemId(id);
    if (itemCount <= 0) return;
    setItemCount((prev) => prev - 1);
  };

  const handleAddToCart = (item) => {
    if (itemCount === 0) return;

    const { name, price } = item;
    const newObj = {
      id: Date.now(),
      name,
      pricePerQuantity: price,
      quantity: itemCount,
      price: price * itemCount,
      itemId: item._id,
    };

    dispatch(addItems(newObj));
    setItemCount(0);
  };

  if (isMenuLoading || isItemLoading) {
    return <div className="text-white p-10">Loading menu data...</div>;
  }

  const categoryItems = items.filter(
    (item) => String(item.category) === String(selected?._id)
  );

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 px-4 sm:px-10 py-4 w-full">
        {menus.map((menu) => {
          const menuItemsCount = items.filter(
            (item) => String(item.category) === String(menu._id)
          ).length;

          return (
            <div
              key={menu._id}
              className="flex flex-col items-start justify-between p-4 rounded-lg h-[100px] cursor-pointer"
              style={{ backgroundColor: menu.bgColor }}
              onClick={() => {
                setSelected(menu);
                setItemId(0);
                setItemCount(0);
              }}
            >
              <div className="flex items-center justify-between w-full">
                <h1 className="text-[#f5f5f5] text-lg font-semibold">
                  {menu.icon} {menu.name}
                </h1>
                {selected?._id === menu._id && (
                  <GrRadialSelected className="text-white" size={20} />
                )}
              </div>
              <p className="text-[#ababab] text-sm font-semibold">
                {menuItemsCount} Items
              </p>
            </div>
          );
        })}
      </div>

      <hr className="border-[#2a2a2a] border-t-2 mt-4" />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 sm:px-10 py-4 w-full">
        {categoryItems.length === 0 && (
           <p className="text-[#ababab] px-4">No items found for this category.</p>
        )}
        {categoryItems.map((item) => {
          return (
            <div
              key={item._id}
              className="flex flex-col items-start justify-between p-4 rounded-lg h-[150px] cursor-pointer hover:bg-[#2a2a2a] bg-[#1a1a1a]"
            >
              <div className="flex items-start justify-between w-full">
                <h1 className="text-[#f5f5f5] text-lg font-semibold">
                  {item.name}
                </h1>
                <button
                  onClick={() => handleAddToCart(item)}
                  className="bg-[#2e4a40] text-[#02ca3a] p-2 rounded-lg"
                >
                  <FaShoppingCart size={20} />
                </button>
              </div>
              <div className="flex items-center justify-between w-full">
                <p className="text-[#f5f5f5] text-xl font-bold">
                  ${item.price}
                </p>
                <div className="flex items-center justify-between bg-[#1f1f1f] px-2 sm:px-4 py-2 sm:py-3 rounded-lg gap-2 sm:gap-6 w-[60%] sm:w-[50%]">
                  <button
                    onClick={() => decrement(item._id)}
                    className="text-yellow-500 text-2xl"
                  >
                    &minus;
                  </button>
                  <span className="text-white">
                    {itemId === item._id ? itemCount : "0"}
                  </span>
                  <button
                    onClick={() => increment(item._id)}
                    className="text-yellow-500 text-2xl"
                  >
                    &#43;
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default MenuContainer;
