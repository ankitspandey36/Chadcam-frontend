import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../features/axios';

function FeedBack() {
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleFormSubmit = async (e) => {
        try {
            e.preventDefault();
            setLoading(true);
            await axiosInstance.post("/feedback/submitfeedback", { feedback });
            setFeedback("");
            navigate("/")
        } catch (error) {
            alert("Unable to submit feedback, try again later.")
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (<div className='w-screen h-screen bg-black flex justify-center items-center'>
            Loading...
        </div>)
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 px-4">
            <fieldset className="bg-slate-700 rounded-xl shadow-2xl p-8 max-w-lg w-full space-y-6">
                <legend className="text-2xl font-semibold text-white mb-4">Feedback</legend>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Enter your thoughts here..."
                        className="w-full h-40 p-4 text-white bg-slate-900 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
                    />

                    <button
                        type="submit"
                        className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition duration-200"
                    >
                        Submit Feedback
                    </button>
                </form>
            </fieldset>
        </div>
    );
}

export default FeedBack;
