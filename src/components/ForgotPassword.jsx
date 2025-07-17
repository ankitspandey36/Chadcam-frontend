import React from 'react';
import Input from './Input';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { axiosInstance } from '../features/axios';
import logo from '../Photos/logo.png';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
    const [loading, setLoading] = React.useState(false);
    const { register, handleSubmit, formState: { errors }, } = useForm();
    const navigate = useNavigate();
    const onSubmitForgotPassword = async (data) => {
        try {
            setLoading(true);
            localStorage.setItem("forgotEmail", data.email.trim())
            await axiosInstance.post("/user/forgotpassword", data);
            navigate("/setnewpassword");
        } catch (error) {
            alert("Unable to send verification code");
        }
        finally {
            setLoading(false)
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
        <div className="h-screen bg-slate-900 flex items-center justify-center">
            <form
                onSubmit={handleSubmit(onSubmitForgotPassword)}
                className="bg-slate-800 shadow-xl rounded-xl px-8 py-5 max-w-xl space-y-6 h-[calc(100%-2rem)]"
            >
                <div className='flex justify-center'>
                    <img
                        src={logo}
                        alt="Chadcam"
                        className="h-[2.5em] w-[2.5em] rounded-2xl"
                    />
                </div>
                <h2 className="text-2xl font-bold text-center text-white">
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



                <button
                    type="submit"
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-lg transition duration-200"
                >
                    Send Code
                </button>

            </form>
        </div>
    );
}

export default ForgotPassword;
