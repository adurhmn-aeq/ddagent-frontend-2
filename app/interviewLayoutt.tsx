import { AnimatePresence, motion } from "framer-motion";
import { v4 as uuid } from "uuid";
import Link from "next/link";
import React, { useRef, useState, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { z } from "zod";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { createExtractionChainFromZod } from "langchain/chains";
import { useRouter } from "next/router";

import { InterviewsContextType, IInterview } from "@/@types/interview";
import { InterviewContext } from "@/context/InterviewContext";
import Cookies from "universal-cookie";
import Image from "next/image";

export interface Props {
  // next: string
  // audioURL: string
  // interviewNumber: string

  data: any;
  currentPage: any;
  isLastPage: boolean;
  videoUrl: any;
}

const questions = [
  {
    id: 1,
    name: "Business",
    description: "business types and industries",
    difficulty: "Easy",
  },
  {
    id: 2,
    name: "Wealth",
    description: "Initial Capital, Source of Wealth",
    difficulty: "Medium",
  },
];

const interviewers = [
  {
    id: "John",
    name: "John",
    description: "Loves football and hicking",
    level: "L3",
  },
  // {
  //   id: "Richard",
  //   name: "Richard",
  //   description: "A friendly foody",
  //   level: "L5",
  // },
  {
    id: "Sarah",
    name: "Sarah",
    description: "Lovely and approachable ",
    level: "L7",
  },
];

const ffmpeg = createFFmpeg({
  // corePath: `http://localhost:3000/ffmpeg/dist/ffmpeg-core.js`,
  // I've included a default import above (and files in the public directory), but you can also use a CDN like this:
  corePath: "https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js",
  log: true,
});

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function InterviewLayout(props: Props) {
  const router = useRouter();
  const query = router.query;

  const cookies = new Cookies();

  // console.log(props.data)
  const { interviews, saveInterviews } = React.useContext(
    InterviewContext,
  ) as InterviewsContextType;

  // const [interviewQuestions, setInterviewQuestions] = useState([props.question])

  const [selected, setSelected] = useState(questions[0]);
  const [selectedInterviewer, setSelectedInterviewer] = useState(
    interviewers[0],
  );
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const webcamRef = useRef<Webcam | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [seconds, setSeconds] = useState(150);
  const [videoEnded, setVideoEnded] = useState(false);
  const [recordingPermission, setRecordingPermission] = useState(true);
  const [cameraLoaded, setCameraLoaded] = useState(false);
  const vidRef = useRef<HTMLVideoElement>(null);
  const [isSubmitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("Processing");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [generatedFeedback, setGeneratedFeedback] = useState("");
  const [extracted, setExtracted] = useState<any | null>(null);
  const [utterance, setUtterance] = useState<any | null>(null);
  const [playback, setPlayback] = useState(false);
  const [theme, setTheme] = useState("light");

  const [name, setName] = useState<any | null>(null);
  const [email, setEmail] = useState<any | null>(null);
  const [phonenumber, setPhonenumber] = useState<any | null>(null);
  const [id, setId] = useState<any | null>(null);

  const [interviewId, setInterviewId] = useState<any | null>(null);

  // console.log(props.data[0].question)
  const api_key = process.env.OPENAI_API_KEY;

  const chain = createExtractionChainFromZod(
    z.object({
      business_name: z.string().optional(),
      business_place: z.number().optional(),
      business_activity: z.string().optional(),
      business_customers: z.string().optional(),
      business_age: z.string().optional(),
    }),
    new ChatOpenAI({
      modelName: "gpt-3.5-turbo-0613",
      temperature: 0,
      openAIApiKey: "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",
    }),
  );

  const runRequest = async (data: string): Promise<any> => {
    const extractedData = await chain.run(data);
    return extractedData;
  };

  // const handlePlay = () => {
  //   const synth = window.speechSynthesis;
  //   synth.speak(utterance);
  // };
  // useEffect(() => {
  //   const synth = window.speechSynthesis;
  //   const u = new SpeechSynthesisUtterance(props.audioURL);
  //   u.onend = handleEnd
  //   setUtterance(u);

  //   return () => {
  //     synth.cancel();
  //   };
  // }, [])

  useEffect(() => {
    setLoading(true);
    const interviewID = cookies.get("interviewId");
    const username = localStorage.getItem("name");
    const useremail = localStorage.getItem("email");
    const userphonenumber = localStorage.getItem("phonenumber");
    const id = localStorage.getItem("userId");

    setName(username);
    setEmail(useremail);
    setPhonenumber(userphonenumber);
    setId(id);
    setInterviewId(interviewID);

    setLoading(false);
  }, [id, name, email, phonenumber, interviews]);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
  }, [props.currentPage, router]);

  useEffect(() => {
    if (videoEnded) {
      const element = document.getElementById("startTimer");

      if (element) {
        element.style.display = "flex";
      }

      setCapturing(true);
      setIsVisible(false);

      mediaRecorderRef.current = new MediaRecorder(
        webcamRef?.current?.stream as MediaStream,
      );
      mediaRecorderRef.current.addEventListener(
        "dataavailable",
        handleDataAvailable,
      );
      mediaRecorderRef.current.start();
    }
  }, [videoEnded, webcamRef, setCapturing, mediaRecorderRef]);

  const handleStartCaptureClick = useCallback(() => {
    const startTimer = document.getElementById("startTimer");
    if (startTimer) {
      startTimer.style.display = "none";
    }

    if (vidRef.current) {
      vidRef.current.play();
    }
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  // const handleEnd = () => {
  //   // const synth = window.speechSynthesis;
  //   handleStartCaptureClick()
  //   setVideoEnded(true)
  // }

  const handleDataAvailable = useCallback(
    ({ data }: BlobEvent) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks],
  );

  const handleStopCaptureClick = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setCapturing(false);
  }, [mediaRecorderRef, webcamRef, setCapturing]);

  useEffect(() => {
    let timer: any = null;
    if (capturing) {
      timer = setInterval(() => {
        setSeconds((seconds) => seconds - 1);
      }, 1000);
      if (seconds === 0) {
        handleStopCaptureClick();
        setCapturing(false);
        setSeconds(0);
      }
    }
    return () => {
      clearInterval(timer);
    };
  });

  const handleDownload = async () => {
    if (recordedChunks.length) {
      setSubmitting(true);
      setStatus("Processing");

      const file = new Blob(recordedChunks, {
        type: `video/webm`,
      });

      const unique_id = uuid();

      // This checks if ffmpeg is loaded
      if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
      }

      // This writes the file to memory, removes the video, and converts the audio to mp3
      ffmpeg.FS("writeFile", `${unique_id}.webm`, await fetchFile(file));
      await ffmpeg.run(
        "-i",
        `${unique_id}.webm`,
        "-vn",
        "-acodec",
        "libmp3lame",
        "-ac",
        "1",
        "-ar",
        "16000",
        "-f",
        "mp3",
        `${unique_id}.mp3`,
      );

      // This reads the converted file from the file system
      const fileData = ffmpeg.FS("readFile", `${unique_id}.mp3`);
      // This creates a new file from the raw data
      const output = new File([fileData.buffer], `${unique_id}.mp3`, {
        type: "audio/mp3",
      });

      const formData = new FormData();
      formData.append("file", output, `${unique_id}.mp3`);
      formData.append("model", "whisper-1");

      // const question =
      //   selected.name === "Behavioral"
      //     ? `Tell me about yourself. Why don${`’`}t you walk me through your resume?`
      //     : selectedInterviewer.name === "John"
      //       ? "What is a Hash Table, and what is the average case and worst case time for each of its operations?"
      //       : selectedInterviewer.name === "Richard"
      //         ? "Uber is looking to expand its product line. Talk me through how you would approach this problem."
      //         : "You have a 3-gallon jug and 5-gallon jug, how do you measure out exactly 4 gallons?";

      // setStatus("Transcribing");

      // const question = selected.name === "Business"
      //   ? `Can you please explain the nature of your business?`
      //   : selectedInterviewer.name === "John"
      //     ? "Who are your main customers and where are they located?"
      //     : selectedInterviewer.name === "Richard"
      //       ? "Are you or any of your business associates politically exposed persons (PEPs)"
      //       : "What is your business's projected growth for the next 3 years?";

      type QuestionType = {
        [key: string]: {
          [key: string]: string;
        };
      };

      //   const questions: Interviewquestions = {
      //     question_one:question_one,
      //     question_two: question_two,
      //     question_three: question_three
      //   }

      //   const questions: QuestionType = {
      //     "Business": {
      //       "John": `Can you please explain the nature of your business?`,
      //       "Sarah": "Who are your main customers and where are they located?",
      //     },
      //     "Wealth": {
      //       "John": "What is the source of your initial capital or wealth?",
      //       "Sarah": "Can you please explain the reason for the large transaction(s) in your account recently?",
      //     },
      //   };

      //   const question = (questions[selected.name] && questions[selected.name][selectedInterviewer.name])
      //     ? questions[selected.name][selectedInterviewer.name]
      //     : questions[selected.name]['Default'];

      setStatus("Transcribing");

      const upload = await fetch(
        `${
          process.env.NEXT_PUBLIC_PUBLIC_URL
        }/ddvagent/transcribe?question=${encodeURIComponent(
          props.data[0].question as string,
        )}`,
        {
          method: "POST",
          body: formData,
        },
      );

      // const upload = await fetch(
      //   `/api/transcribe?question=${encodeURIComponent(props.data[0].question as string)}`,
      //   {
      //     method: "POST",
      //     body: formData,
      //   }
      // );
      const results = await upload.json();

      if (upload.ok) {
        setIsSuccess(true);
        setSubmitting(false);

        if (results.error) {
          setTranscript(results.error);
        } else {
          setTranscript(results.transcript);
          const dataInfo = await runRequest(results.transcript);
          const temp = [];
          temp.push(dataInfo);
          setExtracted(temp);

          if (!sessionStorage.getItem("Answer_One")) {
            sessionStorage.setItem("Answer_One", results.transcript);
          } else if (!sessionStorage.getItem("Answer_Two")) {
            sessionStorage.setItem("Answer_Two", results.transcript);
          } else {
            sessionStorage.setItem("Answer_Three", results.transcript);
          }
        }

        console.log("Uploaded successfully!");

        await Promise.allSettled([
          new Promise((resolve) => setTimeout(resolve, 800)),
        ]).then(() => {
          setCompleted(true);
          console.log("Success!");
        });

        if (results.transcript.length > 0) {
          // const prompt = `Please give feedback on the following interview question: ${question} given the following transcript: ${results.transcript
          //   }. ${selected.name === "Behavioral"
          //     ? "Please also give feedback on the candidate's communication skills. Make sure their response is structured (perhaps using the STAR or PAR frameworks)."
          //     : "Please also give feedback on the candidate's communication skills. Make sure they accurately explain their thoughts in a coherent way. Make sure they stay on topic and relevant to the question."
          //   } \n\n\ Feedback on the candidate's response:`;

          const prompt = `Please review the following due diligence question: ${
            props.data[0].question
          } and the transcript of the customer's response: ${
            results.transcript
          }. ${
            selected.name === "Business"
              ? "Please provide feedback on the customer's comprehension about the question that has been asked. Ensure their responses are clear, structured, and relevant to the question."
              : "Please also provide feedback on the customer's communication skills. Make sure they explain their financial position in a coherent and accurate way, staying on topic and relevant to the question."
          } \n\n\ Feedback on the customer's response:`;

          setGeneratedFeedback("");
          const response = await fetch("/api/generate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prompt,
            }),
          });

          if (!response.ok) {
            throw new Error(response.statusText);
          }

          // This data is a ReadableStream
          const data = response.body;
          if (!data) {
            return;
          }

          const reader = data.getReader();
          const decoder = new TextDecoder();
          let done = false;
          const temp = [];
          while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            const chunkValue = decoder.decode(value);
            temp.push(chunkValue);
            const result = temp.join("");
            setGeneratedFeedback((prev: any) => prev + chunkValue);
          }
          const updatedInterviews: IInterview = {
            interviews: {
              question: props.data[0].question,
              answer: results.transcript,
              feedback: temp.join(""),
            },
          };
          // console.log(props.data[0].question)
          saveInterviews(updatedInterviews);

          // if (props.currentPage === 0 ) {
          //   saveInterview(id, name, email, phonenumber, updatedInterviews).then((res) => {
          //     console.log(res)
          //     console.log(res._id)
          //     cookies.set('interviewId', res._id, {
          //       path: "/",
          //   })
          //   })
          // }else{
          //   updateInterview(interviewId, updatedInterviews).then((res) => {
          //     console.log(res)
          //   })
          // }

          // if (!sessionStorage.getItem("Feedback_One")) {
          //   sessionStorage.setItem("Feedback_One", temp.join(""))
          // }else if (!sessionStorage.getItem("Feedback_Two")) {
          //   sessionStorage.setItem("Feedback_Two", temp.join(""))
          // }else{
          //   sessionStorage.setItem("Feedback_Three", temp.join(""))
          // }
          // if (!props.isLastPage) {
          //   router.push(`/interview/${props.currentPage+1}`)
          // }else{
          //   router.push("/finalresult")
          // }
          // router.push(props.next, undefined, { shallow: true })

          if (!props.isLastPage) {
            // const nextPage = props.currentPage + 1;
            router.push(`/interview/${props.currentPage + 1}`);
            // window.location.href = `/interview/${nextPage}`;
          } else {
            router.push("/result", undefined, { shallow: true });
            // window.location.href = `/result`;
          }
          // router.push(`/interview/${id+1}`)
        }
      } else {
        console.error("Upload failed.");
      }
      setTimeout(function () {
        setRecordedChunks([]);
      }, 1500);
    }
  };

  // const handleNext = () => {

  //   if (!props.isLastPage) {
  //     const nextPage = props.currentPage + 1;
  //     window.location.href = `/interview/${nextPage}`;
  //   }else{
  //     window.location.href = `/finalresult`;
  //   }
  //   // router.push(`/interview/${id+1}`)
  // }

  function restartVideo() {
    setRecordedChunks([]);
    setVideoEnded(false);
    setCapturing(false);
    setIsVisible(true);
    setSeconds(150);
  }

  const videoConstraints = isDesktop
    ? { width: 1280, height: 720, facingMode: "user" }
    : { width: 480, height: 640, facingMode: "user" };

  const handleUserMedia = () => {
    setTimeout(() => {
      setLoading(false);
      setCameraLoaded(true);
    }, 1000);
  };

  useEffect(() => {
    // Check if user has a preferred theme
    const savedTheme = window.localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Save theme to local storage
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div
      className={`${
        theme === "dark" ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {props.data.map((item: any, index: number) => (
        <AnimatePresence key={index}>
          <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden px-4 pb-8 pt-2 md:px-8 md:py-2">
            {/* <Link href="/">
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
          </Link> */}

            <div className="text-white-500 absolute left-[0] top-5 ml-6 flex border-lime-500 md:left-5">
              <Image
                src="/line1.png"
                width={1}
                height={10}
                alt="line"
                className="mr-0 sm:ml-0  md:mr-3.5"
              />
              <Image
                className="mt-3.5 h-5 md:ml-6 md:mr-1 "
                src={
                  theme === "dark"
                    ? "/Iconsvgspeaker.svg"
                    : "/Action-Button/icSpeakerbl.svg"
                }
                width={20}
                height={15}
                alt="speaker"
              />
              <h1 className="ml-2  mt-3 font-extralight md:font-normal">
                Sarah (AI), {name} (You)
              </h1>
            </div>

            <div className="absolute right-5 top-5 flex md:right-20">
              <Image
                src={
                  theme === "dark"
                    ? "/elipseSVG.svg"
                    : "/Action-Button/live4.svg"
                }
                width={50}
                height={50}
                alt="live"
                className="mr-3 text-black"
              />
              <div className="flex rounded-lg border border-lime-500 p-2 px-5">
                <Image
                  src={
                    theme === "dark"
                      ? "/Action-Button/Iconpersons.svg"
                      : "/Action-Button/IconiconPersons2.svg"
                  }
                  width={30}
                  height={30}
                  alt="persons"
                  className="mr-3"
                />
                <h2 className="absolute right-4 top-3 font-bold">2</h2>
              </div>
            </div>

            <div></div>

            {completed ? (
              <div className="mx-auto mt-[10vh] flex w-full max-w-[1080px] flex-col overflow-y-auto pb-8 md:pb-12">
                <motion.div
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.35, ease: [0.075, 0.82, 0.165, 1] }}
                  className="relative flex w-full max-w-[1080px] flex-col items-center justify-center overflow-hidden rounded-lg bg-[#1D2B3A] shadow-md ring-1 ring-gray-900/5 md:aspect-[16/9]"
                >
                  <video
                    className="h-full w-full rounded-lg"
                    controls
                    crossOrigin="anonymous"
                    // autoPlay
                    onEnded={() => setPlayback(true)}
                  >
                    <source
                      src={URL.createObjectURL(
                        new Blob(recordedChunks, { type: "video/mp4" }),
                      )}
                      type="video/mp4"
                    />
                  </video>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.5,
                    duration: 0.15,
                    ease: [0.23, 1, 0.82, 1],
                  }}
                  className="mt-2 flex flex-col items-center space-y-1 md:mt-4 md:flex-row md:justify-between md:space-y-0"
                >
                  <div className="flex flex-row items-center space-x-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-4 w-4 shrink-0 text-[#407BBF]"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                      />
                    </svg>
                    <p className="text-[14px] font-normal leading-[20px] text-[#1a2b3b]">
                      Video is not stored on our servers, and will go away as
                      soon as you leave the page.
                    </p>
                  </div>
                  {/* <Link
                  href="https://github.com/Tameyer41/liftoff"
                  target="_blank"
                  className="group rounded-full pl-[8px] min-w-[180px] pr-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center bg-[#1E2B3A] text-white hover:[linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), #0D2247] no-underline flex gap-x-2  active:scale-95 scale-100 duration-75"
                  style={{
                    boxShadow:
                      "0px 1px 4px rgba(13, 34, 71, 0.17), inset 0px 0px 0px 1px #061530, inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <span className="w-5 h-5 rounded-full bg-[#407BBF] flex items-center justify-center">
                    <svg
                      className="w-[16px] h-[16px] text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.75 7.75C4.75 6.64543 5.64543 5.75 6.75 5.75H17.25C18.3546 5.75 19.25 6.64543 19.25 7.75V16.25C19.25 17.3546 18.3546 18.25 17.25 18.25H6.75C5.64543 18.25 4.75 17.3546 4.75 16.25V7.75Z"
                      ></path>
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5.5 6.5L12 12.25L18.5 6.5"
                      ></path>
                    </svg>
                  </span>
                  Star on Github
                </Link> */}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.5,
                    duration: 0.15,
                    ease: [0.23, 1, 0.82, 1],
                  }}
                  className="mt-8 flex flex-col"
                >
                  <div>
                    <h2 className="mb-2 text-left text-xl font-semibold text-[#1D2B3A]">
                      Transcript
                    </h2>
                    <p className="prose prose-sm max-w-none">
                      {transcript.length > 0
                        ? transcript
                        : "Don't think you said anything. Want to try again?"}
                    </p>
                  </div>
                  {/* <div className="mt-8">
                  <h2 className="text-xl font-semibold text-left text-[#1D2B3A] mb-2">
                    Feedback
                  </h2>
                  <div className="mt-4 text-sm flex gap-2.5 rounded-lg border border-[#EEEEEE] bg-[#FAFAFA] p-4 leading-6 text-gray-900 min-h-[100px]">
                    <p className="prose prose-sm max-w-none">
                      {generatedFeedback}
                    </p>
                  </div>
                </div> */}
                  {/* <div className="w-fit my-0 mx-auto mt-6">
                    <button
                    onClick={handleNext}
                        className="group rounded-full px-4 py-2 text-[13px] font-extrabold transition-all flex items-center justify-center bg-green-400 text-[#fff] no-underline active:scale-95 scale-100 duration-75 "
                        style={{
                          boxShadow: "0 1px 1px #0c192714, 0 1px 3px #0c192724",
                        }}
                      >
                        Next
                      </button>
                    </div> */}
                </motion.div>
              </div>
            ) : (
              <div className="mt-[10vh] flex h-full w-full flex-col">
                {recordingPermission ? (
                  <div className="mt-3 flex h-screen flex-col justify-between pl-5 md:flex-col lg:flex-row">
                    <div className="flex w-full max-w-screen-xl flex-col justify-between md:flex-col lg:flex-row">
                      {/* w-full flex flex-col max-w-[1080px] mx-auto justify-center  */}

                      <div className="lg:w-2/3">
                        <motion.div
                          initial={{ y: -20 }}
                          animate={{ y: 0 }}
                          transition={{
                            duration: 0.35,
                            ease: [0.075, 0.82, 0.965, 1],
                          }}
                          className="relative aspect-[16/9] h-2/3 w-full max-w-[1080px] overflow-hidden rounded-lg bg-[#1D2B3A] shadow-md ring-1 ring-gray-900/5"
                        >
                          {!cameraLoaded && (
                            <div className="absolute left-1/2 top-1/2 z-20 flex items-center text-white">
                              <svg
                                className="mx-auto my-0.5 h-4 w-4 animate-spin text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth={3}
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                            </div>
                          )}
                          <div className="relative z-10 h-full w-full rounded-lg">
                            <div className="absolute left-5 top-5 z-20 lg:left-10 lg:top-10">
                              <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-sm font-medium text-gray-800">
                                {new Date(seconds * 1000)
                                  .toISOString()
                                  .slice(14, 19)}
                              </span>
                            </div>
                            {isVisible && ( // If the video is visible (on screen) we show it
                              <div className="absolute left-auto right-[10px] top-[10px] z-20 block aspect-video h-[80px] rounded sm:right-[20px] sm:top-[20px] sm:h-[140px] md:right-10 md:h-[180px] lg:top-[40px]">
                                <div className="aspect-video h-full w-full rounded md:rounded-lg lg:rounded-xl">
                                  {props.videoUrl ? (
                                    <video
                                      id="question-video"
                                      onEnded={() => setVideoEnded(true)}
                                      controls={false}
                                      ref={vidRef}
                                      playsInline
                                      className="absolute right-0 aspect-video h-28 w-28 rounded-md object-cover md:rounded-[12px]"
                                      crossOrigin="anonymous"
                                    >
                                      <source
                                        src={props.videoUrl}
                                        type="video/mp4"
                                      />
                                    </video>
                                  ) : null}
                                  {/* <p>{item === undefined ? "" : `${item.videoUrl}`}</p> */}
                                </div>
                              </div>
                            )}
                            {/* @ts-ignore */}
                            <Webcam
                              mirrored
                              audio
                              muted
                              ref={webcamRef}
                              videoConstraints={videoConstraints}
                              onUserMedia={handleUserMedia}
                              onUserMediaError={(error) => {
                                setRecordingPermission(false);
                              }}
                              className="absolute z-10 min-h-[100%] w-auto min-w-[100%] object-cover sm:h-0"
                            />
                          </div>
                          {loading && (
                            <div className="absolute flex h-full w-full items-center justify-center">
                              <div className="relative h-[112px] w-[112px] rounded-lg object-cover text-[2rem]">
                                <div className="flex h-[112px] w-[112px] items-center justify-center rounded-[0.5rem] bg-[#4171d8] !text-white">
                                  Loading...
                                </div>
                              </div>
                            </div>
                          )}

                          {cameraLoaded && (
                            <div className="absolute bottom-0 left-0 z-50 flex h-[82px] w-full items-center justify-center">
                              {recordedChunks.length > 0 ? (
                                <>
                                  {isSuccess ? (
                                    <button
                                      className="cursor-disabled group group inline-flex min-w-[140px] items-center justify-center rounded-full bg-green-500 px-4 py-2 text-[13px] text-sm font-semibold text-white duration-150 hover:bg-green-600 hover:text-slate-100 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 active:scale-100 active:bg-green-800 active:text-green-100"
                                      style={{
                                        boxShadow:
                                          "0px 1px 4px rgba(27, 71, 13, 0.17), inset 0px 0px 0px 1px #5fc767, inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1)",
                                      }}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="mx-auto h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                      >
                                        <motion.path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                          initial={{ pathLength: 0 }}
                                          animate={{ pathLength: 1 }}
                                          transition={{ duration: 0.5 }}
                                        />
                                      </svg>
                                    </button>
                                  ) : (
                                    <div className="flex flex-row gap-2">
                                      {!isSubmitting && (
                                        <button
                                          onClick={() => restartVideo()}
                                          className="hover:[linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), #0D2247] group flex flex scale-100 items-center justify-center gap-x-2 rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-[#1E2B3A] no-underline  transition-all duration-75 active:scale-95"
                                        >
                                          Restart
                                        </button>
                                      )}
                                      <button
                                        onClick={handleDownload}
                                        disabled={isSubmitting}
                                        className="hover:[linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), #0D2247] group flex flex min-w-[140px] scale-100 items-center justify-center rounded-full bg-[#1E2B3A] px-4 py-2 text-[13px] font-semibold text-white no-underline  transition-all duration-75 active:scale-95  disabled:cursor-not-allowed"
                                        style={{
                                          boxShadow:
                                            "0px 1px 4px rgba(13, 34, 71, 0.17), inset 0px 0px 0px 1px #061530, inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1)",
                                        }}
                                      >
                                        <span>
                                          {isSubmitting ? (
                                            <div className="flex items-center justify-center gap-x-2">
                                              <svg
                                                className="mx-auto h-5 w-5 animate-spin text-slate-50"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                              >
                                                <circle
                                                  className="opacity-25"
                                                  cx="12"
                                                  cy="12"
                                                  r="10"
                                                  stroke="currentColor"
                                                  strokeWidth={3}
                                                ></circle>
                                                <path
                                                  className="opacity-75"
                                                  fill="currentColor"
                                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                              </svg>
                                              <span>{status}</span>
                                            </div>
                                          ) : (
                                            <div className="flex items-center justify-center gap-x-2">
                                              <span>Process transcript</span>
                                              <svg
                                                className="h-5 w-5"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <path
                                                  d="M13.75 6.75L19.25 12L13.75 17.25"
                                                  stroke="white"
                                                  strokeWidth="1.5"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                />
                                                <path
                                                  d="M19 12H4.75"
                                                  stroke="white"
                                                  strokeWidth="1.5"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                />
                                              </svg>
                                            </div>
                                          )}
                                        </span>
                                      </button>
                                    </div>
                                  )}
                                </>
                              ) : (
                                <div className="absolute bottom-[6px] left-5 right-5 md:bottom-5">
                                  <div className="flex flex-col items-center justify-center gap-2 lg:mt-4">
                                    {/* {capturing ? (
                                <div
                                  id="stopTimer"
                                  onClick={handleStopCaptureClick}
                                  className="flex h-10 w-10 flex-col items-center justify-center rounded-full bg-transparent text-white hover:shadow-xl ring-4 ring-white  active:scale-95 scale-100 duration-75 cursor-pointer"
                                >
                                  <div className="h-5 w-5 rounded bg-red-500 cursor-pointer"></div>
                                </div>
                              ) : (
                                <button
                                  id="startTimer"
                                  onClick={handleStartCaptureClick}
                                  // onClick={() => {handlePlay()}}
                                  className="flex h-8 w-8 sm:h-8 sm:w-8 flex-col items-center justify-center rounded-full bg-red-500 text-white hover:shadow-xl ring-4 ring-white ring-offset-gray-500 ring-offset-2 active:scale-95 scale-100 duration-75"
                                ></button>
                              )} */}
                                    <div className="w-12"></div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                          <div
                            className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 transform text-center text-5xl font-semibold text-white"
                            id="countdown"
                          ></div>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: 0.5,
                            duration: 0.15,
                            ease: [0.23, 1, 0.82, 1],
                          }}
                          className="mt-4 flex flex-row items-center space-x-1"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="h-4 w-4 text-[#407BBF]"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                            />
                          </svg>
                          <p className="text-[14px] font-normal leading-[20px] text-[#1a2b3b]">
                            Video is not stored on our servers, it is solely
                            used for transcription.
                          </p>
                        </motion.div>
                        <div className="mt-3">
                          {/* <audio autoPlay controls><source src={props.audioURL} type="audio/mpeg" /></audio> */}
                          {/* <button 
                  className="group rounded-full px-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center bg-[#f5f7f9] text-[#1E2B3A] no-underline active:scale-95 scale-100 duration-75"
                  onClick={handlePlay}><BsVolumeUp size={25} color="#000"/></button> */}
                        </div>
                      </div>

                      <div className="flex w-full flex-col items-center justify-center space-y-4 p-4 sm:right-0 lg:absolute lg:right-20 lg:ml-20 lg:w-1/3">
                        <h1 className="font-sora text-center text-xl font-normal leading-normal text-[#44bb4e] sm:text-5xl lg:text-5xl ">
                          {item === undefined ? "Loading" : item.question}
                        </h1>

                        <div className="">
                          <div className="flex flex-col items-center justify-center space-y-4">
                            {capturing ? (
                              <div
                                id="stopTimer"
                                onClick={handleStopCaptureClick}
                                className="cursor-pointer rounded-full border-2 border-none transition-transform hover:scale-110"
                              >
                                <Image
                                  className=""
                                  src="/speekerrr.svg"
                                  width={200}
                                  height={200}
                                  alt="speak"
                                />
                              </div>
                            ) : (
                              <div
                                id="startTimer"
                                onClick={handleStartCaptureClick}
                                className="cursor-pointer rounded-full border-2 border-none transition-transform hover:scale-110"
                              >
                                <Image
                                  className=""
                                  src="/speekerrr.svg"
                                  width={200}
                                  height={200}
                                  alt="speak"
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* <span className="text-[14px] leading-[20px] text-[#1a2b3b] font-normal mb-4">
                              Make sure you provide descriptive answers to questions being asked. Use as much examples as you can.
                          </span> */}
                      </div>
                    </div>
                    <div className="fixed bottom-8 left-8">
                      <Image
                        src="/33verified.svg"
                        width={96}
                        height={96}
                        alt="verified"
                      />
                    </div>

                    <button
                      className="fixed bottom-8 right-8 flex rounded-lg border border-lime-500 p-2 px-5 hover:bg-lime-700"
                      onClick={() =>
                        setTheme((prevTheme) =>
                          prevTheme === "dark" ? "light" : "dark",
                        )
                      }
                    >
                      Toggle Theme
                    </button>
                  </div>
                ) : (
                  <div className="mx-auto flex w-full max-w-[1080px] flex-col justify-center">
                    <motion.div
                      initial={{ y: 20 }}
                      animate={{ y: 0 }}
                      transition={{
                        duration: 0.35,
                        ease: [0.075, 0.82, 0.165, 1],
                      }}
                      className="relative flex w-full max-w-[1080px] flex-col items-center justify-center overflow-hidden rounded-lg bg-[#1D2B3A] shadow-md ring-1 ring-gray-900/5 md:aspect-[16/9]"
                    >
                      <p className="max-w-3xl text-center text-lg font-medium text-white">
                        Camera permission is denied. We don{`'`}t store your
                        attempts anywhere, but we understand not wanting to give
                        us access to your camera. Try again by opening this page
                        in an incognito window {`(`}or enable permissions in
                        your browser settings{`)`}.
                      </p>
                    </motion.div>
                    <div className="mt-8 flex flex-row justify-end space-x-4">
                      <button
                        onClick={() => setStep(1)}
                        className="group flex max-w-[200px] scale-100 items-center justify-center rounded-full bg-[#f5f7f9] px-4 py-2 text-[13px] font-semibold text-[#1E2B3A] no-underline transition-all duration-75 active:scale-95"
                        style={{
                          boxShadow: "0 1px 1px #0c192714, 0 1px 3px #0c192724",
                        }}
                      >
                        Restart demo
                      </button>
                      <Link
                        href="https://github.com/Tameyer41/liftoff"
                        target="_blank"
                        className="hover:[linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), #0D2247] group flex flex min-w-[180px] scale-100 items-center justify-center gap-x-2 rounded-full bg-[#1E2B3A] py-2 pl-[8px] pr-4 text-[13px] font-semibold text-white no-underline  transition-all duration-75 active:scale-95"
                        style={{
                          boxShadow:
                            "0px 1px 4px rgba(13, 34, 71, 0.17), inset 0px 0px 0px 1px #061530, inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1)",
                        }}
                      >
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#407BBF]">
                          <svg
                            className="h-[16px] w-[16px] text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4.75 7.75C4.75 6.64543 5.64543 5.75 6.75 5.75H17.25C18.3546 5.75 19.25 6.64543 19.25 7.75V16.25C19.25 17.3546 18.3546 18.25 17.25 18.25H6.75C5.64543 18.25 4.75 17.3546 4.75 16.25V7.75Z"
                            ></path>
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5.5 6.5L12 12.25L18.5 6.5"
                            ></path>
                          </svg>
                        </span>
                        Star on Github
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </AnimatePresence>
      ))}
    </div>
  );
}
