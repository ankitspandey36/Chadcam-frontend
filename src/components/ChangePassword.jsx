import React from 'react';
import Input from './Input';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import logo from '../Photos/logo.png';
import { axiosInstance } from '../features/axios';

function ChangePassword() {
    const [loading, setLoading] = React.useState(false);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, } = useForm();

    const onSubmitChange = async (data) => {
        try {
            setLoading(true)
            await axiosInstance.patch("/user/changepassword", data);
            navigate('/')
        } catch (error) {
            alert("Unable to change password.")
        } finally {
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
                onSubmit={handleSubmit(onSubmitChange)}
                className="bg-slate-800 shadow-xl rounded-xl px-8 py-8 w-full max-w-xl space-y-6 "
            >
                <div className='flex justify-center'>
                    <img
                        src={logo}
                        alt="Chadcam"
                        className="h-[2.5em] w-[2.5em] rounded-2xl"
                    />
                </div>
                <h2 className="text-2xl font-bold text-center text-white">
                    Change Your Password
                </h2>

                <Input
                    label="Old Password:"
                    placeholder="Enter Old Password"
                    type="password"
                    {...register('password', {

                        required: "Please Enter Old Password"
                        ,
                    })}
                />
                <Input
                    label="New Password:"
                    placeholder="Enter New Password"
                    type="password"
                    {...register('newPassword', {
                        required: "Please Enter New Password",
                    })}
                />

                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}


                <button
                    type="submit"
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-lg transition duration-200"
                >
                    Change
                </button>

            </form>
        </div>
    );
}

export default ChangePassword;
