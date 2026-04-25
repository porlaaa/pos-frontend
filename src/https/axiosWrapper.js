import axios from "axios";

const defaultHeader = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

export const axiosWrapper = axios.create({
  baseURL: "https://finalprojectpos.online",
  withCredentials: true,
  headers: { ...defaultHeader },
});
