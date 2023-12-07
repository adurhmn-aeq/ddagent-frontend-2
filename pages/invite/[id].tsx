import { useEffect, useRef, useState } from "react";
import Cookies from "universal-cookie";
import { useRouter } from 'next/router'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { useSearchParams } from 'next/navigation';
import { getUserCompanyDetails } from "@/utils/company";
import { checkEmail } from "@/utils/interviews";
import Modal from "@/app/modal";
import { getQuestion } from "@/utils/question";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface IUserdata {
  name:string
  email:string
  phoneNumber:string
}

const schema = yup
  .object({
    name: yup
      .string()
      .required("Name is required"),

      email: yup
      .string()
      .email("Please enter a valid email")
      .required("Email is required"),

      phoneNumber: yup
      .string()
      .required("Phone number is required"),
  })
  .required();

function Invite() {
  const cookies = new Cookies();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  const router = useRouter()
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(false);
  const [phoneNumber, setPhonenumber] = useState("");
  const [companyImage, setCompanyImage] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const inviteId:any = searchParams && searchParams.get('inviteId');
    if (inviteId) {
      getQuestion(inviteId).then((res) => {
        // console.log(res)
        if (res[0].title) {
          localStorage.setItem("questionTitle", res[0].title)
        }
      }) 
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id: string | undefined = router.query.id?.toString();
        if (id) {
          const userToken = cookies.get('token')
          const data = await getUserCompanyDetails(id, userToken);
          if (data.length === 0) {
            setLoading(false);
          } else {
            const base64String = new Buffer(data[0].data.data).toString('base64');
            const srcDataURI = `data:image/jpeg;base64,${base64String}`;
            setCompanyImage(srcDataURI);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Error in getUserCompanyDetails:', error);
        setLoading(false);
      }
    };

    fetchData(); // Call the function to fetch data

  }, [router.query.id]); // Empty dependency array to run this effect once on component mount

  useEffect(() => {
    const id:any = router.query.id
    const inviteId:any = searchParams && searchParams.get('inviteId');
    // const page:any = searchParams && searchParams.get('userid');
    
    localStorage.setItem("inviteId", inviteId)
    localStorage.setItem("userId", id)
  }, [router.query.id, searchParams])


  const onSubmit = (data:IUserdata) => {
    const inviteId:any = searchParams && searchParams.get('inviteId');
    localStorage.setItem("name", data.name)
    localStorage.setItem("email", data.email)
    localStorage.setItem("phonenumber", phoneNumber)
    router.push("/interview/1")
  }
  
  return (
    <>
    <Modal open={open}/>
      <p className="absolute w-full top-0 h-[60px] flex flex-row justify-between -ml-4 md:-ml-8">
        <span className="text-sm text-[#1a2b3b] font-medium">bilic demo</span>
        <span className="text-sm text-[#1a2b3b] font-medium opacity-20">
          bilic demo
        </span>
        <span className="text-sm text-[#1a2b3b] font-medium">bilic demo</span>
        <span className="text-sm text-[#1a2b3b] font-medium opacity-20 hidden sm:block">
          bilic demo
        </span>
        <span className="text-sm text-[#1a2b3b] font-medium hidden sm:block">
          bilic demo
        </span>
        <span className="text-sm text-[#1a2b3b] font-medium opacity-20 hidden xl:block">
          bilic demo
        </span>
        <span className="text-sm text-[#1a2b3b] font-medium opacity-20 hidden sm:block">
          bilic demo
        </span>
        <span className="text-sm text-[#1a2b3b] font-medium opacity-20 hidden sm:block">
          bilic demo
        </span>
        <span className="text-sm text-[#1a2b3b] font-medium hidden sm:block">
          bilic demo
        </span>
        <span className="text-sm text-[#1a2b3b] font-medium opacity-20 hidden xl:block">
          bilic demo
        </span>
      </p>
      <div className="flex justify-center flex-col m-auto h-screen max-w-xl">
        {step === 0  && !loading ? (
          <div className="flex justify-center flex-col m-auto h-screen max-w-xl" key={0}>
          <div className="flex justify-center mb-10">
          <img
          className="w-28 justify-center" 
          src={companyImage === null ? "/bilic_logo_green.svg" : `${companyImage}`} alt="" />
        </div>
        <div className="px-6 items-center ">
            <p className="text-black font-medium mb-5 mt-5">This is an AI video conducted interview you are about taking part in. 
                The interview is to test your capabilities across a wide range of questions which you are to supply answers to.</p>
            <p className="text-black font-medium">Please speak correctly and fluently into the microphone when answering the questions before you and also try to answer the qustions 
            within the alloted timeframe</p>
        </div>
          <div className="flex justify-center mt-5">
          <button
              onClick={() => setStep(1)}
              type="submit" className="w-36 text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Next</button>
          </div>
            
    </div>
        ): step === 1 ? (
          <div className="" key={1}>
            <div className="flex justify-center mb-10">
            <img
              className="w-28 justify-center" 
              src={companyImage === null ? "/bilic_logo_green.svg" : `${companyImage}`} alt="" />
            </div>
            <div className="m-8">
              <form onSubmit={handleSubmit(onSubmit)}>
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                Enter your name
              </label>
              <input
                className="appearance-none block w-full h-14 bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-2xl"
                id="name"
                type="text"
                {...register("name", {
                })}
                onChange={(e) => {
                  // setName(e.target.value)
                }}
                placeholder="John Doe"
              />
              <p className="text-red-600">{errors.name?.message}</p>
              <div className="mt-5">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-password"
                >
                  Enter your email
                </label>
                <input
                  className="appearance-none block w-full h-14 bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-2xl"
                  id="email"
                  type="email"
                  {...register("email", {
                  })}
                  onChange={(e) => {
                    // setEmail(e.target.value)

                  }}
                  placeholder="doe@example.com"
                />
                <p className="text-red-600">{errors.email?.message}</p>
              </div>
              <div className="mt-5">
                <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                Enter your phone number
              </label>
              <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <PhoneInput
                      country={"us"}
                      inputStyle={{
                        width: '100%',
                        height: "65px",
                        fontSize: "18px"
                      }}
                      inputClass={"input-phone"}
                      containerClass="phone-container"
                      // value={phoneNumber}
                      onChange={phone => {
                        setPhonenumber(phone)
                        onChange(phone);
                      }}
                    />
                  )}
                />
                <p className="text-red-600">{errors.phoneNumber?.message}</p>
              </div>
              <div className="flex justify-center max-w-xl mt-5 ">
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Start Interview
              </button>
            </div>
            </form>
            </div>
          </div>
        ) : (
          null
        )}
      </div> 
    </>
  );
}

export default Invite;
