const useLoadData = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      // ✅ เช็ค token ก่อน ถ้าไม่มีก็ไม่ต้อง fetch
      const token = localStorage.getItem("accessToken");
      if (!token) {
        dispatch(removeUser());
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await getUserData();
        const { _id, name, email, phone, role } = data.data;
        dispatch(setUser({ _id, name, email, phone, role }));
      } catch (error) {
        dispatch(removeUser());
        navigate("/auth"); // ✅ แก้จาก Navigate เป็น navigate ด้วย
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [dispatch, navigate]);

  return isLoading;
};