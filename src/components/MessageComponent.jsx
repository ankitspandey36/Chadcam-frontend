import React, { useEffect, useState } from 'react';
import { socket } from '../features/clientSocket.js';
import { axiosInstance } from '../features/axios.js';

function MessageComponent() {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);


  useEffect(() => {

    ; (async () => {
      const res = await axiosInstance.get("/user/me");
      setUser(res.data.data);
    })()

    const handleMessage = (msgObj) => {

      setMessages((prev) => [...prev, msgObj]);
    };


    console.log("Received");
    socket.on("receive", handleMessage);


    return () => {
      socket.off("receive", handleMessage);
    };
  }, []);

  return (
    <div className='relative'>
      <h1 className="text-white font-semibold text-lg p-2">Chat:</h1>
      <div className='flex-1 overflow-y-auto scrollbar-hide px-2'>

        {messages.map((message) => {
          const isMine = user && message.senderId._id === user._id;

          return (
            <div
              key={message._id}
              className={`flex flex-col ${isMine ? "items-end" : "items-start"} my-1`}
            >
              {message.msgType === "image" ? (
                <img
                  src={message.image}
                  alt="sent-img"
                  className="rounded shadow-md
             w-[80%] max-w-[280px] 
             sm:max-w-[240px] 
             md:max-w-[200px] 
             lg:max-w-[160px] 
             xl:max-w-[140px]"
                />

              ) : (
                <div
                  className={`text-black rounded-xl px-3 py-1 max-w-[70%] break-words ${isMine ? "bg-yellow-200" : "bg-orange-300"
                    }`}
                >
                  {message.message}
                </div>
              )}

              <div className="text-xs text-gray-400">
                {isMine ? "Me" : message.senderId.email.split("@")[0]}
              </div>
            </div>

          );
        })}
      </div>
    </div>
  );
}

export default MessageComponent;
