import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://chadcam-backend.onrender.com/api",
    withCredentials: true,
    
})
