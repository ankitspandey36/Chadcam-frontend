
import { io } from "socket.io-client"



export const socket = io("https://chadcam-backend.vercel.app", {

    autoConnect: false
})
