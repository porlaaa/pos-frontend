import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteItem } from "../../https";
import { enqueueSnackbar } from "notistack";
import { FaTrash } from "react-icons/fa";

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
    <div className="bg-[#1a1a1a] p-4 rounded-lg flex justify-between items-center">
      <div>
        <h1 className="text-white font-semibold">{item.name}</h1>
        <p className="text-gray-400">₹{item.price}</p>
      </div>

      <button
        onClick={handleDelete}
        className="bg-red-500 hover:bg-red-600 p-2 rounded-lg"
      >
        <FaTrash className="text-white" />
      </button>
    </div>
  );
};

export default ItemCard;