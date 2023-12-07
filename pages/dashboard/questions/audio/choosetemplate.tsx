import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/app/header";

function ChooseTemplate() {
    const router = useRouter();
    const [selectedValue, setSelectedValue] = useState<String>("")

    const handleNext = () => {
        router.push(`/dashboard/questions/audio/create?value=${selectedValue}`)
    }

    return (
        <div className="bg-white">
            <Header />
            <div className="flex items-center flex-col m-auto h-screen max-w-xl text-center mt-20">
            <p className="font-epilogue text-3xl font-bold leading-normal flex w-full justify-center text-secondary-500 text-center max-w-[28rem] mb-5">Choose from a template</p>
                <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 dark:bg-gray-800 dark:border-gray-700">
                    <p className="text-sm font-normal text-gray-500 dark:text-gray-400">Select any of the templates that best suites your business needs.</p>
                    <ul className="my-4 space-y-3">
                        <li>
                            <a href="#" className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                            <input
                            onChange={(e) => setSelectedValue(e.target.value)}
                            id="personal" type="radio" value="personal" name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"></input>     
                                <span className="flex-1 ml-3 whitespace-nowrap text-left">Personal KYC</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                            <input
                            onChange={(e) => setSelectedValue(e.target.value)}
                            id="business" type="radio" value="business" name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"></input>     
                                <span className="flex-1 ml-3 whitespace-nowrap text-left">Business KYC</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                            <input
                            id="transaction" type="radio" value="Male" name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"></input>     
                                <span className="flex-1 ml-3 whitespace-nowrap text-left">Transaction Monitoring</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                            <input
                            id="compliance" type="radio" value="Male" name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"></input>     
                                <span className="flex-1 ml-3 whitespace-nowrap text-left">Complaince Interview</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                            <input
                            id="support" type="radio" value="Male" name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"></input>     
                                <span className="flex-1 ml-3 whitespace-nowrap text-left">Technical Support</span>
                            </a>
                        </li>
                    </ul>
                    <div>
                        <button 
                        onClick={handleNext}
                        type="submit" className="h-12 w-full text-white bg-primary-700 hover:bg-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 disabled:ring-green-500">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChooseTemplate;