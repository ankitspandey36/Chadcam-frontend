import React, { useState } from 'react';
import Input from './Input';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { axiosInstance } from '../features/axios';
import logo from '../Photos/logo.png';

function SignUp() {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmitSignUp = async (data) => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("email", data.email);
            formData.append("password", data.password);
            formData.append("status", !!data.isSingle);
            formData.append("dob", data.dob);
            formData.append("gender", !!data.gender);
            if (data.avatar && data.avatar[0]) {
                formData.append("avatar", data.avatar[0]);
            }
            await axiosInstance.post("/user/register", formData);
            localStorage.setItem("pendingEmail", data.email.trim());
            navigate("/verify");
        } catch (error) {
            alert("Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-screen w-screen bg-black text-white flex items-center justify-center">
                <h1 className="text-2xl">Loading...</h1>
            </div>
        );
    }

    return (
        <div className="h-screen w-screen  bg-slate-900 flex items-center justify-center p-2 sm:p-4">
            <form
                onSubmit={handleSubmit(onSubmitSignUp)}
                className="bg-slate-800 scrollbar-hide shadow-xl rounded-xl px-6 py-4 w-full max-w-md h-full max-h-[95vh] overflow-y-auto space-y-5"
            >
                <div className='flex justify-center'>
                    <img
                        src={logo}
                        alt="Chadcam"
                        className="h-10 w-10 rounded-2xl"
                    />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-center text-white">
                    Welcome to Chadcam
                </h2>

                <Input
                    label="Email:"
                    placeholder="Enter Your Email"
                    type="email"
                    {...register('email', {
                        validate: {
                            matchPattern: (value) =>
                                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Please Enter a Valid E-mail',
                        },
                    })}
                />
                <Input
                    label="Password:"
                    placeholder="Enter 6-digit Password"
                    type="password"
                    {...register('password', {
                        required: true,
                    })}
                />

                {/* for signup */}
                <Input
                    label="Birth Date:"
                    type="date"
                    {...register("dob", {
                        required: true,
                        validate: {
                            isAdult: (value) => {
                                const dob = new Date(value);
                                const now = new Date();
                                const year = now.getFullYear() - dob.getFullYear();
                                const month = now.getMonth() - dob.getMonth();
                                const day = now.getDate() - dob.getDate();
                                const realAge = month < 0 || (month === 0 && day < 0) ? year - 1 : year;
                                return realAge >= 18 || "Age Should be greater than 18 years.";
                            }
                        }
                    })}
                    className="w-full px-3 py-2 rounded bg-slate-700 text-white border border-slate-600"
                />

                <div className="flex justify-between items-center">
                    <span className="text-white text-sm">Are you single?</span>
                    <label htmlFor='status' className="relative">
                        <input
                            id="status"
                            type="checkbox"
                            className="sr-only peer"
                            {...register("isSingle")}
                        />
                        <div className="w-12 h-7 bg-gray-400 rounded-full peer-checked:bg-green-500 transition duration-300"></div>
                        <div className="absolute top-[4px] left-[2px] w-5 h-5 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
                    </label>
                </div>

                {/* Gender */}
                <div className="flex justify-between items-center">
                    <span className="text-white text-sm">Gender:</span>
                    <label htmlFor='gender' className="relative">
                        <input
                            id="gender"
                            type="checkbox"
                            className="sr-only peer"
                            {...register("gender")}
                        />
                        <div className="w-12 h-7 bg-blue-500 rounded-full peer-checked:bg-pink-500 transition duration-300"></div>
                        <div className="absolute top-[4px] left-[2px] w-5 h-5 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
                    </label>
                </div>

                <Input
                    label="Upload Avatar:"
                    type="file"
                    {...register("avatar")}
                />

                {errors.dob && (<p className="text-red-500 text-sm">{errors.dob.message}</p>)}

                <button
                    type="submit"
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-lg transition duration-200"
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
}

export default SignUp;
