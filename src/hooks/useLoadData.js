import { useDispatch } from "react-redux";
import { getUserData } from "../https";
import { useEffect, useState } from "react";
import { removeUser, setUser } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

const useLoadData = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      // ✅ เช็ค token ก่อน
      const token = localStorage.getItem("accessToken");
      if (!token) {
        dispatch(removeUser());
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await getUserData();
        console.log(data);
        const { _id, name, email, phone, role } = data.data;
        dispatch(setUser({ _id, name, email, phone, role }));
      } catch (error) {
        dispatch(removeUser());
        navigate("/auth"); // ✅ แก้จาก Navigate เป็น navigate
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [dispatch, navigate]);

  return isLoading;
};

export default useLoadData;