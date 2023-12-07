import React, { useCallback, useEffect, useRef } from "react";
import Cookies from "universal-cookie";
import { Text, Box, Avatar, Button } from "@chakra-ui/react";
import "../interview.css";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { getUserCompanyDetails } from "@/utils/company";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import hark, { Harker } from "hark";
import * as yup from "yup";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import Webcam from "react-webcam";
import Draggable from "react-draggable";
import { DraggableEvent } from "react-draggable";
import { HiOutlineUsers } from "react-icons/hi2";
import { GoDotFill } from "react-icons/go";
import {
  BsFillMicFill,
  BsFillMicMuteFill,
  BsFillCameraVideoFill,
  BsFillCameraVideoOffFill,
} from "react-icons/bs";
import Image from "next/image";
import { AssistantAvatar } from "@/pages/dashboard/audio/sessions/[id]";
import useWebSocket from "react-use-websocket";
import RecordRTC from "recordrtc";

import Joyride from "react-joyride";
import ReactHowler from "react-howler";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { Work_Sans } from "next/font/google";

const worksans = Work_Sans({ subsets: ["latin"] });

interface InputDeviceInfo {
  deviceId: string;
  groupId: string;
  kind: MediaDeviceKind;
  label: string;
  toJSON(): any;
}
const ffmpeg = createFFmpeg({
  // corePath: `http://localhost:3000/ffmpeg/dist/ffmpeg-core.js`,
  // I've included a default import above (and files in the public directory), but you can also use a CDN like this:
  corePath: "https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js",
  log: true,
});

const schema = yup
  .object({
    name: yup.string().required("Name is required"),

    email: yup
      .string()
      .email("Please enter a valid email")
      .required("Enter your email"),

    phoneNumber: yup.string().required("Phone number is required"),
  })
  .required();

let mediaRecorder: MediaRecorder;

