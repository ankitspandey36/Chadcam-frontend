import React, { useEffect, useState } from 'react';
import { useVideo } from "@100mslive/react-sdk";
import { Flag } from 'lucide-react';
import { axiosInstance } from "../features/axios.js"
import { useSelector } from "react-redux"
import ReportComponent from './ReportComponent.jsx';
import { selectVideoTrackByPeerID, useHMSStore } from "@100mslive/react-sdk";

function VideoBox({ peer }) {


  const { videoRef } = useVideo({ trackId: peer.videoTrack });
  const [hovered, setHovered] = useState(false);
  const [report, setReport] = useState(false);
  let isSingle = false;
  let userId = null;
  let email = "Guest"
  let avatar = null

  try {
    const metadata = JSON.parse(peer.metadata || "{}");
    isSingle = metadata.status === true;
    userId = metadata.userId;
    email = metadata.email;
    avatar = metadata.avatar;
  } catch {
    isSingle = false;
  }
  const displayName = email?.includes("@") ? email.split("@")[0] : email || "Guest";

  // console.log("Raw Metadata:", peer.metadata);

  // console.log("Peer:", peer.name, "| Metadata UserID:", userId, "| Single:", isSingle);


  const videoTrack = useHMSStore(selectVideoTrackByPeerID(peer.id));
  const isVideoOn = videoTrack?.enabled;

  console.log(avatar);
  console.log(isVideoOn);






  return (
    <div
      className="w-full h-full relative overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >

      {report && (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg w-11/12 max-w-sm">
            <ReportComponent onClose={() => setReport(false)} reportedTo={userId} />
          </div>
        </div>
      )}


      {isSingle && (
        <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full z-10 shadow-md" />
      )}


      {isVideoOn ? (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted={peer.isLocal}
          playsInline
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-black text-white">
          {avatar ? (
            <img
              src={avatar}
              alt={displayName}
              className="rounded-full w-24 h-24 object-cover"
            />
          ) : (
            <span className="text-xl font-semibold">{displayName}</span>
          )}
        </div>
      )}

      {(hovered && !peer.isLocal) && (
        <div className="absolute inset-0 bg-black  transition-all duration-200  pointer-events-none z-0"></div>
      )}

      {/* Peer Name */}
      <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded z-10">
        {peer.isLocal ? "(You)" : displayName}
      </div>


      {/* report */}
      {(hovered && !peer.isLocal) && (
        <div className="absolute inset-0 flex justify-center items-center z-10">
          <button
            onClick={() => setReport(true)}
            className="bg-red-600 text-white px-3 py-1 rounded-full flex items-center gap-1 text-xs hover:bg-red-700 transition"
          >
            <Flag size={12} /> Report
          </button>
        </div>
      )}
    </div>
  );
}

export default VideoBox;
