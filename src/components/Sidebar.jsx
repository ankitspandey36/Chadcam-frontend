import React, { useEffect, useState } from 'react';
import logo from '../Photos/logo.png';
import { LogOut, SendHorizonal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import TagComponent from './TagComponent';
import MessageComponent from './MessageComponent';
import { Image } from "lucide-react";
import { axiosInstance } from '../features/axios';
import { socket } from '../features/clientSocket';
import RulesSection from './Rules';

function Sidebar() {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [textMessage, setTextMessage] = useState("");
  const [images, setImages] = useState(null);
  const roomId = useSelector((state) => state.room.roomId);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) return;
    (async () => {
      try {
        const res = await axiosInstance.get("/user/me");
        setUser(res.data.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    })();
  }, [isLoggedIn]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!user) return;

    if (images) {
      const formData = new FormData();
      formData.append("image", images);
      formData.append("roomId", roomId);

      try {
        const res = await axiosInstance.post("/message/sendmessage", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const imageMsg = res.data.data;

        const msgObj = {
          _id: imageMsg._id,
          image: imageMsg.image,
          msgType: imageMsg.msgType,
          senderId: {
            _id: user._id,
            email: user.email
          }
        };

        socket.emit("message", msgObj);
        setImages(null);

      } catch (err) {
        console.error("Error uploading image:", err);
      }

    } else if (textMessage.trim()) {
      await axiosInstance.post("/message/sendmessage", { message: textMessage, roomId });

      const msgObj = {
        _id: Date.now(),
        message: textMessage,
        senderId: {
          _id: user._id,
          email: user.email
        }
      };

      socket.emit("message", msgObj);
      setTextMessage("");
    }
  };

  return (
    <div className="h-screen w-[25%] bg-[#121212] text-white flex flex-col border-r border-[#7DD3FC] hidden sm:flex">

      <div className="flex items-center justify-center gap-3 pt-3 pb-2 w-full">
        <img
          src={logo}
          alt="Chadcam*"
          className="h-[2.5em] w-[2.5em] rounded-2xl"
        />
        <h1 className="md:text-lg lg:text-2xl font-bold hidden md:block">Chadcam</h1>
      </div>

      {isLoggedIn ? (
        <div className="flex flex-col flex-1 relative">

          <div className="h-[40%] flex flex-col">
            <TagComponent />
          </div>

          <div className="h-[60%] flex flex-col">
            {roomId && (
              <div className="h-[60%] flex flex-col">
                {/* Scrollable message list only */}
                <div className="flex-1 overflow-y-auto scrollbar-hide">
                  <MessageComponent />
                </div>

                <div className="bg-[#303030] h-13 rounded-t-3xl shadow-inner flex-shrink-0 w-full">
                  <form
                    className="flex h-full items-center gap-3 relative px-2"
                    onSubmit={handleSendMessage}
                  >
                    {images && (
                      <div className="relative p-2 rounded shadow-md flex items-center w-[90%]">
                        <img
                          src={URL.createObjectURL(images)}
                          alt="preview"
                          className="max-h-[60px] max-w-[100%] object-contain rounded"
                        />
                        <button
                          type="button"
                          onClick={() => setImages(null)}
                          className="absolute top-0 right-0 bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                          aria-label="Remove image"
                        >
                          ✕
                        </button>
                      </div>
                    )}

                    <input
                      type="text"
                      placeholder="Type Message"
                      value={textMessage}
                      onChange={(e) => setTextMessage(e.target.value)}
                      className={`bg-black text-white w-full h-full px-4 text-lg rounded outline-none focus:ring-blue-500 focus:ring-2 pr-24 ${images ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={!!images}
                    />

                    <div className="absolute right-1 flex items-center gap-2">
                      <label htmlFor="imgMessage" className="bg-gray-700 rounded-full p-2 cursor-pointer hover:bg-gray-600 transition">
                        <Image className="w-4 h-4 text-white" />
                      </label>
                      <input
                        id="imgMessage"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files.length > 0) {
                            setImages(e.target.files[0]);
                          }
                        }}
                        className="hidden"
                      />
                      <button
                        type="submit"
                        aria-label="Send message"
                        className="bg-gray-700 rounded-full p-2 hover:bg-gray-600 transition"
                      >
                        <SendHorizonal className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        </div>
      ) : (
        <RulesSection />
      )}
    </div>
  );
}

export default Sidebar;
