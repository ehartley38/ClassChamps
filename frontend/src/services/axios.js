import axios from "axios";
//const BASE_URL = "https://classchamps-api.onrender.com/api";
const BASE_URL = "http://localhost:3003/api";

export default axios.create({
  baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
