import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { createCompanyProfile } from "@/utils/company";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup
  .object({
    companyname: yup
    .string()
    .required("Company name is required"),

    companynumber: yup
      .string()
      .required("Company number is required"),

    //   companyimage: yup
    //   .mixed()
    //   .nullable()
    //   .test("required", "You need to provide a file", function (file) {
    //     return (file as FileList)?.[0] instanceof File;
    //   })
    //   .typeError("Company image is required"),
  })
  .required();

function CompanyProfile() {
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm({
        resolver: yupResolver(schema),
        mode: "all",
      });

    const cookies = new Cookies();
    const router = useRouter()
    const [image, setImage] = useState<any | null>(null)
    const [companyName, setCompanyName] = useState<any | null>(null)
    const [companyNumber, setCompanyNumber] = useState<any | null>(null)
    const [file, setFile] = useState<any | null>(null)
    const [userId, setUserId] = useState<any | null>(null)
    const [loading, setLoading] = useState(false)
    const [fileError, setFileError] = useState<any | null>(null)

    useEffect(() => {
        const userData = cookies.get('userdata')
        // console.log(userData)
        setUserId(userData.userId)
    })

    const onImageChange = (event:any) => {
        if (event.target.files && event.target.files[0]) {
            setFileError("")
            setImage(URL.createObjectURL(event.target.files[0]));
            setFile(event.target.files[0])
        }
    }

    // const handleCreate = () => {
    //     setLoading(true)
    //     const formData = new FormData();
    //     formData.append('image', file)
    //     formData.append('companyName', companyName)
    //     formData.append('companyNumber', companyNumber)
    //     formData.append('userId', userId)

    //     createCompanyProfile(formData).then((res) => {
    //         setLoading(false)
    //         router.push('/dashboard')
    //     }).catch((e) => {
    //         console.log(e)
    //     })
    // }

    const onSubmit = ({companyname, companynumber}: {companyname: string, companynumber: string}) => {
        setLoading(true)
        if (file != null) {
            // console.log("thank you")
            const userToken = cookies.get('token')
            const formData = new FormData();
            formData.append('image', file)
            formData.append('companyName', companyname)
            formData.append('companyNumber', companynumber)
            formData.append('userId', userId)

            createCompanyProfile(formData, userToken).then((res) => {
                setLoading(false)
                router.push('/dashboard')
            }).catch((e) => {
                console.log(e)
            })
        }else{
            setLoading(false)
            setFileError("Company image is required")
        }
        
    }
    return ( 
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                    <img className="w-14 h-14 mr-2" src="/bilic_logo_green.svg" alt="logo" />
                    {/* Bilic */}
                </a>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Company Details
                        </h1>
                        <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-3">
                            <label htmlFor="companyName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Company Name</label>
                            <input 
                            {...register("companyname")}
                            //   onChange={(e) => setCompanyName(e.target.value)}
                            type="text" name="companyname" id="cname" placeholder="Sigma Industries" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                        </div>
                        {<p className="text-red-700 mb-3">{errors.companyname?.message}</p>}
                        <div className="mb-5">
                            <label htmlFor="companyNumber" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone Number</label>
                            <input 
                            {...register("companynumber")}
                            //   onChange={(e) => setCompanyNumber(e.target.value)}
                            type="text" name="companynumber" id="cnumber" placeholder="0943944934" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        </div>
                        {<p className="text-red-700 mb-5">{errors.companynumber?.message}</p>}
                        <div className="flex items-center justify-center w-full">
                            {!image &&
                            <label htmlFor="companyimage" className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG (MAX. 800x400px)</p>
                                </div>
                                <input 
                                // {...register("companyimage")}
                                accept="image/jpeg, image/png"
                                id="companyimage" type="file" className="hidden" onChange={onImageChange}/>
                            </label> }
                            {image != null ? 
                               <img 
                               className="rounded-md h-48"
                               src={image} alt="upload image" />
                               : null
                            }
                        </div> 
                        {image != null ? 
                               <div className="flex justify-center">
                               <label htmlFor="dropzone-file2" className="font-bold text-md text-gray-900 cursor-pointer">Choose another file</label>
                               <input 
                               accept="image/jpeg, image/png"
                               id="dropzone-file2" type="file" className="hidden" onChange={onImageChange}/>
                           </div>
                               : null
                            }
                            {fileError && <p className="text-red-700 mt-3">{fileError}</p>}
                        {/* {<p className="text-red-700 mt-3">{errors.companyimage?.message}</p>} */}
                        <button 
                        // onClick={handleCreate}
                        type="submit" 
                        disabled={loading}
                        className="mt-5 w-full text-white bg-green-800  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-green-400">Continue</button>
                        <Link href="/dashboard">
                            <p className="text-slate-400 text-center mt-5">Skip</p>
                        </Link>
                        </form>
                    </div>
                </div>
            </div>
        </section>
     );
}

export default CompanyProfile;