function InterviewPage() {
  const cookies = new Cookies();

  const [theme, setTheme] = useState("dark");
  const router = useRouter();
  const { isReady } = router;
  // on load. confirm agent slug else return error
  // on load confirm agent slug / whisper to agent by slug

  const [messages, setMessages] = useState([] as string[]);
  const [audio, setAudio] = useState("");
  const [playing, setPlaying] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [isVideoOn, setisVideoOn] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });
  const [companyImage, setCompanyImage] = useState<any | null>(null);
  const [step, setStep] = useState<"Form" | "Interview">("Form");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [close, setClose] = useState(false);
  const [mouseOver, setMouseOver] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [microphoneDevices, setMicrophoneDevices] = useState<InputDeviceInfo[]>(
    [],
  );
  const [microphoneDeviceId, setMicrophoneDeviceId] = useLocalStorage(
    "audioDeviceId",
    "",
  );
  const [micMuted, setMicMuted] = useState(false);
  const sessionToken = useRef("");
  const previousMessages = useRef<Array<any>>([]);
  const voice = useRef("");
  const prompt = useRef("");
  const initiationMessage = useRef("");
  const agentName = useRef("");
  const baseURL = process.env.NEXT_PUBLIC_PUBLIC_URL || "http://localhost:9000";
  const nodeRef = React.useRef(null);
  const [isMobile, setIsMobile] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [isMobileLandscape, setIsMobileLandscape] = React.useState(false);
  const [showMobileWarning, setShowMobileWarning] = useState(false);
  const [readInstructions, setReadInstructions] = useState(false);

  const steps = [
    {
      title: <h2 className="text-2xl font-semibold">Welcome!!</h2>,
      content: (
        <p
          style={{
            // @ts-ignore
            textWrap: "balance",
          }}
        >
          Please spare a minute to learn about our page
        </p>
      ),

      placement: "center",
      target: "body",
    },
    {
      target: ".agent-screen",
      content: "This section is for the agent reponses",
    },
    {
      target: ".microphone",
      content: "Speak by tapping this button to mute & unmute your microphone ",
    },
  ];

  const handleDrag = (e: DraggableEvent, data: { x: number; y: number }) => {
    setPosition({ x: data.x, y: data.y });
  };

  useEffect(() => {
    if (window.innerWidth <= 800) {
      setShowMobileWarning(true);
    }
  }, []);
  const handleSnap = () => {
    // const threshold = 100; // Adjust this threshold as needed
    // const x = position.x;
    // const y = position.y;
    // // Calculate the snap positions based on the viewport size
    // const snapX = x < window.innerWidth / 2 ? 0 : window.innerWidth;
    // const snapY = y < window.innerHeight / 2 ? 0 : window.innerHeight;
    // // Snap to top-left, top-right, bottom-left, or bottom-right
    // if (x < threshold) {
    //   setPosition({ x: snapX, y: snapY });
    // } else {
    //   setPosition({ x: snapX, y: snapY });
    // }
  };

  function checkMobileScreen(width: number, height: number) {
    // @ts-ignore
    window.mobileCheck = function () {
      let check = false;
      (function (a) {
        if (
          /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
            a,
          ) ||
          /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
            a.substr(0, 4),
          )
        )
          check = true;
        // @ts-ignore
      })(navigator.userAgent || navigator.vendor || window.opera);
      return check;
    };

    // @ts-ignore
    if (window.mobileCheck()) {
      // console.log("Mobile");
      setIsMobile(true);
    } else {
      // console.log("Desktop");
      setPosition({ x: 0, y: 0 });
      setIsMobile(false);
    }

    // @ts-ignore
    if (window.mobileCheck() && width > height) {
      setIsMobileLandscape(true);
      // @ts-ignore
    } else if (window.mobileCheck() && width < height) {
      setIsMobileLandscape(false);
    }
  }

  useEffect(() => {
    checkMobileScreen(window.innerWidth, window.innerHeight);
    window.addEventListener("resize", () => {
      checkMobileScreen(window.innerWidth, window.innerHeight);
      // console.log(window.innerHeight, window.innerWidth);
    });
  }, []);

  const selectAudioDevice = useCallback(
    async (deviceId: string) => {
      setMicrophoneDeviceId(deviceId);
    },
    [setMicrophoneDeviceId],
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id: string | undefined = router.query.id?.toString();
        if (id) {
          const userToken = cookies.get("token");
          const data = await getUserCompanyDetails(id, userToken);
          if (data.length === 0) {
            setLoading(false);
          } else {
            const base64String = new Buffer(data[0].data.data).toString(
              "base64",
            );
            const srcDataURI = `data:image/jpeg;base64,${base64String}`;
            setCompanyImage(srcDataURI);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("Error in getUserCompanyDetails:", error);
        setLoading(false);
      }
    };

    fetchData(); // Call the function to fetch data
  }, [router.query.id]);

  useEffect(() => {
    async function confirmInterviewLink() {
      await axios
        .get(
          process.env.NEXT_PUBLIC_PUBLIC_URL +
            "/agents/interview/" +
            router.query.slug,
        )
        .then((result) => {
          console.log(result);
          sessionToken.current = result.data["session_token"];
          prompt.current = result.data["prompt"];
          // this is temporary, to reduce number of database calls.
          initiationMessage.current = result.data["initiation_message"];
          agentName.current = result.data["agent_name"];
          voice.current = result.data["voice"];
        })
        .catch(() => {
          // when it does not exist
          //router.push("/");
        });
    }
    if (isReady) {
      console.log(router.query.slug);
      confirmInterviewLink();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, isEnded]);

  //const [chunks, setChunks] = useState([] as BlobPart[])
  const chunks = useRef([] as BlobPart[]);

  const sendInitiationData = async () => {
    sendData().then((newMessage: any) => {
      //previousMessages.current = newMessage["previous_messages"];

      //console.log(newMessage["audio_data"]);
      // Create a new Blob object from the audio data with MIME type 'audio/mpeg'
      const blob = new Blob([newMessage], { type: "audio/mpeg" });

      // Create a URL for the blob object
      const url = URL.createObjectURL(blob);
      let audioObject = new Audio(url);
      setMessages([...messages, initiationMessage.current]);
      previousMessages.current.push({
        role: "assistant",
        content: initiationMessage.current,
      });
      audioObject.play();
      // record();
    });
  };

  const sendData = async () => {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_PUBLIC_URL}/agents/interview/` +
            router.query.slug +
            "/data",
          {
            name: userDetails.name,
            email: userDetails.email,
            phonenumber: userDetails.phoneNumber,
            audio: msg.current,
            previous_messages: previousMessages.current,
            session_token: sessionToken.current,
            prompt: prompt.current,
            initiation_message: initiationMessage.current,
            voice: voice.current,
          },
          {
            responseType: "arraybuffer",
          },
        )
        .then((res) => {
          console.log("here is the response");
          console.log(res);
          resolve(res.data);
          chunks.current = []; //clear the chunks again
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const sendUserResponse = async () => {
    //

    playRandomFillerWord();

    const result = await axios.post(
      `${process.env.NEXT_PUBLIC_PUBLIC_URL}/agents/interview/` +
        router.query.slug +
        "/conversation",
      {
        query: msg.current,
        previous_messages: previousMessages.current,
        session_token: sessionToken.current,
        prompt: prompt.current,
      },
    );

    const agentResponse = result.data.agent_response;
    setMessages([...messages, agentResponse]);
    previousMessages.current = result.data.previous_messages;
    // split response by punctuations
    var sentences = agentResponse.match(/[^\.!\?]+[\.!\?]+/g) as string[];
    let proms = sentences.map((sentence) =>
      axios
        .post(
          `${process.env.NEXT_PUBLIC_PUBLIC_URL}/agents/interview/` +
            router.query.slug +
            "/text-to-speech",
          {
            text: sentence,
            voice: voice.current,
          },
          {
            responseType: "arraybuffer",
          },
        )
        .then((r) => r.data),
    );

    Promise.all(proms)
      .then((blobs) => {
        let blob = new Blob([...blobs], { type: "audio/mpeg" }),
          blobUrl = URL.createObjectURL(blob),
          audio = new Audio(blobUrl);
        audio.play();
        setIsLoadingResponse(false);
      })
      .then(() => recorder.current?.resumeRecording());

    // console.log(audios);

    // const blob = new Blob(audios, );

    //   const url = URL.createObjectURL(blob);
    //   setMessages([...messages, agentResponse]);
    //   setLoading(false)
    //   setAudio(url);
  };

  const generateFillerWordsAudio = async () => {
    const iterationCount = 0;

    FillerWords.forEach((word) => {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_PUBLIC_URL}/agents/interview/` +
            router.query.slug +
            "/text-to-speech",
          {
            text: word,
            voice: voice.current,
          },
          {
            responseType: "arraybuffer",
          },
        )
        .then((result) => {
          const blob = new Blob([result.data], { type: "audio/mpeg" });
          const url = URL.createObjectURL(blob);
          fillerWordsAudioUrl.current.push(url);
        });
    });
  };

  const playRandomFillerWord = async () => {
    const maxIndex = FillerWords.length - 1;

    const randomIndexToPlay = Math.floor(
      Math.random() * (maxIndex - 0 + 1) + 0,
    );
    const audio = new Audio(fillerWordsAudioUrl.current[randomIndexToPlay]);
    audio.play();
  };

  const [socketUrl, setSocketUrl] = useState("");
  const [elevenLabsSocketUrl, setelevenLabsSocketUrl] = useState("");
  const [shouldConnect, setShouldConnect] = useState(false);
  const msg = useRef("");
  const speech = useRef<Harker>();
  const recorder = useRef<RecordRTC>();
  const [isLoadingResponse, setIsLoadingResponse] = useState<boolean>(false);

  const fillerWordsAudioUrl = useRef<any[]>([]);
  const FillerWords = [
    "Alright...",
    //"So...",
    //"Interesting...",
    //"I see...",
    //"Em...",
    "Hmm...",
    //"Let me see..."
  ];

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(
    socketUrl,
    {
      onOpen: async () => {
        console.log("AssemblyAI WebSocket opened");
        // there should be a loading
        const RecordRTC = (await import("recordrtc")).default;
        const StereoAudioRecorder = RecordRTC.StereoAudioRecorder;
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
          speech.current = hark(stream, {});

          recorder.current = new RecordRTC(stream, {
            type: "audio",
            mimeType: "audio/webm;codecs=pcm", // endpoint requires 16bit PCM audio
            recorderType: StereoAudioRecorder,
            timeSlice: 250, // set 250 ms intervals of data that sends to AAI
            desiredSampRate: 16000,
            numberOfAudioChannels: 1, // realtime requires only one channel
            bufferSize: 16384,
            audioBitsPerSecond: 128000,
            ondataavailable: (blob: any) => {
              const reader = new FileReader();
              reader.onload = () => {
                const base64data = reader.result;
                // audio data must be sent as a base64 encoded string
                sendJsonMessage({
                  audio_data: (base64data as any).split("base64,")[1],
                });
              };
              reader.readAsDataURL(blob);
            },
          });

          speech.current.on("volume_change", () => {
            let speakingHistory = speech.current?.speakingHistory as number[];
            if (
              msg.current &&
              speakingHistory.reduce((acc, el) => acc + el, 0) == 0
            ) {
              console.log("must send data now " + msg.current);
              setIsLoadingResponse(true);
              recorder.current?.pauseRecording();
              sendUserResponse();
              msg.current = "";
            }
          });
        });
      },
    },
    shouldConnect,
  );

  const [transcript, setTranscript] = useState("");
  useEffect(() => {
    const processPartialTranscription = (source: any) => {
      const res = JSON.parse(source.data);

      if (res.text) {
        setTranscript(res.text);

        if (res.message_type == "FinalTranscript") {
          msg.current += res.text;
        }
      }
    };
    if (lastMessage !== null) {
      processPartialTranscription(lastMessage);
    }
  }, [lastMessage]);

  const makeSocketConnections = async () => {
    const { token } = (await axios.get(`${baseURL}/realtime/link`)).data;
    setSocketUrl(
      `wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${token}`,
    );
    setShouldConnect(true);
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

  const loadDevices = useCallback(async () => {
    const availableDevices = await navigator.mediaDevices.enumerateDevices();

    const audioInputDevices = availableDevices.filter(
      (device) => device.kind === "audioinput",
    );
    setMicrophoneDevices(audioInputDevices);
  }, []);

  useEffect(() => {
    loadDevices();
  }, []);

  const toggleMute = () => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => {
        !track.enabled;
      });
      setMicMuted(!micMuted);
    }
  };

  useEffect(() => {
    // Access the user's microphone
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((mediaStream) => {
        setStream(mediaStream);
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });

    // Cleanup when the component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);

  const finalizeSubmission = (
    name: string,
    email: string,
    phoneNumber: string,
  ) => {
    setUserDetails({ name, email, phoneNumber });
    setStep("Interview");
    makeSocketConnections();
    generateFillerWordsAudio();
  };

  useEffect(() => {
    console.log(userDetails);
    if (userDetails.name) sendInitiationData();
  }, [userDetails]);

  const closeModal = (data: boolean) => {
    setClose(data);
    // sendInitiationData();
  };

  const ariaLabel = micMuted ? "Unmute" : "Mute";
  return (
    <div
      className={`${step === "Interview" ? "bg-[#EFFCE8]" : "bg-[#fafcfe]"}`}
    >
      {/* <InformationModal open={open} closeModal={closeModal} /> */}
      {step === "Form" ? (
        <IntroForm
          finalizeSubmission={finalizeSubmission}
          companyImage={companyImage}
        />
      ) : (
        !loading && (
          <>
            <Joyride
              steps={steps as any}
              continuous={true}
              showProgress={true}
              showSkipButton={true}
              debug={true}
            />
            <Box
              m={"auto"}
              height={"100dvh"}
              display={"flex"}
              flexDirection={"column"}
              bg={"rgba(245, 245, 245, 0.67)"}
            >
              <header className="border-b p-6">
                <Image
                  src="/bilic-alt.svg"
                  width={52}
                  height={52}
                  alt="logo"
                  className="aspect-auto"
                />
              </header>
              <Box
                display={["grid"]}
                gridTemplateColumns={["1fr", "1fr", "1fr 1fr"]}
                gap={7}
                flexGrow={"1"}
                position={"relative"}
                className="p-4 pb-3 md:p-8 md:pb-3"
              >
                <Box borderRadius={"20px"} bg={"#061626"} position={"relative"}>
                  <Avatar
                    width={"150px"}
                    height={"150px"}
                    name={agentName.current}
                    src={companyImage}
                    position={"absolute"}
                    inset={0}
                    // insetInlineStart={"20%"}
                    margin={"30% auto"}
                    className="border-2 border-primary-500"
                    bgColor={"white"}
                  />
                  <Box
                    pos={"absolute"}
                    bottom={"50px"}
                    h={"auto"}
                    w={"80%"}
                    left={"10%"}
                  >
                    <Box display={"flex"} gap={4} alignItems={"flex-start"}>
                      <Box>
                        <AssistantAvatar />
                      </Box>
                      <Box>
                        <Text
                          fontWeight={"medium"}
                          color={"#fff"}
                          className="mb-3 font-work_sans"
                        >
                          {agentName.current} (AI)
                        </Text>
                        <Text
                          color={"#fff"}
                          fontWeight={"normal"}
                          className="agent-screen font-work_sans"
                        >
                          {messages[messages.length - 1]}
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Draggable
                  position={position}
                  onDrag={handleDrag}
                  onStop={handleSnap}
                  nodeRef={nodeRef}
                  disabled={!isMobile || isMobileLandscape}
                  bounds="parent"
                >
                  <Box
                    borderRadius={"20px"}
                    bg={["#2b3137", "#2b3137", "#061626"]}
                    position={["absolute", "absolute", "relative"]}
                    draggable={true}
                    w={["40", "60", "100%"]}
                    h={["60", "80", "100%"]}
                    ref={nodeRef}
                    bottom={[2, 2, 0]}
                    right={[2, 2, 0]}
                    display={"flex"}
                  >
                    {isVideoOn ? (
                      // @ts-ignore
                      <Webcam
                        videoConstraints={isVideoOn ? {} : false}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "20px",
                        }}
                      />
                    ) : (
                      <Avatar
                        width={["60px", "80px", "150px"]}
                        height={["60px", "80px", "150px"]}
                        bg={"whatsapp.400"}
                        name={userDetails.name}
                        src="https://bit.ly/dan-abramov"
                        position={"sticky"}
                        inset={0}
                        insetInlineStart={"20%"}
                        margin={"30% auto"}
                      />
                    )}
                    {/* {!isEnded && ( */}
                    <Box
                      pos={"absolute"}
                      bottom={"50px"}
                      h={"auto"}
                      w={"80%"}
                      left={"10%"}
                    >
                      <Box>
                        <Text
                          fontSize="md"
                          fontWeight={"normal"}
                          color={"white"}
                          w={"fit-content"}
                          bg={"rgba(1, 7, 3, 0.80)"}
                          p={"6px 12px"}
                          borderRadius={"6px"}
                          display={["none", "none", "block"]}
                        >
                          {userDetails.name}
                        </Text>
                        <Text
                          color={"#fff"}
                          marginTop={"10px"}
                          display={["none", "none", "block"]}
                        >
                          {transcript}
                        </Text>
                      </Box>
                    </Box>
                    <Box
                      position={"absolute"}
                      left={"50%"}
                      transform={"translateX(-50%)"}
                      textAlign={"center"}
                      bottom={"20.5%"}
                      display={["none", "none", "block"]}
                    >
                      <Box
                        display={"flex"}
                        width={"fit-content"}
                        mx={"auto"}
                        gap={4}
                        justifyContent={"center"}
                        alignItems={"center"}
                        className="microphone"
                      >
                        {/* <Box
                        cursor={"pointer"}
                        bg={"gray.400"}
                        w={"60px"}
                        minW={"60px"}
                        h={"60px"}
                        rounded={"full"}
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"center"}
                        onClick={() => setisVideoOn(!isVideoOn)}
                      >
                        {isVideoOn ? (
                          <BsFillCameraVideoFill size={25} fill={"#fff"} />
                        ) : (
                          <BsFillCameraVideoOffFill size={25} fill={"#fff"} />
                        )}
                      </Box> */}
                        {!isEnded && (
                          <Box
                            className={isRecording ? "pulse" : ""}
                            mx={"auto"}
                            w={"50px"}
                            h={"50px"}
                            bg={"rgba(0, 0, 0, 0.33)"}
                            // borderColor={"whatsapp.400"}
                            // borderWidth={4}
                            rounded={"full"}
                            boxShadow={
                              "0px 8px 6px 0px rgba(0, 0, 0, 0.05), 0px 1px 1px 0px rgba(255, 255, 255, 0.25) inset, 0px -1px 1px 0px rgba(255, 255, 255, 0.10) inset"
                            }
                            onClick={() => {
                              if (!isRecording) {
                                recorder.current?.startRecording();
                              } else {
                                recorder.current?.pauseRecording();
                              }
                              setIsRecording(!isRecording);
                            }}
                            cursor={"pointer"}
                            display={"flex"}
                            alignItems={"center"}
                            justifyContent={"center"}
                          >
                            {isRecording ? (
                              <BsFillMicFill size={20} fill={"#fff"} />
                            ) : (
                              <BsFillMicMuteFill size={20} fill={"#fff"} />
                            )}
                          </Box>
                        )}
                      </Box>
                      {/* {!isEnded && (
                        <Text
                          opacity={1}
                          color={"#ffffff"}
                          marginTop={"20px"}
                          textAlign={"center"}
                          justifyContent={"center"}
                          display={["none", "none", "block"]}
                        >
                          {isRecording
                            ? "You are speaking now. Tap to stop speaking"
                            : "Tap the mic to speak"}
                        </Text>
                      )} */}
                    </Box>
                    {/* )} */}
                  </Box>
                </Draggable>
              </Box>

              <Box
                display={"flex"}
                alignItems={"center"}
                gap={4}
                mt={[0, 0, 4]}
                mx={"auto"}
                mb={4}
                className="mx-auto w-fit"
                borderRadius={"xl"}
                // bg={"#ffffff"}
              >
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  gap={4}
                  bg={"#ffffff"}
                  className="rounded-3xl px-4 py-2"
                >
                  <Text
                    display={"flex"}
                    alignItems={"center"}
                    gap={1}
                    className="text-sm"
                  >
                    <GoDotFill fill="#45D684" />
                    Live
                  </Text>
                  <CountUpTimer />
                </Box>
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-400 p-1 px-2 md:hidden"
                  onClick={() => {
                    if (!isRecording) {
                      recorder.current?.startRecording();
                    } else {
                      recorder.current?.pauseRecording();
                    }
                    setIsRecording(!isRecording);
                  }}
                >
                  {/* <BiPhoneOff size={20} fill="#fff" /> */}
                  {!isRecording ? (
                    <BsFillMicMuteFill size={20} fill={"#fff"} />
                  ) : (
                    <BsFillMicFill size={20} fill={"#fff"} />
                  )}
                </button>
                <Text
                  display={"flex"}
                  alignItems={"center"}
                  gap={3}
                  className="rounded-3xl bg-white px-4 py-2 text-sm"
                >
                  <HiOutlineUsers size={18} />2
                </Text>
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 p-1 px-2"
                  onClick={() => setisVideoOn(!isVideoOn)}
                >
                  {/* <BiPhoneOff size={20} fill="#fff" /> */}
                  {isVideoOn ? (
                    <BsFillCameraVideoFill size={20} fill={"#fff"} />
                  ) : (
                    <BsFillCameraVideoOffFill size={20} fill={"#fff"} />
                  )}
                </button>
              </Box>
            </Box>
          </>
        )
      )}
      {!showMobileWarning && (
        <audio
          autoPlay
          crossOrigin="anonymous"
          controls
          src={`${audio}`}
          style={{ visibility: "hidden" }}
          className="fixed"
        />
      )}

      {audio && showMobileWarning && (
        <ReactHowler src={`${audio}`} playing={playing} />
      )}
    </div>
  );
}

