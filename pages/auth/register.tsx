import Link from "next/link";
import Image from 'next/image'
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Cookies from "universal-cookie";
import { createAccount } from "@/utils/auth";
import { UserContext } from "@/context";
import { CurrentUserContextType, IUser } from "@/@types/user";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup
  .object({
    firstname: yup
      .string()
      .required("First name is required"),

    lastname: yup
      .string()
      .required("Last name is required"),

    email: yup
      .string()
      .email("Please enter a valid email")
      .required("Enter your email"),

    password: yup
      .string()
      .required("Password is required"),
  })
  .required();

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  const { saveUser } = React.useContext(UserContext) as CurrentUserContextType
  const router = useRouter()
  const cookies = new Cookies();

  // const [firstname, setFirstname] = useState<any | null >(null)
  // const [lastname, setLastname] = useState<any | null >(null)
  // const [email, setEmail] = useState<any | null >(null)
  // const [password, setPassword] = useState<any | null >(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any | null>(null)

  const onSubmit = ({ firstname, lastname, email, password }: { firstname: string, lastname: string, email: string, password: string }) => {
    setLoading(true)
    createAccount(firstname, lastname, email, password)
      .then((res) => {
        if (res.status === 0) {
          setError("Email already exists")
          setLoading(false)
        } else if (res.status = 1) {
          cookies.set('token', res.token, { path: "/" });

          const details = {
            firstname: res.newUser?.firstname,
            lastname: res.newUser?.lastname,
            email: res.newUser?.email,
            userId: res.newUser?._id,
            // inviteId: res.newUser?.inviteid,
          };

          cookies.set('userdata', JSON.stringify(details), { path: "/" });

          const updatedUser: IUser = {
            firstname: res.newUser?.firstName,
            lastname: res.newUser?.lastName,
            email: res.newUser?.email,
            userId: res.newUser?._id,
            // inviteId: res.newUser?.inviteid,
          };

          saveUser(updatedUser);
          setLoading(false);
          router.push('/auth/companyprofile');
        }
      }).catch((error) => {
        console.log(error);
        setLoading(false);
        setError("There was an issue creating your account!");
      });
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
              Create an account
            </h1>
            <p className="justify-center text-center font-work_sans my-0 mt-0">Fill the form below to create your account</p>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="pt-8" action="#">
              <div className="pb-4">
                <label htmlFor="lname" className="font-work_sans block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name</label>
                <input
                  {...register("firstname", {
                  })}
                  //   onChange={(e) => setFirstname(e.target.value)}
                  type="text" name="firstname" id="fname" className="bg-white border border-secondary-500 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block h-12 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" placeholder="John" />
              </div>
              {<p className="text-red-700">{errors.firstname?.message}</p>}
              <div className="pb-4">
                <label htmlFor="lname" className="font-work_sans block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Name</label>
                <input
                  {...register("lastname", {
                  })}
                  type="text" name="lastname" id="lname" placeholder="Doe" className="bg-white border border-secondary-500 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block h-12 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" />
              </div>
              {<p className="text-red-700">{errors.lastname?.message}</p>}
              <div className="pb-4">
                <label htmlFor="email" className="font-work_sans block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                <input
                  {...register("email", {
                  })}
                  //   onChange={(e) => setEmail(e.target.value)}
                  type="email" name="email" id="email" className="bg-white border border-secondary-500 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block h-12 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" placeholder="name@company.com" />
              </div>
              {<p className="text-red-700">{errors.email?.message}</p>}
              <div className="pb-4">
                <label htmlFor="password" className="font-work_sans block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input
                  {...register("password", {
                  })}
                  //   onChange={(e) => setPassword(e.target.value)}
                  type="password" name="password" id="password" placeholder="••••••••" className="bg-white border border-secondary-500 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block h-12 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" />
              </div>
              {<p className="text-red-700">{errors.password?.message}</p>}
              {error && <p className="text-red-500">{error}</p>}
              <div className="flex items-start justify-start pt-1 pb-7">
                <div className="flex items-center h-5">
                  <input id="terms" aria-describedby="terms" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">I accept the <a className="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">Terms and Conditions</a></label>
                </div>
              </div>
              <button
                //   onClick={(e) => handleRegister(e, firstname, lastname, email, password)}
                type="submit"
                disabled={loading}
                className="h-12 w-full text-white font-epilogue bg-primary-500 hover:bg-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-semibold rounded-lg text-base px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Create an account</button>
              <p className="text-sm font-normal text-gray-500 dark:text-gray-400 text-center pt-2 font-work_sans">
                Already have an account? <Link href="/auth/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500 font-epilogue">Login here</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;