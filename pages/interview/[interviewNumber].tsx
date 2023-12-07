import { useRouter } from "next/router";
import { getQuestion } from "../../utils/question";
import { useEffect, useState } from "react";
import InterviewLayout from "@/app/interviewLayoutt";
import { retriveVideo } from "@/utils/retrieveVideoUrl";
import { InfinitySpin } from  'react-loader-spinner'

function Interview() {
  const router = useRouter();
  const { interviewNumber } = router.query;
//   const data = [
//     { title: "Page 1", content: "Content for Page 1" },
//     { title: "Page 2", content: "Content for Page 2" },
//     { title: "Page 3", content: "Content for Page 3" },
//     // Add more pages as needed
//   ];
  const [forceUpdate, setForceUpdate] = useState(false);
  const [interviewQuestions, setInterviewQuestions] = useState<any | [] >([])
  const [videoUrl, setVideoUrl] = useState<any | [] >([])
  const [loading, setLoading] = useState(false)
//   useEffect(() => {
//     getQuestion("64a846ba88281c598c5348f3").then((res) => {
//         const questions = res[0].questions.map((question: { question: string }) => question.question);
//         setInterviewQuestions(questions);

//         const videoUrl = res[0].questions.map((question: { videoUrl: string }) => question.videoUrl);
//         setInterviewVideo(videoUrl);
//       });
//   })

useEffect(() => {
    const inviteId = localStorage.getItem("inviteId")
    if (inviteId) {
        setLoading(true)
        getQuestion(inviteId).then((res) => {
            const questionsData = res[0].questions.map((question: { question: string, videoUrl: string }) => ({
              question: question.question,
              videoUrl: question.videoUrl,
            }));
            if (interviewNumber && interviewNumber >questionsData.length ) {
                    setLoading(false)
                    router.push("/404");
            }else{
              const videoId = res[0].questions.map((data: { videoId: string }) => data.videoId);
              Promise.all(videoId.map(retriveVideo))
                  .then((results) => {
                      // console.log(results)
                      const videoUrls = results.map((res:any) => res.data.video_url);
                      setVideoUrl(videoUrls);
                      setLoading(false);
                  })
                  .catch((error) => {
                      console.log(error);
              });
              setInterviewQuestions(questionsData);
            }
          });
    }else {
      router.push("/404");
    }
    
      setForceUpdate(prevState => !prevState);
}, [interviewNumber])


  const currentPage = parseInt(interviewNumber?.toString() || "1", 10);
  const pageData = interviewQuestions[currentPage - 1]; 
  const isLastPage = currentPage === interviewQuestions.length;
  const videoData = videoUrl[currentPage - 1]

  return (
      <>
        {loading && 
        <div className="grid h-screen place-items-center">
            <InfinitySpin 
            width='200'
            color="#4fa94d"
            />
        </div>
        }

        <div>
        <InterviewLayout data={[pageData]} currentPage={currentPage} isLastPage={isLastPage} key={forceUpdate.toString()} videoUrl={videoData}/>
        </div>
        
        
      </>
  );
}

export default Interview;
