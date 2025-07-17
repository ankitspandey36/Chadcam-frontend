import React from 'react';
import Input from './Input';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { axiosInstance } from '../features/axios';
import { login } from '../features/authSlice';
import { useDispatch } from 'react-redux';
import logo from '../Photos/logo.png';
import { useNavigate } from 'react-router-dom';

function LoginPage() {

    const [loading, setLoading] = React.useState(false);

    const navigate = useNavigate();

    const dispatch = useDispatch();



    const { register, handleSubmit } = useForm();

    const onSubmitLogin = async (data) => {
        try {
            setLoading(true)
            const res = await axiosInstance.post('/user/login', data);
            dispatch(login(res.data.user));
            localStorage.setItem("userdata", JSON.stringify(res.data.data.user))
            navigate('/');
        } catch (error) {
            alert("Invalid Credentials");
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
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <form
                onSubmit={handleSubmit(onSubmitLogin)}
                className="bg-slate-800 shadow-xl rounded-xl px-8 py-10 w-full max-w-sm space-y-6"
            >
                <div className='flex justify-center'>
                    <img
                        src={logo}
                        alt="Chadcam"
                        className="h-[2.5em] w-[2.5em] rounded-2xl"
                    />
                </div>
                <h2 className="text-2xl font-bold text-center text-white">
                    Welcome Back
                </h2>

                <Input
                    label="Email"
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
                    label="Password"
                    placeholder="Enter Password"
                    type="password"
                    {...register('password', {
                        required: true,
                    })}
                />
                <button
                    type="submit"
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-lg transition duration-200"
                >
                    Log In
                </button>
                <p className="text-center text-sm text-gray-300">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-yellow-400 hover:underline font-medium">
                        Sign Up{' '}
                    </Link>
                    Or {' '}
                    <Link to="/forgotpassword" className="text-yellow-400 hover:underline font-medium">
                        Forgot Password
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default LoginPage;
