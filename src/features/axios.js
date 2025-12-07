import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://chadcam-backend.vercel.app/api",
    withCredentials: true,
    
})
