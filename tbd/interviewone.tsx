import Interview from "@/tbd/interview";
import { useEffect, useState } from "react";
import textToSpeech from "@/utils/audio";
import { InfinitySpin } from  'react-loader-spinner'
import { getQuestion } from "@/utils/question";

export default function InterviewOne() {
  const [loading, setLoading] = useState(true)
  const [questionOne, setQuestionOne] = useState<any | null>(null);
  const [audioOne, setAudioOne] = useState<any | null>(null);

  // const handleAudioFetch = async (data:string) => {  
  //   const audio = await textToSpeech(data)
  //   const blob = new Blob([audio], { type: 'audio/mpeg' });
  //   const url = URL.createObjectURL(blob);
  //   setAudioOne(url);
  // }

  useEffect(() => {
    const id = localStorage.getItem("userId")
    getQuestion(id).then((res) => {
      setQuestionOne(res[0].questions[0])
      setLoading(false)
    })
    // if (questionOne != null) {
    //   handleAudioFetch(questionOne)
    //   if (audioOne != null) {
    //     setLoading(false)
    //   }
    // } 
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
        <Interview question={questionOne as string} next="/interviewtwo" audioURL={questionOne} interviewNumber="one"/>
        
      }
    </>
   );
}

