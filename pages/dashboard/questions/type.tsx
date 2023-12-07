import React from "react";
import Link from "next/link";
import Header from "@/app/header";

function QuestionType() {
    return (
        <div className="bg-white">
        <Header />
            <div className="flex items-center flex-col m-auto h-screen max-w-xl text-center mt-20">
                <p className="font-epilogue text-3xl font-bold leading-normal flex w-full justify-center text-secondary-500 text-center max-w-[28rem]">What type of question would like to create?</p>

                <div className="flex justify-between mt-8 gap-8">
                    <Link href="/dashboard/questions/audio/template" className="flex flex-col justify-center md:min-w-[400px] mt-4 py-10 px-6 bg-gradient-card from-teal-50 to-purple-50 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                        <div className="flex justify-center mb-2">
                            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M27.9974 37.917C21.8841 37.917 16.9141 32.947 16.9141 26.8337V14.0003C16.9141 7.88699 21.8841 2.91699 27.9974 2.91699C34.1107 2.91699 39.0807 7.88699 39.0807 14.0003V26.8337C39.0807 32.947 34.1107 37.917 27.9974 37.917ZM27.9974 6.41699C23.8207 6.41699 20.4141 9.82366 20.4141 14.0003V26.8337C20.4141 31.0103 23.8207 34.417 27.9974 34.417C32.1741 34.417 35.5807 31.0103 35.5807 26.8337V14.0003C35.5807 9.82366 32.1741 6.41699 27.9974 6.41699Z" fill="#292D32" />
                                <path d="M27.975 46.084C17.1717 46.084 8.375 37.2874 8.375 26.484V22.494C8.375 21.5374 9.16833 20.744 10.125 20.744C11.0817 20.744 11.875 21.5374 11.875 22.494V26.4607C11.875 35.3274 19.1083 42.5607 27.9517 42.5607C36.8183 42.5607 44.0517 35.3274 44.0517 26.4607V22.4707C44.0517 21.514 44.845 20.7207 45.8017 20.7207C46.7583 20.7207 47.5517 21.514 47.5517 22.4707V26.4374C47.5517 37.2407 38.755 46.0374 27.9517 46.0374L27.975 46.084Z" fill="#292D32" />
                                <path d="M31.2202 16.7534C31.0335 16.7534 30.8235 16.7301 30.6135 16.6601C28.9102 16.0301 27.0435 16.0301 25.3402 16.6601C24.4302 16.9867 23.4268 16.5201 23.0768 15.6101C22.7502 14.7001 23.2168 13.6967 24.1268 13.3701C26.6002 12.4834 29.3302 12.4834 31.8035 13.3701C32.7135 13.6967 33.1802 14.7001 32.8535 15.6101C32.5735 16.3101 31.8968 16.7534 31.1968 16.7534H31.2202Z" fill="#292D32" />
                                <path d="M29.8662 21.7001C29.7029 21.7001 29.5629 21.6767 29.3995 21.6301C28.4662 21.3734 27.5095 21.3734 26.5762 21.6301C25.6429 21.8867 24.6862 21.3267 24.4295 20.3934C24.1729 19.4834 24.7329 18.5267 25.6662 18.2701C27.1829 17.8501 28.8162 17.8501 30.3329 18.2701C31.2662 18.5267 31.8262 19.4834 31.5695 20.4167C31.3595 21.1867 30.6362 21.7001 29.8662 21.7001Z" fill="#292D32" />
                                <path d="M28 53.084C27.0433 53.084 26.25 52.2907 26.25 51.334V44.334C26.25 43.3773 27.0433 42.584 28 42.584C28.9567 42.584 29.75 43.3773 29.75 44.334V51.334C29.75 52.2907 28.9567 53.084 28 53.084Z" fill="#292D32" />
                            </svg>

                        </div>
                        <h5 className="font-work_sans text-2xl font-medium tracking-tight text-secondary-500 dark:text-white text-center mb-2">Audio</h5>
                        <p className="font-work_sans text-secondary-500 dark:text-gray-400 text-center">Here the interviews are conducted via audio streaming. The AI conducts the interview questions in audio and the particpants also respond via audio streaming.</p>
                    </Link>
                    <Link href="/dashboard/questions/create" className="flex flex-col justify-center md:min-w-[400px] mt-4 py-10 px-6 bg-gradient-card from-fuchsia-50 to-orange-50 rounded-lg  hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                        <div className="flex justify-center mb-2">
                            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M34.9974 53.0827H20.9974C8.3274 53.0827 2.91406 47.6694 2.91406 34.9994V20.9994C2.91406 8.32935 8.3274 2.91602 20.9974 2.91602H34.9974C47.6674 2.91602 53.0807 8.32935 53.0807 20.9994V34.9994C53.0807 47.6694 47.6674 53.0827 34.9974 53.0827ZM20.9974 6.41602C10.2407 6.41602 6.41406 10.2427 6.41406 20.9994V34.9994C6.41406 45.756 10.2407 49.5827 20.9974 49.5827H34.9974C45.7541 49.5827 49.5807 45.756 49.5807 34.9994V20.9994C49.5807 10.2427 45.7541 6.41602 34.9974 6.41602H20.9974Z" fill="#292D32" />
                                <path d="M25.0764 38.1946C24.0964 38.1946 23.1864 37.9613 22.3697 37.4946C20.503 36.4213 19.4297 34.228 19.4297 31.4513V24.5446C19.4297 21.768 20.503 19.5513 22.3697 18.478C24.213 17.4046 26.6397 17.568 29.043 18.968L35.0397 22.4213C37.4197 23.798 38.7964 25.828 38.7964 27.9746C38.7964 30.1213 37.4197 32.1513 35.0397 33.528L29.043 36.9813C27.6897 37.7746 26.313 38.1713 25.053 38.1713L25.0764 38.1946ZM25.0997 21.278C24.7264 21.278 24.3997 21.348 24.143 21.5113C23.3964 21.9546 22.953 23.0513 22.953 24.5213V31.428C22.953 32.898 23.3497 33.9946 24.1197 34.438C24.8664 34.8813 26.033 34.6946 27.3164 33.948L33.313 30.4946C34.5964 29.748 35.3197 28.838 35.3197 27.9746C35.3197 27.1113 34.5964 26.178 33.313 25.4546L27.3164 21.978C26.4764 21.488 25.7064 21.2546 25.0764 21.2546L25.0997 21.278Z" fill="#292D32" />
                            </svg>

                        </div>
                        <h5 className="font-work_sans text-2xl font-medium tracking-tight text-secondary-500 dark:text-white text-center mb-2">Video</h5>
                        <p className="font-work_sans text-secondary-500 dark:text-gray-400 text-center">Here the interviews are conducted via video streaming. The AI conducts the interview questions in video and the particpants also respond through video streaming.</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default QuestionType;