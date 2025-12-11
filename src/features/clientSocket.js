
import { io } from "socket.io-client"



export const socket = io("https://chadcam-backend.onrender.com", {

    autoConnect: false
})
