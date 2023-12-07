import Interview from "@/tbd/interview";
import React, { useEffect, useState } from "react";
import textToSpeech from "@/utils/audio";
import { InfinitySpin } from  'react-loader-spinner'
import { getQuestion } from "@/utils/question"

import { InterviewsContextType, IInterview } from "@/@types/interview";
import { InterviewContext } from "@/context/InterviewContext";

export default function InterviewThree() {
    const {interviews, saveInterviews} = React.useContext(InterviewContext) as InterviewsContextType
    
    const [loading, setLoading] = useState(true)
    const [questionThree, setQuestionThree] = useState<any | null>(null);
    const [audioOne, setAudioOne] = useState<any | null>(null);


    useEffect(() => {
      const id = localStorage.getItem("userId")
      getQuestion(id).then((res) => {
        setQuestionThree(res[0].questions[2])
        setLoading(false)
      })
    })

    console.log(interviews)

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
      <Interview question={questionThree as string} next="/result" audioURL={questionThree} interviewNumber="three"/>
    }
  </>
   );
}

