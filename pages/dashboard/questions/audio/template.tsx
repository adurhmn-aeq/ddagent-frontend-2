import React from "react";
import Link from "next/link";
import Header from "@/app/header";

function Template() {
    return (
        <div className="bg-white">
            <Header />
            <div className="flex items-center flex-col m-auto h-screen max-w-xl text-center mt-20">
                <p className="font-epilogue text-3xl font-bold leading-normal flex w-full justify-center text-secondary-500 text-center max-w-[28rem]">What type of question would like to create?</p>

                <div className="flex justify-between mt-8 gap-8">
                    <Link href="/dashboard/questions/audio/create" className="flex flex-col justify-center md:min-w-[400px] mt-4 py-10 px-6 bg-gradient-card from-teal-50 to-purple-50 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                        <div className="flex justify-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" height="56">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                        </svg>


                        </div>
                        <h5 className="font-work_sans text-2xl font-medium tracking-tight text-secondary-500 dark:text-white text-center mb-2">Custom Interview</h5>
                        <p className="font-work_sans text-secondary-500 dark:text-gray-400 text-center">Here you can build and generate your own custom interviews from scratch. Detailing the agent name and how you want the interview to go.</p>
                    </Link>
                    <Link href="/dashboard/questions/audio/choosetemplate" className="flex flex-col justify-center md:min-w-[400px] mt-4 py-10 px-6 bg-gradient-card from-fuchsia-50 to-orange-50 rounded-lg  hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                        <div className="flex justify-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" height="56">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>


                        </div>
                        <h5 className="font-work_sans text-2xl font-medium tracking-tight text-secondary-500 dark:text-white text-center mb-2">Template</h5>
                        <p className="font-work_sans text-secondary-500 dark:text-gray-400 text-center">Here you select from a range of predefined templates we have curated. You also get to edit this template based upon your need.</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Template;