import Interview from "@/tbd/interview";
import React, { useEffect, useState } from "react";
import textToSpeech from "@/utils/audio";
import { InfinitySpin } from  'react-loader-spinner'
import { getQuestion } from "@/utils/question"

export default function InterviewTwo() {
    const [loading, setLoading] = useState(true)
    const [questionTwo, setQuestionTwo] = useState<any | null>(null);
    const [audioOne, setAudioOne] = useState<any | null>(null);

    useEffect(() => {
      const id = localStorage.getItem("userId")
      getQuestion(id).then((res) => {
        setQuestionTwo(res[0].questions[1])
        setLoading(false)
      })
    })
    
  return ( 
    <>
      {loading === true ?  
        <div className="grid h-screen place-items-center">
        <InfinitySpin 
        width='200'
        color="#4fa94d"
        />
    </div>
      :
        <Interview question={questionTwo as string} next="/interviewthree" audioURL={questionTwo} interviewNumber="two"/>
      }
    </>
   );
}

