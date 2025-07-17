import React, { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { axiosInstance } from '../features/axios';
import { useHMSActions } from '@100mslive/react-sdk';
import { socket } from '../features/clientSocket';
import { useDispatch } from 'react-redux';
import { unsetHMSRoomId, unsetRoomId } from '../features/roomSlice';

function ReportComponent({ onClose, reportedTo }) {
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const roomId = useSelector((state) => state.room.roomId);
    const hmsActions = useHMSActions();
    const dispatch = useDispatch();

    useEffect(() => {
        socket.on("force-disconnect", async ({ message }) => {
            alert(message); 
            await hmsActions.leave();
            await axiosInstance.post("/room/leaveroom", { roomId });
            socket.disconnect();
            dispatch(unsetRoomId());
        });

        return () => socket.off("force-disconnect");
    }, [roomId]);

    const handleSubmit = async () => {
        // console.log("Report route hit");


        if (!reason || !reportedTo) return;
        setLoading(true);
        try {
            const res = await axiosInstance.post("/report/action", {
                roomId,
                reportedfor: reason,
                reportedTo,
            });

            const message = res?.data?.message;

            if (message === "User left room" || message === "Room deleted as last user left") {
                await hmsActions.leave();
                await axiosInstance.post("/user/leaveroom", { roomId });
                socket.disconnect();
                dispatch(unsetRoomId());
                dispatch(unsetHMSRoomId());
            }
            //console.log("reported")
            onClose();
        } catch (e) {
            alert("Report Unsuccessful");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <label htmlFor="report-reason" className="block mb-2 font-medium text-sm">
                Reason for Report
            </label>
            <select
                id="report-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="border p-2 rounded w-full"
                disabled={loading}
            >
                <option value="" disabled>Select a reason</option>
                <option value="Inappropriate Behavior">Inappropriate Behavior</option>
                <option value="Spam or Advertising">Spam or Advertising</option>
                <option value="Harassment or Bullying">Harassment or Bullying</option>
                <option value="Hate Speech">Hate Speech</option>
                <option value="Sexual or Explicit Content">Sexual or Explicit Content</option>
                <option value="Impersonation">Impersonation</option>
                <option value="Threats or Violence">Threats or Violence</option>
            </select>

            <div className="flex justify-end mt-4 gap-2">
                <button
                    onClick={onClose}
                    disabled={loading}
                    className="text-sm px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={loading || !reason}
                    className={`text-sm px-3 py-1 rounded text-white ${loading ? "bg-red-400" : "bg-red-600 hover:bg-red-700"
                        }`}
                >
                    {loading ? "Reporting..." : "Submit"}
                </button>
            </div>
        </div>
    );
}

export default ReportComponent;
