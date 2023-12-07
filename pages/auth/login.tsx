import Link from "next/link";
import Image from 'next/image';
import signIn from "@/utils/signIn";
import Cookies from "universal-cookie";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import { ThreeDots } from 'react-loader-spinner'
import { UserContext } from "@/context";
import { CurrentUserContextType, IUser } from "@/@types/user";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup
    .object({
        email: yup
            .string()
            .email("Please enter a valid email")
            .required("Enter your email"),
        password: yup
            .string()
            .required("Enter your password"),
    })
    .required();

function Login() {
    const router = useRouter()
    const cookies = new Cookies();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        mode: "all",
    });

    const { saveUser, users } = React.useContext(UserContext) as CurrentUserContextType
    const [user, setUser] = useState<IUser>({
        firstname: "",
        lastname: "",
        email: "",
        userId: "",
        // inviteId: "",
    });
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<any | null>(null)

    const handleLogin = () => {
        setLoading(true)
        signIn(email, password).then((res: any) => {

            cookies.set('token', res.data.token, {
                path: "/",
            })
            const details = {
                firstname: res.data.firstName,
                lastname: res.data.lastName,
                email: res.data.email,
                userId: res.data.userId,
                inviteId: res.data.inviteId,
            };

            cookies.set('userdata', JSON.stringify(details), {
                path: "/",
            })
            const updatedUser: IUser = {
                firstname: res.data.firstName,
                lastname: res.data.lastName,
                email: res.data.email,
                userId: res.data.userId,
                // inviteId: res.data.inviteId,
            };
            setUser(updatedUser)
            saveUser(updatedUser)
            setLoading(false)

            if (loading === false) {
                router.push('/dashboard')
            }
        }).catch((e) => {
            setError("Invalid Email address or Password")
            setLoading(false)
        })
    }

    const onSubmit = () => {
        handleLogin()
    }
    return (
        <section className="bg-white dark:bg-gray-900">
            <header className="container mx-auto px-5 py-5">
                <nav className="flex justify-between">
                    <a href="/">
                        <Image
                            src="/bilic-alt.svg"
                            width={52}
                            height={52}
                            alt="Picture of the author"
                            className="aspect-auto"
                        />
                    </a>
                </nav>
            </header>
            <div className="flex flex-col items-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 md:py-20 justify-center">
                        <h1 className="font-epilogue text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-3xl dark:text-white justify-center text-center">
                            Sign in to your account
                        </h1>
                        <p className="justify-center text-center font-work_sans my-0 mt-0">Sign in to your account or register</p>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="pt-8" action="#">
                            <div className="pb-4">
                                <label htmlFor="email" className="font-work_sans block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                <input
                                    {...register("email", {
                                        onChange: (e) => {
                                            setEmail(e.target.value);
                                        },
                                    })}
                                    // onChange={(e) => setEmail(e.target.value)}
                                    type="email" name="email" id="email" className="bg-white border border-secondary-500 text-gray-900 shadow-[inset_0_1px_4px_0px_rgba(0,0,0,0.1)] sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block h-12 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" placeholder="name@company.com" required={true} />
                                {<p className="text-red-500 text-sm font-work_sans">{errors.email?.message}</p>}
                            </div>

                            <div className="pb-1">
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white font-work-sans">Password</label>
                                <input
                                    {...register("password", {
                                        onChange: (e) => {
                                            setPassword(e.target.value);
                                        },
                                    })}
                                    // onChange={(e) => setPassword(e.target.value)}
                                    type="password" name="password" id="password" placeholder="••••••••" className="bg-white border border-secondary-500 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block h-12 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" required={true} />
                                {<p className="text-red-500 text-sm font-work_sans">{errors.password?.message}</p>}
                            </div>

                            {error && <p className="text-red-500 text-sm py-1 font-work_sans">{error}</p>}
                            <div className="flex items-center justify-between pt-1 pb-7">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required={false} />
                                    </div>
                                    <div className="ml-2 text-sm">
                                        <label htmlFor="remember" className="text-gray-500 dark:text-gray-300 font-work_sans">Remember me</label>
                                    </div>
                                </div>
                                <Link href="#" className="text-sm font-normal text-primary-600 hover:underline font-work_sans">Forgot password?</Link>
                            </div>
                            {!loading &&
                                <button
                                    // onClick={handleLogin}
                                    type="submit" className="h-12 w-full text-white font-epilogue bg-primary-500 hover:bg-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-semibold rounded-lg text-base px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Login to your account</button>}
                            {loading &&
                                <div className="flex flex-row">
                                    <button
                                        // onClick={handleLogin}
                                        disabled={loading}
                                        type="submit" className="h-12 w-full text-white bg-primary-700 hover:bg-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 disabled:ring-green-500">signing in....</button>
                                </div>
                            }
                            <p className="text-sm font-normal text-gray-500 dark:text-gray-400 text-center pt-2 font-work_sans">
                                Don’t have an account yet? <Link href="/auth/register" className="font-medium text-primary-600 hover:underline dark:text-primary-500 font-epilogue">Sign up</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Login;