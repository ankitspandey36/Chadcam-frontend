import React, { useState, useEffect, useRef } from 'react';
import { axiosInstance } from '../features/axios';
import { setTags as globalTags, removeTags } from '../features/tagSlice.js';
import { useDispatch } from 'react-redux';

function TagComponent() {
    const [tags, setTags] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [input, setInput] = useState("");
    const dispatch = useDispatch();

    const tagContainerRef = useRef(null);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const res = await axiosInstance.get("/user/trendingtopics");
                setSuggestions(res.data.topics || []);
            } catch (err) {
                console.error("Error fetching tags", err);
            }
        };
        fetchTrending();
    }, []);


    useEffect(() => {
        if (tagContainerRef.current) {
            tagContainerRef.current.scrollTop = tagContainerRef.current.scrollHeight;
        }
    }, [tags]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && input.trim()) {
            e.preventDefault();
            if (!tags.includes(input.trim())) {
                const newTag = input.trim();
                setTags([...tags, newTag]);
                dispatch(globalTags([newTag]));
            }
            setInput('');
        }
    };

    const handleSuggestionClick = (tag) => {
        if (!tags.includes(tag)) {
            setTags([...tags, tag]);
            dispatch(globalTags([tag]));
        }
        setInput('');
    };

    const removeIndex = (index) => {
        setTags(tags.filter((_, i) => i !== index));
        dispatch(removeTags(index));
    };

    return (
        <div className=" space-y-2 relative z-40">
            <h1 className="text-white font-semibold text-lg  p-2 ">Tags:</h1>


            <div
                className="flex flex-col gap-2 max-h-[20vh] overflow-y-auto overflow-x-hidden scrollbar-hide"
                ref={tagContainerRef}
            >
                {tags.map((tag, i) => (
                    <div
                        key={i}
                        className="break-words bg-[#1E1E2F] text-[#7DD3FC] px-3 py-1 rounded-xl text-sm font-medium flex justify-between items-center border border-[#38BDF8] shadow-sm w-fit max-w-full"
                    >
                        <span className="break-all whitespace-pre-wrap max-w-[90%]">{tag}</span>
                        <button onClick={() => removeIndex(i)} className="text-white font-bold ml-2">&times;</button>
                    </div>
                ))}
            </div>

            <div className="relative w-full mt-2">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full px-3 py-2  text-white text-base rounded-lg outline-none "
                    placeholder="Enter"
                />

                {/* Suggestion Box */}
                {input && (
                    <div className="absolute top-full left-0 w-full mt-1 bg-white text-black rounded shadow max-h-40 overflow-y-auto z-50">
                        {suggestions
                            .filter(tag => tag.toLowerCase().includes(input.toLowerCase()) && !tags.includes(tag))
                            .map((tag, i) => (
                                <div
                                    key={i}
                                    onClick={() => handleSuggestionClick(tag)}
                                    className="p-2 cursor-pointer hover:bg-gray-200 flex items-center gap-2"
                                >
                                    🔥 {tag}
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default TagComponent;
