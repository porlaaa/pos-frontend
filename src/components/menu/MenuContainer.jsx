import React, { useState, useEffect, useMemo } from "react";
import { GrRadialSelected } from "react-icons/gr";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addItems } from "../../redux/slices/cartSlice";
import { useQuery } from "@tanstack/react-query";
import { getMenus, getItems } from "../../https";
import { formatCurrency, isValidImageUrl } from "../../utils";

const MenuContainer = () => {
  const [selected, setSelected] = useState(null);
  const [itemCount, setItemCount] = useState(0);
  const [itemId, setItemId] = useState(null);
  const dispatch = useDispatch();

  const { data: menuRes, isLoading: isMenuLoading } = useQuery({
    queryKey: ["menus"],
    queryFn: getMenus,
  });

  const { data: itemRes, isLoading: isItemLoading } = useQuery({
    queryKey: ["items"],
    queryFn: getItems,
  });

  const menus = useMemo(() => menuRes?.data?.data || [], [menuRes]);
  const items = useMemo(() => itemRes?.data?.data || [], [itemRes]);

  const getCategoryId = (category) =>
    typeof category === "object" && category !== null ? category._id : category;

  const getMenuItemsCount = (menuId) =>
    items.filter((item) => String(getCategoryId(item.category)) === String(menuId)).length;

  useEffect(() => {
    if (menus.length === 0) {
      setSelected(null);
      return;
    }

    if (!selected || !menus.some((menu) => menu._id === selected._id)) {
      setSelected(menus[0]);
    }
  }, [menus, selected]);

  const increment = (id) => {
    setItemId(id);
    setItemCount((prev) => (itemId === id ? Math.min(prev + 1, 4) : 1));
  };

  const decrement = (id) => {
    if (itemId !== id) {
      setItemId(id);
      setItemCount(0);
      return;
    }

    setItemCount((prev) => Math.max(prev - 1, 0));
  };

  const handleAddToCart = (item) => {
    if (itemId !== item._id || itemCount === 0) return;

    dispatch(
      addItems({
        itemId: item._id,
        name: item.name,
        price: item.price,
        quantity: itemCount,
      })
    );

    setItemCount(0);
    setItemId(null);
  };

  if (isMenuLoading || isItemLoading) {
    return <div className="text-white p-10">Loading menu data...</div>;
  }

  const categoryItems = items.filter(
    (item) => String(getCategoryId(item.category)) === String(selected?._id)
  );

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 px-4 sm:px-10 py-4 w-full">
        {menus.map((menu) => {
          const menuItemsCount = getMenuItemsCount(menu._id);

          return (
            <div
              key={menu._id}
              className="flex flex-col items-start justify-between p-4 rounded-lg h-[100px] cursor-pointer hover:bg-[#2a2a2a] bg-[#1a1a1a] relative overflow-hidden border border-[#2a2a2a]"
              onClick={() => {
                setSelected(menu);
                setItemId(null);
                setItemCount(0);
              }}
            >
              {isValidImageUrl(menu.image) && (
                <div className="absolute inset-0 w-full h-full opacity-30 pointer-events-none">
                  <img
                    src={menu.image.trim()}
                    alt={menu.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex items-center justify-between w-full relative z-10">
                <h1 className="text-[#f5f5f5] text-lg font-bold drop-shadow-md">
                  {menu.name}
                </h1>
                {selected?._id === menu._id && (
                  <GrRadialSelected className="text-white" size={20} />
                )}
              </div>
              <p className="text-[#ababab] text-sm font-semibold relative z-10">
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
        {categoryItems.map((item) => (
          <div
            key={item._id}
            className="flex flex-col items-start justify-between p-4 rounded-lg h-[150px] cursor-pointer hover:bg-[#2a2a2a] bg-[#1a1a1a] relative overflow-hidden"
          >
            {isValidImageUrl(item.image) && (
              <div className="absolute inset-0 w-full h-full opacity-30 pointer-events-none">
                <img
                  src={item.image.trim()}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex items-start justify-between w-full relative z-10">
              <h1 className="text-[#f5f5f5] text-lg font-bold drop-shadow-md">
                {item.name}
              </h1>
              <button
                onClick={() => handleAddToCart(item)}
                className="bg-[#2e4a40] text-[#02ca3a] p-2 rounded-lg"
              >
                <FaShoppingCart size={20} />
              </button>
            </div>
            <div className="flex items-center justify-between w-full relative z-10">
              <p className="text-[#f5f5f5] text-xl font-bold drop-shadow-md">
                {formatCurrency(item.price)}
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
        ))}
      </div>
    </>
  );
};

export default MenuContainer;
