import React from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { axiosInstance } from "../features/axios.js"
import { login, logout } from '../features/authSlice.js'
import { useState } from 'react'
import VideoComponent from '../components/VideoComponent.jsx'
import { useHMSActions } from '@100mslive/react-sdk'
import { unsetHMSRoomId, unsetRoomId } from '../features/roomSlice.js'
import { socket } from '../features/clientSocket.js'

function MainLayout() {

  const isLogged = useSelector((state) => (state.auth.isLoggedIn))
  const [isRefreshing, setIsRefreshing] = useState(true);
  const dispatch = useDispatch();
  const roomId = useSelector((state) => state.room.roomId);
  const hmsActions = useHMSActions();

  useEffect(() => {
    const refresh = async () => {
      try {
        const res = await axiosInstance.post("/user/refresh");
        dispatch(login(res.data));
      } catch (err) {
        if (err?.response?.status === 401) {
          dispatch(logout());
        } else {
          console.error("Unexpected refresh error:", err.response?.data || err.message);
        }
      } finally {
        setIsRefreshing(false);
      }
    };

    refresh();
  }, []);






  useEffect(() => {
    socket.on("force-disconnect", async ({ message }) => {
      try {
        await hmsActions.leave();
        await axiosInstance.post("/room/leaveroom", { roomId });
        socket.disconnect();
        dispatch(unsetRoomId());
        dispatch(unsetHMSRoomId())
      } catch (err) {
        console.error("Force disconnect cleanup failed:", err);
      }
    });

    return () => {
      socket.off("force-disconnect");
    };
  }, [roomId]);


  if (isRefreshing) {
    return (
      <div className="h-screen w-screen bg-black text-white flex items-center justify-center">
        <h1 className="text-2xl">Loading...</h1>
      </div>
    );
  }
  return (
    <div className='flex h-screen w-screen overflow-hidden'>
      <Sidebar />
      <div className='w-full flex flex-col'>
        <Header />
        <VideoComponent />
      </div>

    </div>

  )
}

export default MainLayout
