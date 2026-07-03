import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMenu, updateMenu } from "../../https";
import { enqueueSnackbar } from "notistack";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import { isValidImageUrl, normalizeImageUrl } from "../../utils";

const CategoryCard = ({ menu }) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(menu.name);
  const [editImage, setEditImage] = useState(menu.image || "");
  const [imageError, setImageError] = useState(false);

  const imageUrl = isValidImageUrl(menu.image) ? menu.image.trim() : "";
  const showImage = imageUrl && !imageError;

  useEffect(() => {
    setEditName(menu.name);
    setEditImage(menu.image || "");
    setImageError(false);
  }, [menu]);

  const deleteMutation = useMutation({
    mutationFn: () => deleteMenu(menu._id),
    onSuccess: () => {
      enqueueSnackbar("Category deleted successfully", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
    onError: () => {
      enqueueSnackbar("Delete failed", { variant: "error" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => updateMenu(menu._id, data),
    onSuccess: () => {
      enqueueSnackbar("Category updated successfully", { variant: "success" });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
    onError: () => {
      enqueueSnackbar("Update failed", { variant: "error" });
    },
  });

  const handleDelete = () => {
    if (!window.confirm(`Delete category "${menu.name}" and all its items?`)) return;
    deleteMutation.mutate();
  };

  const handleUpdate = () => {
    if (!editName) {
      enqueueSnackbar("Please enter a category name", { variant: "warning" });
      return;
    }

    const image = normalizeImageUrl(editImage);
    if (editImage.trim() && !image) {
      enqueueSnackbar("Image URL must start with http:// or https://", {
        variant: "warning",
      });
      return;
    }

    updateMutation.mutate({
      name: editName,
      image,
    });
  };

  return (
    <div className="flex items-center justify-between mb-6 bg-[#222222] p-4 rounded-xl border border-[#2a2a2a] hover:border-[#f6b100]/50 transition-all duration-300">
      <div className="flex items-center gap-4 w-full mr-2">
        <div className="w-16 h-16 rounded-lg bg-[#2c2c2c] flex items-center justify-center text-3xl shadow-lg overflow-hidden shrink-0 text-gray-400">
          {showImage ? (
            <img 
              src={imageUrl} 
              alt={menu.name} 
              className="w-full h-full object-cover" 
              onError={() => setImageError(true)}
            />
          ) : (
            <MdCategory size={32} />
          )}
        </div>
        
        {isEditing ? (
          <div className="flex flex-col gap-2 flex-1">
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="bg-[#1a1a1a] text-white px-3 py-2 rounded border border-[#333] w-full focus:outline-none focus:border-[#f6b100]"
              placeholder="Category Name"
            />
            <input
              value={editImage}
              onChange={(e) => setEditImage(e.target.value)}
              className="bg-[#1a1a1a] text-white px-3 py-2 rounded border border-[#333] w-full focus:outline-none focus:border-[#f6b100]"
              placeholder="Image URL (https://...)"
            />
          </div>
        ) : (
          <h3 className="text-white text-2xl font-bold tracking-wide flex-1">
            {menu.name}
          </h3>
        )}
      </div>

      <div className="flex items-center gap-2">
        {isEditing ? (
          <>
            <button
              onClick={handleUpdate}
              disabled={updateMutation.isLoading}
              className="text-green-500 hover:bg-green-500/10 p-3 rounded-lg transition-colors duration-200"
              title="Save"
            >
              <FaCheck size={20} />
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditName(menu.name);
                setEditImage(menu.image || "");
              }}
              className="text-gray-500 hover:text-red-500 hover:bg-red-500/10 p-3 rounded-lg transition-colors duration-200"
              title="Cancel"
            >
              <FaTimes size={20} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 p-3 rounded-lg transition-colors duration-200"
              title="Edit Category"
            >
              <FaEdit size={20} />
            </button>
            <button
              onClick={handleDelete}
              className="text-gray-500 hover:text-red-500 hover:bg-red-500/10 p-3 rounded-lg transition-colors duration-200"
              title="Delete Category"
            >
              <FaTrash size={20} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryCard;
