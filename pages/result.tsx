import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { saveInterview } from "@/utils/interviews";
import { InfinitySpin } from  'react-loader-spinner'

import { InterviewsContextType, IInterview } from "@/@types/interview";
import { InterviewContext } from "@/context/InterviewContext";

function Result() {
    const {interviews} = React.useContext(InterviewContext) as InterviewsContextType
    const [name, setName] = useState<any | null>(null);
    const [email, setEmail] = useState<any | null>(null);
    const [phonenumber, setPhonenumber] = useState<any | null>(null);
    const [id, setId] = useState<any | null>(null);
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        setLoading(true);
        const username = localStorage.getItem("name");
        const useremail = localStorage.getItem("email");
        const userphonenumber = localStorage.getItem("phonenumber");
        const id = localStorage.getItem("userId");
        const inviteId = localStorage.getItem("inviteId");
        const interviewTitle = localStorage.getItem("questionTitle");
      
        setName(username);
        setEmail(useremail);
        setPhonenumber(userphonenumber);
        setId(id);
        setLoading(false);
        
        if (id && name && email && phonenumber && interviews && interviewTitle && inviteId) {
          saveInterview(id, name, email, phonenumber, interviewTitle, interviews, inviteId).then((res) => {
            console.log(interviewTitle);
            localStorage.clear()
          });
        }
      }, [id, name, email, phonenumber, interviews]);
    return ( 
        <AnimatePresence>
            <div className="w-full min-h-screen flex flex-col px-4 pt-2 pb-8 md:px-8 md:py-2 bg-[#FCFCFC] relative overflow-x-hidden">
                <Link href="/">
                <p className="absolute w-full top-0 h-[60px] flex flex-row justify-between -ml-4 md:-ml-8">
                    <span className="text-sm text-[#1a2b3b] font-medium">
                    bilic demo
                    </span>
                    <span className="text-sm text-[#1a2b3b] font-medium opacity-20">
                    bilic demo
                    </span>
                    <span className="text-sm text-[#1a2b3b] font-medium">
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
                </Link>
                {loading &&
                    <div className="grid h-screen place-items-center">
                        <InfinitySpin 
                        width='200'
                        color="#4fa94d"
                    />
                    </div>
                }
                {!loading &&
                        <div className="absolute left-0 right-0 m-auto bg-slate-100 max-w-4xl mt-16 rounded-lg drop-shadow-lg pb-10">
                            <p className="text-slate-950 text-center text-xl mt-6">Thank you for taking part in this interview we would get back to you shortly</p>
                        {/* <p className="font-extrabold text-5xl text-slate-950 mt-5 text-center">Final Report</p>
                        <div className="ms-5 mt-6">
                            <p className="text-slate-950 font-bold text-xl mb-1">{`${questionOne}`}</p>
                            <span>{`Answer: ${answerOne}`}</span>
                            <p className="text-slate-950 font-bold text-xl mt-5 mb-1">Feedback</p>
                            <p>{`${feedbackOne}`}</p>
                        </div>

                        <div className="ms-5 mt-6">
                            <p className="text-slate-950 font-bold text-xl mb-1">{`${questionTwo}`}</p>
                            <span>{`Answer: ${answerTwo}`}</span>
                            <p className="text-slate-950 font-bold text-xl mt-5 mb-1">Feedback</p>
                            <p>{`${feedbackTwo}`}</p>
                        </div>

                        <div className="ms-5 mt-6">
                            <p className="text-slate-950 font-bold text-xl mb-1">{`${questionThree}`}</p>
                            <span>{`Answer: ${answerThree}`}</span>
                            <p className="text-slate-950 font-bold text-xl mt-5 mb-1">Feedback</p>
                            <p>{`${feedbackThree}`}</p>
                        </div> */}
                    </div>
                }
            </div>
        </AnimatePresence>
     );
}

export default Result;