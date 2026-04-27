import axios from "axios";

const defaultHeader = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

export const axiosWrapper = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: { ...defaultHeader },
});

axiosWrapper.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  
  // เช็คใน Console ว่าบรรทัดนี้ขึ้นไหม
  console.log("Checking token in Interceptor:", token); 

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Authorization Header attached!"); 
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});