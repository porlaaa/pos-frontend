import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteItem, updateItem } from "../../https";
import { enqueueSnackbar } from "notistack";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { BiSolidDish } from "react-icons/bi";

const ItemCard = ({ item }) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [editPrice, setEditPrice] = useState(item.price);

  const deleteMutation = useMutation({
    mutationFn: () => deleteItem(item._id),
    onSuccess: () => {
      enqueueSnackbar("Deleted successfully", { variant: "success" });
      queryClient.invalidateQueries(["items"]);
    },
    onError: () => {
      enqueueSnackbar("Delete failed", { variant: "error" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => updateItem(item._id, data),
    onSuccess: () => {
      enqueueSnackbar("Updated successfully", { variant: "success" });
      setIsEditing(false);
      queryClient.invalidateQueries(["items"]);
    },
    onError: () => {
      enqueueSnackbar("Update failed", { variant: "error" });
    },
  });

  const handleDelete = () => {
    if (!window.confirm("Delete this item?")) return;
    deleteMutation.mutate();
  };

  const handleUpdate = () => {
    if (!editName || !editPrice) {
      enqueueSnackbar("Please fill all fields", { variant: "warning" });
      return;
    }
    updateMutation.mutate({ name: editName, price: Number(editPrice) });
  };

  return (
    <div className="bg-[#222222] p-4 rounded-xl flex justify-between items-center border border-[#2a2a2a] hover:-translate-y-1 hover:shadow-lg hover:border-[#f6b100]/50 transition-all duration-300">
      <div className="flex items-center gap-4 w-full mr-2">
        <div className="bg-[#2c2c2c] p-3 rounded-lg text-gray-400">
          <BiSolidDish size={24} />
        </div>
        {isEditing ? (
          <div className="flex flex-col gap-2 flex-1">
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="bg-[#1a1a1a] text-white px-2 py-1 rounded border border-[#333] w-full focus:outline-none focus:border-[#f6b100]"
              placeholder="Item Name"
            />
            <input
              value={editPrice}
              type="number"
              onChange={(e) => setEditPrice(e.target.value)}
              className="bg-[#1a1a1a] text-white px-2 py-1 rounded border border-[#333] w-full focus:outline-none focus:border-[#f6b100]"
              placeholder="Price"
            />
          </div>
        ) : (
          <div className="flex-1">
            <h1 className="text-white font-semibold text-lg truncate">{item.name}</h1>
            <p className="text-[#f6b100] font-bold">${item.price}</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {isEditing ? (
          <>
            <button
              onClick={handleUpdate}
              disabled={updateMutation.isLoading}
              className="text-green-500 hover:bg-green-500/10 p-2 rounded-lg transition-colors duration-200"
            >
              <FaCheck size={18} />
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditName(item.name);
                setEditPrice(item.price);
              }}
              className="text-gray-500 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors duration-200"
            >
              <FaTimes size={18} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 p-2 rounded-lg transition-colors duration-200"
            >
              <FaEdit size={18} />
            </button>
            <button
              onClick={handleDelete}
              className="text-gray-500 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors duration-200"
            >
              <FaTrash size={18} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ItemCard;