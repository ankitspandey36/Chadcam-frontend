import React, { useEffect } from 'react';
import { LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { logout } from "../features/authSlice.js"
import { useDispatch, useSelector } from 'react-redux';
import { axiosInstance } from '../features/axios';
import { useNavigate } from 'react-router-dom';
import { useHMSActions } from "@100mslive/react-sdk";
import { NavLink } from 'react-router-dom';
import { unsetRoomId, unsetHMSRoomId } from '../features/roomSlice.js';
import { socket } from '../features/clientSocket.js';

function Header() {
  const hmsActions = useHMSActions();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const lroomId = useSelector(state => state.room.roomId);

  const navigate = useNavigate();

  const logoutClick = async () => {
    if (lroomId) {
      await hmsActions.leave()
      dispatch(unsetRoomId());
      dispatch(unsetHMSRoomId())
      // console.log(lroomId);

      await axiosInstance.post('/room/leaveroom', { roomId: lroomId })
      socket.disconnect()

    }


    await axiosInstance.post("/user/logout");
    dispatch(logout());
    navigate('/');
  }

  const leaveRoom = async () => {
    try {
      await hmsActions.leave();
      const roomId = localStorage.getItem("previd");
      dispatch(unsetRoomId());
      dispatch(unsetHMSRoomId());
      localStorage.removeItem("previd")
      await axiosInstance.post('/room/leaveroom', { roomId })
      socket.disconnect()


    } catch (error) {
      console.log('Leave Error: ', error);
    }

  }

  return (
    <div className="w-full min-h-[4.5rem] sm:h-[10.4%] bg-[#121212] text-[#E0E0E0] shadow-md px-4 py-3 flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-3 md:gap-4">
      {isLoggedIn && (
        <nav className="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-3">
          <NavLink
            to="/feedback"
            className="text-xs sm:text-sm font-medium px-2 py-1 rounded hover:bg-gray-700"
          >
            Feedback
          </NavLink>

          <Link to="/changepassword">
            <button className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm bg-[#1E1E2F] hover:bg-[#444] rounded-lg shadow">
              Change Password
            </button>
          </Link>

          <Link to="/updatedetails">
            <button className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm bg-[#1E1E2F] hover:bg-[#444] rounded-lg shadow">
              Update Details
            </button>
          </Link>

          <button
            onClick={leaveRoom}
            className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm bg-red-600 hover:bg-red-700 rounded-lg shadow"
          >
            Stop
          </button>

          <button
            onClick={logoutClick}
            className="h-9 w-9 sm:h-10 sm:w-10 bg-[#1E1E2F] hover:bg-[#444] flex items-center justify-center rounded-full"
            aria-label="Logout"
          >
            <LogOut size={18} />
          </button>
        </nav>
      )}
    </div>


  );
}

export default Header;
