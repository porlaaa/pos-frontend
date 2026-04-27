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
      // 1. เช็คก่อนว่ามี Token ไหม ถ้าไม่มีไม่ต้องยิง API ให้เสียเที่ยว
      const token = localStorage.getItem("accessToken");
      if (!token) {
        dispatch(removeUser());
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await getUserData();
        console.log("User data:", data);

        // 2. เช็คโครงสร้างข้อมูล (บาง Backend ส่ง data ตรงๆ บางอันส่ง data.data)
        const userData = data.data || data;
        const { _id, name, email, phone, role } = userData;

        dispatch(setUser({ _id, name, email, phone, role }));
      } catch (error) {
        console.log("Error loading data:", error);
        dispatch(removeUser());

        // 3. แก้จาก Navigate เป็น navigate (n ตัวเล็ก)
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