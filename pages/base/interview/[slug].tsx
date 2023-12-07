import React, { useCallback, useEffect, useRef } from "react";
import Cookies from "universal-cookie";
import { v4 as uuid } from "uuid";
import { Flex, Text, Box,  Menu,
  MenuButton,
  MenuItem,
  MenuList,IconButton, Tooltip} from '@chakra-ui/react'
import ChevronIcon from '@/components/icons/ChevronIcon';
import MuteMicrophoneIcon from "@/components/icons/muteMicrophoneIcon";
import UnmuteMicrophoneIcon from "@/components/icons/unmuteMicrophoneIcon";
import '../interview.css'
import { useState } from "react";
import axios from 'axios'
import { useRouter } from "next/router";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { getUserCompanyDetails } from "@/utils/company";
import Image from 'next/image';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import hark from "hark";
import InformationModal from "@/app/Information";
import { AiOutlineCheck } from "react-icons/ai";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import ReactHowler from 'react-howler'
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

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
    name: yup
      .string()
      .required("Name is required"),

    email: yup
      .string()
      .email("Please enter a valid email")
      .required("Enter your email"),

    phoneNumber: yup
      .string()
      .required("Phone number is required"),
  })
  .required();

let mediaRecorder: MediaRecorder;

function InterviewPage() {
  const cookies = new Cookies();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  const [theme, setTheme] = useState('dark');
  const router = useRouter();
  const { isReady } = router;
  // on load. confirm agent slug else return error
  // on load confirm agent slug / whisper to agent by slug

  const [messages, setMessages] = useState([] as string[])
  const [audio, setAudio] = useState("");
  const [playing, setPlaying] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isEnded, setIsEnded] = useState(false);

  const inputRef = useRef<null | HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhonenumber] = useState("");
  const [companyImage, setCompanyImage] = useState<any | null>(null)
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false);
  const [close, setClose] = useState(false);
  const [mouseOver, setMouseOver] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [microphoneDevices, setMicrophoneDevices] = useState<InputDeviceInfo[]>(
    []
  );
  const [microphoneDeviceId, setMicrophoneDeviceId] = useLocalStorage(
    "audioDeviceId",
    ""
  );
  const [micMuted, setMicMuted] = useState(false);
  const sessionToken = useRef('');
  const previousMessages = useRef<Array<any>>([])
  const voice = useRef('')
  const prompt = useRef('');
  const initiationMessage = useRef('');
  const agentName = useRef("")
  const baseURL = process.env.NEXT_PUBLIC_PUBLIC_URL || "http://localhost:9000";

  const selectAudioDevice = useCallback(
    async (deviceId: string) => {
      setMicrophoneDeviceId(deviceId);
    },
    [setMicrophoneDeviceId]
  );
  // var sound = new Howl({
  //   src: audio,
  //   html5: true
  // });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id: string | undefined = router.query.id?.toString();
        if (id) {
          const userToken = cookies.get('token')
          const data = await getUserCompanyDetails(id, userToken);
          if (data.length === 0) {
            setLoading(false);
          } else {
            const base64String = new Buffer(data[0].data.data).toString('base64');
            const srcDataURI = `data:image/jpeg;base64,${base64String}`;
            setCompanyImage(srcDataURI);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Error in getUserCompanyDetails:', error);
        setLoading(false);
      }
    };

    fetchData(); // Call the function to fetch data

  }, [router.query.id]);

  useEffect(() => {
    async function confirmInterviewLink() {
      await axios.get(process.env.NEXT_PUBLIC_PUBLIC_URL + "/agents/interview/" + router.query.slug)
        .then((result) => {
          console.log(result)
          sessionToken.current = result.data["session_token"];
          prompt.current = result.data["prompt"]
          // this is temporary, to reduce number of database calls.
          initiationMessage.current = result.data["initiation_message"]
          agentName.current = result.data['agent_name']
          voice.current = result.data["voice"]

        })
        .catch(() => {
          // when it does not exist
          router.push("/")
        })
    }
    if (isReady) {
      console.log(router.query.slug)
      confirmInterviewLink();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, isEnded])

  //const [chunks, setChunks] = useState([] as BlobPart[])
  const chunks = useRef([] as BlobPart[])


  const sendInitiationData = async () => {
    sendData().then((newMessage: any) => {
      previousMessages.current = newMessage["previous_messages"]
      setAudio(`${baseURL}/assets/generated-audio/` + newMessage["audio_data"])
      setMessages([...messages, newMessage["agent_response"]])
    });
  }

  const convertAudioToMp3 = async (file:any) => {
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
       `${unique_id}.mp3`
     );

     // This reads the converted file from the file system
     const fileData = ffmpeg.FS("readFile", `${unique_id}.mp3`);
     // This creates a new file from the raw data
     const output = new Blob([fileData.buffer], { type: "audio/mp3" });

     return output
  }

  const sendData = async () => {
    // first convert the audio data to base64
    var reader = new FileReader();
    const blob = new Blob(chunks.current, { type: 'audio/webm;codecs=opus' })
    let audio: Blob = new Blob([]);

    if (blob.size != 0) {
      const convertedAudio = await convertAudioToMp3(blob)
      console.log(convertedAudio)

      // Assign convertedAudio to audio inside the if block
      audio = convertedAudio as Blob;
    }
    reader.readAsDataURL(audio)
    return new Promise((resolve, reject) => {
      reader.onloadend = function () {
        axios.post(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/agents/interview/` + router.query.slug + "/data",
          {
            name: name,
            email: email,
            phonenumber: phoneNumber,
            audio: reader.result,
            previous_messages: previousMessages.current,
            session_token: sessionToken.current,
            prompt: prompt.current,
            initiation_message: initiationMessage.current,
            voice: voice.current
          })
          .then(res => {
            resolve(res.data)
            chunks.current = []; //clear the chunks again
          })
          .catch(err => {
            reject(err)
          })
      }
    })
  }

  const sendPrompt = async (prompt: string) => {
    return axios.post('localhost:3000/completions', { prompt })
  }

  const isPreviouslySpeaking = useRef<boolean>(false);
  const isPaused = useRef<boolean>(false);
  const isCountingSilence = useRef<boolean>(false);
  const isSilentAtHalf = useRef<boolean>(false);

  const sentences = useRef<Array<string>>([]);
  const isLongerSilence = useRef<boolean>(false);

  // Check if the browser supports web audio. Safari wants a prefix.
  const record = async () => {
    if (navigator.mediaDevices.getUserMedia || navigator.mediaDevices.getUserMedia) {
      console.log("Starting to record");
      // Get audio stream 
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      mediaRecorder = new MediaRecorder(stream);
      var speech = hark(stream, {});

      speech.on("volume_change", function (e: any) {
        if (!speech.speaking && isPreviouslySpeaking.current && !isCountingSilence.current) {
            isCountingSilence.current = true;
          let measureSilence = setTimeout(() => {
            if (!speech.speaking)  {
                isSilentAtHalf.current = true;
                console.log("mid sentence")
                isPreviouslySpeaking.current = false;
                
               // generate part response
            } else {
               isPreviouslySpeaking.current = true;
            }
            isCountingSilence.current = false;
            clearTimeout(measureSilence);
          }, 500);

          let measureLongSilence = setTimeout(() => {
            if (!speech.speaking && isSilentAtHalf.current) {
              // begin response formation
              console.log('longer silence');
              if (mediaRecorder.state === "recording") mediaRecorder.stop();
            }
            clearTimeout(measureLongSilence);
          }, 1300)

    
        }  
       
      })
      speech.on("speaking", function () {
        console.log("Speaking!");
        isPreviouslySpeaking.current = true;
        isSilentAtHalf.current = false;
        if (mediaRecorder.state !== "recording") mediaRecorder.start();
      });

      // speech.on("stopped_speaking", function () {

      //   console.log("Not Speaking");
      //   if (mediaRecorder.state === "recording") mediaRecorder.stop();
      // });

      mediaRecorder.ondataavailable = (e) => {
        console.log('chunker')
        chunks.current.push(e.data);

        sendData().then((newMessage: any) => {
          console.log(newMessage["agent_response"]);
          console.log(newMessage["previous_messages"]);

          if (newMessage["is_end"]) {
            setIsEnded(true)
            stopRecording();
          }

          previousMessages.current = newMessage["previous_messages"];

          setAudio(`${baseURL}/assets/generated-audio/` + newMessage["audio_data"])
          setMessages([...messages, newMessage["agent_response"]])
          setPlaying(true)
        });
      };
    } else {
      console.log("recording not supported");
    }
  };

  console.log(playing)

  const stopRecording = async () => {
    console.log('recorder')
    if (mediaRecorder) {
      if (mediaRecorder.state === "recording") mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    }
  };


  useEffect(() => {
    // Check if user has a preferred theme
    const savedTheme = window.localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Save theme to local storage
    window.localStorage.setItem('theme', theme);
  }, [theme]);


  const loadDevices = useCallback(async () => {
    const availableDevices = await navigator.mediaDevices.enumerateDevices();

    const audioInputDevices = availableDevices.filter(
      (device) => device.kind === "audioinput"
    );
    setMicrophoneDevices(audioInputDevices);
  }, []);


  useEffect(() => {
      loadDevices()
  }, []);


  const toggleMute = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => {
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
        console.error('Error accessing microphone:', error);
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

  const onSubmit = () => {
    setOpen(true)
    setStep(2)
}
const closeModal = (data:boolean) => {
  setClose(data);
  sendInitiationData()
};


const ariaLabel = micMuted ? "Unmute" : "Mute";
    return (
        <>
        <InformationModal open={open} closeModal={closeModal}/>
        {step === 0 && !loading ? (
          <div className="flex justify-center flex-col m-auto h-screen max-w-xl" key={0}>
          <div className="flex justify-center mb-10">
            <img
              className="w-28 justify-center"
              src={companyImage === null ? "/bilic_logo_green.svg" : `${companyImage}`} alt="" />
          </div>

          <div className="px-6 items-center ">
            <p className="text-black font-medium mb-5 mt-5">This is an AI conducted interview you are about taking part in.The interview is to test your capabilities across a wide range of questions which you are to supply answers</p>
            <p className="text-black font-medium">Please speak correctly and fluently into the microphone when answering the questions before you and also try to answer the qustions
              within the alloted timeframe</p>
          </div>


          <div className="flex justify-center mt-5">
            <button
              onClick={() => setStep(1)}
              type="submit" className="w-36 text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Next</button>
          </div>
        </div>
      ) : step === 1 && !loading ? (
        <div className="flex justify-center flex-col m-auto h-screen max-w-xl" key={1}>
          <div className="flex justify-center mb-10">
            <img
              className="w-28 justify-center"
              src={companyImage === null ? "/bilic_logo_green.svg" : `${companyImage}`} alt="" />
          </div>
          <div className="m-8">
            <form onSubmit={handleSubmit(onSubmit)}>
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                Enter your name
              </label>
              <input
                className="appearance-none block w-full h-14 bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-2xl"
                id="name"
                type="text"
                {...register("name", {
                })}
                onChange={(e) => {
                  setName(e.target.value)
                }}
                placeholder="John Doe"
              />

              <p className="text-red-600">{errors.name?.message}</p>
              <div className="mt-5">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-password"
                >
                  Enter your email
                </label>
                <input
                  {...register("email", {
                  })}
                  className="appearance-none block w-full h-14 bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-2xl"
                  id="email"
                  type="email"
                  onChange={(e) => {
                    setEmail(e.target.value)
                  }}
                  placeholder="doe@example.com"
                />
                <p className="text-red-600">{errors.email?.message}</p>
              </div>

              <div className="mt-5">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-password"
                >
                  Enter your phone number
                </label>
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <PhoneInput

                      country={"us"}
                      inputStyle={{
                        width: '100%',
                        height: "62px",
                        fontSize: "18px"

                      }}

                      inputClass={"input-phone"}
                      // inputClass="w-full border rounded py-3 px-4 focus:outline-none focus:border-gray-500"
                      containerClass="phone-container"
                      // containerStyle="w-full"
                      // value={phoneNumber}
                      onChange={phone => {
                        setPhonenumber(phone)
                        onChange(phone);
                      }}
                    />
                  )}
                />
                <p className="text-red-600">{errors.phoneNumber?.message}</p>
              </div>
              <div className="flex justify-center max-w-xl mt-5">
                <button
                  // onClick={() => handleRef(2)}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-40"
                  type="submit"
                >
                  Next
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : !loading && (
        <Flex
          direction="column"
          backgroundColor={theme === 'dark' ? '#000000' : 'white'}
          height={{ base: '100vh' }}
          alignItems={'center'}
          color={theme === 'dark' ? 'white' : '#000000'}
        >

<div className="absolute left-5 top-5 flex text-white-500 border-lime-500 ml-3 md:ml-6">
    <Image src="/line1.png" width={1} height={10} alt="line" className="mr-2 md:mr-3.5"/>
    <Image className="h-4 md:h-5 mt-2 md:mt-3.5 mr-1 md:mr-6" src={theme === "dark" ? "/Iconsvgspeaker.svg" : "/Action-Button/icSpeakerbl.svg"} width={15} height={12} alt="speaker"/> 
    <h1 className="ml-2  mt-2 md:mt-3 font-normal">{`${agentName.current} (AI), ${name} (You)`}</h1>
    <div className="ms-5 mt-1 me-3  flex justify-between">
      {/* <button onClick={handleMicrophone}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-5 me-3">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
      </svg>
      </button> */}
      <Tooltip
        label={
          micMuted ? `Unmute` : `Mute`
        }
      >
        <IconButton
          variant="control"
          aria-label={ariaLabel}
          onMouseEnter={() => setMouseOver(true)}
          onMouseLeave={() => setMouseOver(false)}
          icon={
            micMuted === true ? (
              <MuteMicrophoneIcon />
            ) : (
              <UnmuteMicrophoneIcon />
            )
          }
          onClick={toggleMute}
        />
      </Tooltip>
      <Menu placement="top">
        {({ isOpen }) => (
          <>
            <MenuButton
              position="absolute"
              top="10px"
              right="0px"
              zIndex={100}
              as={IconButton}
              aria-label="Options"
              icon={<ChevronIcon />}
              variant="controlMenu"
              minWidth="20px"
              {...(isOpen && { transform: "rotate(180deg)" })}
            />
            <MenuList
              background="#383838"
              border="1px solid #323232"
              color="#CCCCCC"
              padding="5px 10px"
            >
              <Text userSelect="none" paddingX="12px" paddingY="6px">
                MICROPHONE
              </Text>
              {microphoneDevices.map((device: MediaDeviceInfo) => {
                return (
                  <MenuItem
                    key={device.deviceId}
                    onClick={() => selectAudioDevice(device.deviceId)}
                    background="#383838"
                  >
                    <Flex alignItems="center">
                      {device.label}
                      {microphoneDeviceId == device.deviceId && (
                        <Box marginLeft="10px">
                          <AiOutlineCheck />
                        </Box>
                      )}
                    </Flex>
                  </MenuItem>
                );
              })}
            </MenuList>
          </>
        )}
      </Menu>
    </div>
    

</div>
          <div className="absolute right-5 md:right-20 top-5 flex">
            <Image src={theme === "dark" ? "/elipseSVG.svg" : "/Action-Button/live4.svg"} width={40} height={40} alt="live" className="mr-2 text-black md:mr-3" />
            <div className="border border-lime-500 rounded-lg flex p-1 md:p-2 px-3 md:px-5">
              <Image src={theme === 'dark' ? "/Action-Button/Iconpersons.svg" : "/Action-Button/IconiconPersons2.svg"} width={20} height={20} alt="persons" className="mr-2" />
              <h2 className="absolute right-2 top-1 md:right-4 md:top-3 font-bold text-sm md:text-base">2</h2>
            </div>
          </div>



          <Box textAlign={'center'}
            maxHeight={'20%'}
            maxWidth={'60rem'}
            lineHeight={'55px'}
            marginTop={'100px'}
          >
            <Text
              fontWeight={'400'}
              fontSize={'30px'}
              color={'#7EE757'}

            >{messages[messages.length - 1]} </Text>

          </Box>

          {!isEnded && <Box position={'absolute'} bottom={'20%'} textAlign={'center'}>
            <Box className="object"
              onClick={() => {
                setPlaying(false)
                if (!isRecording) {
                  record();
                }
                else {
                  stopRecording();
                }
                setIsRecording(!isRecording)
              }}

            >

              {isRecording && <div className="outline">
              </div>}
              <div className="button-outermost">
              </div>
              <div className="button-outer">
              </div>
              <div className="button">
              </div>
              <div className="button" id="circlein"></div>

            </Box>
            <Text
              opacity={1}
              color={'#C2C4CB'}
              marginTop={'20px'}
              textAlign={'center'}
              justifyContent={'center'}
            >

              {isRecording ? "You are speaking now. Tap to stop speaking" : "Tap to speak"}
            </Text>

          </Box>}



          <div style={{
            whiteSpace: 'pre-line'
          }}>


          </div>

          {/* {audio && <audio autoPlay crossOrigin="anonymous" controls src={`${audio}`}
            style={{ visibility: 'hidden' }}
          />} */}

          {audio && <ReactHowler
              src={`${audio}`}
              playing={playing}
      />}

          {/* <div className="fixed bottom-8 left-8">
            <Image src="/33verified.svg" width={96} height={96} alt="verified"/>
      </div> */}

          <div className="fixed bottom-8 left-8">
            <Image src="/33verified.svg" width={96} height={96} alt="verified" className="w-16 h-16 md:w-24 md:h-24" />
          </div>


          <button className="fixed bottom-8 right-8 border border-lime-500 rounded-lg flex p-1 px-3 md:p-2 md:px-5 text-sm md:text-base hover:bg-lime-700" onClick={() => setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark')}>
            Toggle Theme
          </button>



        </Flex>
      )}
    </>


  )

}

export default InterviewPage;