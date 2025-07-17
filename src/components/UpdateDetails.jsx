import React from 'react';
import Input from './Input';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import logo from '../Photos/logo.png';
import { axiosInstance } from '../features/axios';

function UpdateDetails() {
    const [loading, setLoading] = React.useState(false);
    const { register, handleSubmit, formState: { errors }, } = useForm();
    const navigate = useNavigate();

    const onSubmitUpdate = async (data) => {
        try {
            setLoading(true);
            const payload = {
                ...data,
                isSingle: !!data.isSingle,
                gender: !!data.gender
            };
            await axiosInstance.patch("/user/updatedetails", payload);
            navigate('/');
        } catch (error) {
            alert("Unable to update details.")
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
                onSubmit={handleSubmit(onSubmitUpdate)}
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
                    Update Your Details
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

                                return realAge >= 18 || "Age Should be greater than 18 years."
                            }
                        }
                    })}
                    className="w-full px-3 py-2 rounded bg-slate-700 text-white border border-slate-600"
                />

                <div className="flex justify-between ">
                    <span className="text-white mb-1">
                        Are you single?
                    </span>

                    <label htmlFor='status' className="relative">

                        <input
                            id="status"
                            type="checkbox"
                            className="sr-only peer"
                            {...register("isSingle")}
                        />


                        <div className="w-14 h-8 bg-gray-400 rounded-full peer-checked:bg-green-500 transition duration-300"></div>


                        <div className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-6"></div>
                    </label>
                </div>

                {/* Gender */}

                <div className="flex justify-between ">
                    <span className="text-white mb-1">
                        Gender:
                    </span>

                    <label htmlFor='gender' className="relative">

                        <input
                            id="gender"
                            type="checkbox"
                            className="sr-only peer"
                            {...register("gender")}
                        />


                        <div className="w-14 h-8 bg-blue-500 rounded-full peer-checked:bg-pink-500 transition duration-300 p-1 font-bold">

                        </div>


                        <div className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-6"></div>
                    </label>
                </div>








                {errors.dob && (<p className="text-red-500 text-sm">{errors.dob.message}</p>)}

                <button
                    type="submit"
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-lg transition duration-200"
                >
                    Update
                </button>

            </form>
        </div>
    );
}

export default UpdateDetails;
