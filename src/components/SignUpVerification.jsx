import React from 'react';
import Input from './Input';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { axiosInstance } from '../features/axios';
import { login } from '../features/authSlice';
import { useDispatch } from 'react-redux';
import logo from '../Photos/logo.png';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function SignUpVerification() {

    const [loading, setLoading] = React.useState(false);

    const navigate = useNavigate();

    const dispatch = useDispatch();


    const email = localStorage.getItem("pendingEmail")

    useEffect(() => {
        if (!email) {
            alert("Please Register First")
            navigate("/signup");
        }
    }, [])

    const { register, handleSubmit, formState: { errors } } = useForm();

    const resendCode = async () => {
        if (!email) {
            alert("Email not found. Please register again.");
            navigate("/signup");
            return;
        }
        try {
            setLoading(true)
            await axiosInstance.post("/user/resendcode", { email });
            alert("Verification code sent again.");
        } catch (error) {
            alert("Failed to resend. Try again later.");
        }
        finally {
            setLoading(false)
        }
    }

    const onSubmitVerification = async (data) => {
        try {
            if (!email) {
                alert("Email not found. Please register again.");
                navigate("/signup");
                return;
            }

            const res = await axiosInstance.post('/user/verify', { email, code: data.code });
            localStorage.removeItem('pendingEmail');
            navigate('/login');
        } catch (error) {
            alert("Wrong Code or Expired.");
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
                onSubmit={handleSubmit(onSubmitVerification)}
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
                    Enter Verification Code sent in Email
                </h2>

                <Input
                    label="Code"
                    placeholder="Enter Code Here"
                    type="number"
                    {...register('code', { required: "Code is required" })}
                />

                <button
                    type="submit"
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-lg transition duration-200"
                >
                    Verify
                </button>
                <p className="text-center text-sm text-gray-300">
                    Didn't receive code?{' '}
                    <button onClick={resendCode} className="text-yellow-400 hover:underline font-medium">
                        {loading ? "Sending..." : "Resend"}
                    </button>
                </p>
                {errors.code && (
                    <p className="text-red-500 text-sm">{errors.code.message}</p>
                )}

            </form>
        </div>
    );
}

export default SignUpVerification;
