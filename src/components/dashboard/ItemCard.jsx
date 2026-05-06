import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteItem } from "../../https";
import { enqueueSnackbar } from "notistack";
import { FaTrash } from "react-icons/fa";
import { BiSolidDish } from "react-icons/bi";

const ItemCard = ({ item }) => {
  const queryClient = useQueryClient();

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

  const handleDelete = () => {
    if (!window.confirm("Delete this item?")) return;
    deleteMutation.mutate();
  };

  return (
    <div className="bg-[#222222] p-4 rounded-xl flex justify-between items-center border border-[#2a2a2a] hover:-translate-y-1 hover:shadow-lg hover:border-[#f6b100]/50 transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className="bg-[#2c2c2c] p-3 rounded-lg text-gray-400">
          <BiSolidDish size={24} />
        </div>
        <div>
          <h1 className="text-white font-semibold text-lg">{item.name}</h1>
          <p className="text-[#f6b100] font-bold">${item.price}</p>
        </div>
      </div>

      <button
        onClick={handleDelete}
        className="text-gray-500 hover:text-red-500 hover:bg-red-500/10 p-3 rounded-lg transition-colors duration-200"
      >
        <FaTrash size={18} />
      </button>
    </div>
  );
};

export default ItemCard;