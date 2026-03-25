import axios from "axios";

const API = axios.create({
  baseURL: "https://wellness-tracker-backend-4if1.onrender.com/api",
});

export default API;