const IntroForm = ({
  finalizeSubmission,
  companyImage,
}: {
  companyImage: any | null;
  finalizeSubmission: (
    name: string,
    email: string,
    phoneNumber: string,
  ) => void;
}) => {
  const [readInstructions, setReadInstructions] = useState(false);
  const [formDetails, setFormDetails] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  const onSubmit = () => {
    try {
      finalizeSubmission(
        formDetails.name,
        formDetails.email,
        formDetails.phoneNumber,
      );
    } catch (e) {
      console.log("error preparing things.");
    }
  };

  return (
    <div
      className="m-auto flex h-screen max-w-lg flex-col justify-center"
      key={1}
    >
      <div className="mx-auto mb-10 flex w-[90%] px-9 md:w-[65%] md:px-1">
        <img
          className="w-20"
          src={
            companyImage === null ? "/bilic_logo_green.svg" : `${companyImage}`
          }
          alt=""
        />
      </div>
      <div>
        {!readInstructions ? (
          <div className="mx-auto w-[90%] rounded-3xl border-4 border-[white] bg-[#F2FAFB2E] px-9 py-8 backdrop-blur-3xl md:w-[80%]">
            <p>
              This is an AI video conducted interview you are about taking part
              in. The interview is to test your capabilities across a wide range
              of questions which you are to supply answers to.
            </p>
            <p className="mt-4">
              Please speak correctly and fluently into the microphone when
              answering the questions before you and also try to answer the
              qustions within the alloted timeframe
            </p>
            <button
              onClick={() => setReadInstructions(true)}
              className="focus:shadow-outline mt-5 w-full rounded-3xl px-4 py-[10px] text-sm text-white  hover:bg-green-700 focus:outline-none"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255, 255, 255, 0.20) 0%, rgba(255, 255, 255, 0.00) 100%), #68BA38",
                boxShadow:
                  "0px 0px 0px 1px #5EA933, 0px 1px 2px 0px rgba(104, 186, 56, 0.50)",
              }}
              type="button"
            >
              Next
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-[rgba(242, 250, 251, 0.18)] mx-auto w-[90%] rounded-3xl border-4 border-white px-9 py-8 backdrop-blur-3xl md:w-[80%]"
          >
            <label className="mb-2 block text-xs" htmlFor="name">
              Name
            </label>
            <input
              className="mb-3 block w-full appearance-none rounded-lg border border-gray-200 px-4 py-3 text-base leading-tight text-gray-700 focus:border-gray-500 focus:outline-none"
              id="name"
              type="text"
              {...register("name", {})}
              onChange={(e) => {
                setFormDetails({ ...formDetails, name: e.target.value });
              }}
              placeholder="John Doe"
            />

            <p className="text-xs text-red-600">{errors.name?.message}</p>
            <div className="mt-5">
              <label className="mb-2 block text-xs" htmlFor="email">
                Email
              </label>
              <input
                {...register("email", {})}
                className="mb-3 block w-full appearance-none rounded-lg border border-gray-200 px-4 py-3 text-base leading-tight text-gray-700 focus:border-gray-500 focus:outline-none"
                id="email"
                type="email"
                onChange={(e) => {
                  setFormDetails({ ...formDetails, email: e.target.value });
                }}
                placeholder="doe@example.com"
              />
              <p className="text-xs text-red-600">{errors.email?.message}</p>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-xs" htmlFor="grid-password">
                Phone number
              </label>
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field: { onChange } }) => (
                  <PhoneInput
                    country={"us"}
                    inputStyle={{
                      width: "100%",
                      fontSize: "16px",
                      paddingTop: "1.25rem",
                      paddingBottom: "1.25rem",
                      paddingLeft: "3.5rem",
                      borderRadius: "8px",
                      borderColor: "rgba(229, 231, 235, 1)",
                    }}
                    inputClass={`input-phone ${worksans.className}`}
                    // inputClass="w-full border rounded py-3 px-4 focus:outline-none focus:border-gray-500"
                    containerClass="phone-container"
                    // containerStyle="w-full"
                    // value={phoneNumber}
                    onChange={(phone) => {
                      setFormDetails({ ...formDetails, phoneNumber: phone });
                      onChange(phone);
                    }}
                  />
                )}
              />
              <p className="text-base text-red-600">
                {errors.phoneNumber?.message}
              </p>
            </div>
            <div className="mt-4 flex max-w-xl justify-center">
              <button
                // onClick={() => handleRef(2)}
                className="focus:shadow-outline mt-2 w-full rounded-3xl px-4 py-[10px] text-sm text-white hover:bg-green-700 focus:outline-none"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255, 255, 255, 0.20) 0%, rgba(255, 255, 255, 0.00) 100%), #68BA38",
                  boxShadow:
                    "0px 0px 0px 1px #5EA933, 0px 1px 2px 0px rgba(104, 186, 56, 0.50)",
                }}
                type="submit"
              >
                Start Interview
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

function CountUpTimer() {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const intervalID = setInterval(() => {
      setTime((prevTime) => {
        const newSeconds = prevTime.seconds + 1;

        if (newSeconds === 60) {
          const newMinutes = prevTime.minutes + 1;

          if (newMinutes === 60) {
            return { hours: prevTime.hours + 1, minutes: 0, seconds: 0 };
          }

          return { ...prevTime, minutes: newMinutes, seconds: 0 };
        }

        return { ...prevTime, seconds: newSeconds };
      });
    }, 1000);

    return () => {
      clearInterval(intervalID);
    };
  }, []);

  return (
    <>
      {time.hours ? (
        <Text
          className="text-sm"
          fontWeight={"normal"}
          textAlign={"center"}
        >{`${String(time.hours).padStart(2, "0")}:`}</Text>
      ) : null}
      <Text
        className="text-sm"
        fontWeight={"normal"}
        textAlign={"center"}
      >{`${String(time.minutes).padStart(2, "0")}:${String(
        time.seconds,
      ).padStart(2, "0")}`}</Text>
    </>
  );
}

export default InterviewPage;
