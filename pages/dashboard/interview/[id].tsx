import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastNotification } from "@/utils/toasts";
import Cookies from "universal-cookie";
import { useRouter } from "next/router";
import Link from "next/link";
import { getInterview } from "@/utils/interviews";
import Sidebar from "@/app/sidebar";

function Interview() {
    const router = useRouter()
    const cookies = new Cookies();

    const [userid, setUserId] = useState<any | null>(null);
    const [inviteid, setInviteid] = useState<any | null>(null);
    const [interviewDetails, setInterviewDetails] = useState<any | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        getInterview(router.query.id).then((res) => {
            setInterviewDetails(res)
            setLoading(false)
        }).catch((error) => {
            // Handle any errors
            console.error(error);
            setLoading(false);
        });
    }, [])

    return (
        <>
            <Sidebar>
                <div className="pt-8 sm:ml-60 lg:px-12 bg-white my-4">
                    {!loading && interviewDetails && (
                        <div className="bg-primary-50 max-w-4xl mt-12 mb-8 rounded-lg pt-8 pb-16 px-7">
                            <p className="font-epilogue text-2xl text-slate-950 mt-2 ms-5 font-bold">Interview Report</p>
                            <div>
                                <p className="ms-5 mt-3 font-work_sans">{`Name: ${interviewDetails.name} | ${interviewDetails.email}`}</p>
                            </div>
                            {interviewDetails.interviewDetails.map((item: any, index: number) => (
                                <div className="ms-5 mt-6" key={item._id}>
                                    <p className="text-slate-950 font-bold text-xl mb-1 font-work_sans">{item.interviews.question}</p>
                                    <p className="font-work_sans">{item.interviews.answer}</p>
                                    <p className="font-bold text-xl mt-5 mb-1 text-green-400 font-work_sans">AI Feedback:</p>
                                    <p className="font-work_sans">{item.interviews.feedback}</p>
                                </div>
                            ))}

                        </div>
                    )}
                    {loading && <p>Loading...</p>}
                </div>
                <ToastContainer />
            </Sidebar>
        </>
    );
}

export default Interview;