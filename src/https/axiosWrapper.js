import axios from "axios";

const defaultHeader = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

const baseURL = import.meta.env.PROD
  ? ""
  : import.meta.env.VITE_BACKEND_URL;

export const axiosWrapper = axios.create({
  baseURL,
  withCredentials: true,
  headers: { ...defaultHeader },
});