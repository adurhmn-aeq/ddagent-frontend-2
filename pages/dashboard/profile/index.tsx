import React, { useEffect, useState } from "react";
import Sidebar from "@/app/sidebar";
import { useRouter } from "next/navigation";
import { getUserCompanyDetails } from "@/utils/company";
import Cookies from "universal-cookie";
import { updateCompanyProfile } from "@/utils/company";

function Profile() {
    const cookies = new Cookies();
    const router = useRouter()

    const [companyImage, setCompanyImage] = useState<any | null>(null)
    const [companyName, setCompanyName] = useState<any | null>(null)
    const [companyNumber, setCompanyNumber] = useState<any | null>(null)
    const [loading, setLoading] = useState(false)
    const [userData, setUserData] = useState<any | null>(null)
    const [image, setImage] = useState<any | null>(null)
    const [file, setFile] = useState<any | null>(null)

    const onImageChange = (event:any) => {
        if (event.target.files && event.target.files[0]) {
            // setFileError("")
            setImage(URL.createObjectURL(event.target.files[0]));
            setFile(event.target.files[0])
        }
    }

    const onSubmit = (id:string) => {
            // console.log("thank you")
            setLoading(true)
            const userToken = cookies.get('token')
            const formData = new FormData();
            formData.append('image', file)
            formData.append('companyName', companyName)
            formData.append('companyNumber', companyNumber)
            updateCompanyProfile(formData, id, userToken).then((res) => {
                setLoading(false)
                // router.push('/dashboard')
            }).catch((e) => {
                console.log(e)
            })
    }

    console.log(loading)

    useEffect(() => {
        setLoading(true)
        const userdata = cookies.get("userdata")
        const userToken = cookies.get('token')
        if (userdata) {
            setUserData(userdata)
            getUserCompanyDetails(userdata.userId,userToken).then((data) => {
                if (data.length === 0) {
                    setCompanyImage('')
                    setCompanyName('')
                    setCompanyNumber('')
                    setLoading(false)
                }else{
                    const base64String = new Buffer(data[0].data.data).toString('base64');
                    const srcDataURI = `data:image/jpeg;base64,${base64String}`;
                    setCompanyImage(srcDataURI)

                    setCompanyName(data[0].companyName)
                    setCompanyNumber(data[0].companyNumber)
                    setLoading(false)
                }    
            })
        }
    }, [])

    return ( 
        <Sidebar>
            <div className="p-4 sm:ml-64">
                {userData && !loading && (
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-14">
                    <p className="text-black, text-xl m-5 font-bold">{companyName}</p>
                    {image ? <img 
                    className="h-32 m-5 rounded-lg" 
                    src={image} alt="company image" /> :
                    <img 
                    className="h-32 m-5 rounded-lg" 
                    src={companyImage === "" ? "/profile.jpeg" : `${companyImage}`} alt="company image" /> }
                    <input type="file" id="upload" hidden onChange={onImageChange}/>
                    <label htmlFor="upload" className="ms-5 inline-block items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-400 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150 mt-2 ml-3">Change picture</label>
                    <div className="m-5">
                        <label htmlFor="default-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name</label>
                        <input 
                        disabled={true}
                        defaultValue={userData.firstname}
                        type="text" id="default-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-96 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <div className="m-5">
                        <label htmlFor="default-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Name</label>
                        <input 
                        disabled={true}
                        defaultValue={userData.lastname}
                        type="text" id="default-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-96 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <div className="m-5">
                        <label htmlFor="default-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                        <input 
                        disabled={true}
                        defaultValue={userData.email}
                        type="text" id="default-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-96 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <div className="m-5">
                        <label htmlFor="default-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Company Name</label>
                        <input 
                        onChange={(e) => setCompanyName(e.target.value)}
                        defaultValue={companyName}
                        type="text" id="default-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-96 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <div className="m-5">
                        <label htmlFor="default-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Company Number</label>
                        <input 
                        onChange={(e) => setCompanyNumber(e.target.value)}
                        defaultValue={companyNumber}
                        type="text" id="default-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-96 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <button
                    onClick={() => onSubmit(userData?.userId)}
                    disabled={loading}
                    type="submit" className="h-12 w-40 m-3 text-white font-epilogue bg-primary-500 hover:bg-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-semibold rounded-lg text-base px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 disabled:ring-green-100">Update Profile</button>
                </div>
                )}
            </div>
        </Sidebar>
     );
}

export default Profile;