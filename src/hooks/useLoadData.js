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
      const token = localStorage.getItem("accessToken");
      if (!token) {
        dispatch(removeUser());
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await getUserData();
        const userData = data.data || data;
        const { _id, name, email, phone, role } = userData;

        dispatch(setUser({ _id, name, email, phone, role }));
      } catch (error) {
        console.log("Error loading data:", error);
        dispatch(removeUser());
        
        // แก้เป็นตัวเล็ก navigate ตามที่ประกาศไว้ข้างบน
        if (window.location.pathname !== "/auth") {
          navigate("/auth"); 
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [dispatch, navigate]);

  return isLoading;
};

export default useLoadData;