import React, { useEffect, useState } from 'react';
import { axiosInstance } from "../features/axios.js";
import { useSelector } from "react-redux";
import { MoveRight } from "lucide-react";
import { Lock } from 'lucide-react';
import VideoBox from './VideoBox.jsx';
import { setRoomId, unsetRoomId, setHMSRoomId, unsetHMSRoomId } from '../features/roomSlice.js';
import { useDispatch } from 'react-redux';

import { socket } from '../features/clientSocket.js';
import { Link } from 'react-router-dom';
import {
    useHMSActions,
    useHMSStore,
    selectPeers,
    HMSRoomState,
    selectRoomState
} from "@100mslive/react-sdk";

function VideoComponent() {
    const tags = useSelector((state) => state.tags.tags);
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const [user, setUser] = useState(null);
    const hmsActions = useHMSActions();
    const dispatch = useDispatch();
    const peers = useHMSStore(selectPeers);
    const roomState = useHMSStore(selectRoomState);
    const isJoined = roomState === HMSRoomState.Connected;

    // peers = ["1", "2"]


    useEffect(() => {
        if (!isLoggedIn) return
            ; (async () => {
                try {
                    const res = await axiosInstance.get("/user/me");
                    setUser(res.data.data);
                } catch (err) {
                    console.error("Error getting user info:", err);
                    setUser(null);
                }
            })();
    }, []);


    const handleStart = async () => {
        if (!user) return;

        try {
            const prevId = localStorage.getItem("previd");

            if (!isJoined) {
                const roomJoined = await axiosInstance.post('/room/joinroom', { tags });
                if (!socket.connected) {
                    socket.connect();
                    socket.emit("new-user-joined", user)
                }
                dispatch(setRoomId(roomJoined.data.data._id))
                dispatch(setHMSRoomId(roomJoined.data.data.hmsRoomId))
                const roomCode = roomJoined.data.data.roomCode;
                const authToken = await hmsActions.getAuthTokenByRoomCode({ roomCode });
                await hmsActions.join({
                    userName: "Guest",
                    authToken,
                    settings: {
                        isAudioMuted: false,
                        isVideoMuted: false,
                    },
                });

                await hmsActions.changeMetadata(
                    JSON.stringify({
                        userId: user._id,
                        status: user.status,
                        email: user.email,
                        avatar: user.avatar
                    })
                );

                // console.log("userid", user._id);

                localStorage.setItem("previd", roomJoined.data.data._id);

            } else {

                await hmsActions.leave();
                if (prevId) {
                    await axiosInstance.post('/room/leaveroom', { roomId: prevId });
                    dispatch(unsetRoomId())
                    dispatch(unsetHMSRoomId())
                    localStorage.removeItem("previd");
                }
                socket.disconnect()

                const roomJoined = await axiosInstance.post('/room/joinroom', { tags });
                if (!socket.connected) {
                    socket.connect();
                    socket.emit("new-user-joined", user)
                }
                dispatch(setRoomId(roomJoined.data.data._id))
                dispatch(setHMSRoomId(roomJoined.data.data.hmsRoomId))

                const roomCode = roomJoined.data.data.roomCode;
                const authToken = await hmsActions.getAuthTokenByRoomCode({ roomCode });


                await hmsActions.join({
                    userName: "Guest",
                    authToken,
                    settings: {
                        isAudioMuted: false,
                        isVideoMuted: false,
                    },
                });
                await hmsActions.changeMetadata(
                    JSON.stringify({
                        userId: user._id,
                        status: user.status,
                        email: user.email,
                        avatar: user.avatar

                    })
                );
                // console.log("userid", user._id);

                localStorage.setItem("previd", roomJoined.data.data._id);
            }



        } catch (error) {
            console.error("Error starting video room:", error);
        }
    };


    if (!isLoggedIn) {
        return (
            <div className="w-full h-[89.6%] bg-[#121212] flex flex-col items-center justify-center text-white px-6">
                <div className="flex flex-col items-center text-center space-y-4">
                    <Lock size={64} className="text-red-500 animate-pulse" />
                    <p className="text-gray-400 max-w-md text-lg">
                        Please log in to join or start a video room. Your sessions and interactions are private and secure.
                    </p>
                    {!isLoggedIn && (
                        <div className="flex h-full justify-center flex-wrap items-center">
                            <Link to="/login">
                                <button
                                    className="flex justify-center items-center px-6 py-3 bg-[#2a2a2a] hover:bg-[#383838] text-lg font-medium rounded-3xl transition duration-200"
                                >
                                    Login To Start
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-[#181818] relative overflow-hidden">

            {peers.length === 0 && (
                <div className="w-full h-full flex justify-center items-center text-white">
                    Waiting to start...
                </div>
            )}


            {/* Small screens  */}
            <div className=" md:hidden w-full h-full grid grid-cols-1 auto-rows-fr">
                {peers.map(peer => (
                    <div key={peer.id} className="w-full h-full">
                        <VideoBox peer={peer} />
                    </div>
                ))}
            </div>


            {/* Medium and above */}
            <div className="hidden md:block w-full h-full">
                {peers.length === 1 && (
                    <div className="w-full h-full flex justify-center items-center">
                        <div className="w-full h-full">
                            <VideoBox peer={peers[0]} />
                        </div>
                    </div>
                )}

                {peers.length === 2 && (
                    <div className="flex w-full h-full">
                        <div className="w-1/2 h-full">
                            <VideoBox peer={peers[0]} />
                        </div>
                        <div className="w-1/2 h-full">
                            <VideoBox peer={peers[1]} />
                        </div>
                    </div>
                )}

                {peers.length === 3 && (
                    <div className="flex w-full h-full">
                        <div className="w-1/3 h-full">
                            <VideoBox peer={peers[0]} />
                        </div>
                        <div className="w-1/3 h-full">
                            <VideoBox peer={peers[1]} />
                        </div>
                        <div className="w-1/3 h-full">
                            <VideoBox peer={peers[2]} />
                        </div>
                    </div>
                )}

                {peers.length === 4 && (
                    <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
                        {peers.map(peer => (
                            <div key={peer.id} className="w-full h-full">
                                <VideoBox peer={peer} />
                            </div>
                        ))}
                    </div>
                )}

                {peers.length === 5 && (
                    <div className="w-full h-full flex flex-col">
                        <div className="flex flex-1">
                            <div className="w-1/3 h-full">
                                <VideoBox peer={peers[0]} />
                            </div>
                            <div className="w-1/3 h-full">
                                <VideoBox peer={peers[1]} />
                            </div>
                            <div className="w-1/3 h-full">
                                <VideoBox peer={peers[2]} />
                            </div>
                        </div>
                        <div className="flex flex-1">
                            <div className="w-1/2 h-full">
                                <VideoBox peer={peers[3]} />
                            </div>
                            <div className="w-1/2 h-full">
                                <VideoBox peer={peers[4]} />
                            </div>
                        </div>
                    </div>
                )}


            </div>

            <button
                onClick={handleStart}
                className="text-white text-xl md:text-3xl bg-green-500 px-6 py-3 md:p-5 absolute bottom-4 right-4 hover:bg-green-600 rounded-3xl z-10"
            >
                <MoveRight />
            </button>
        </div>
    );

}

export default VideoComponent;
