import React, { useState, Fragment, useEffect } from "react";
import Sidebar from "@/app/sidebar";
import axios from "axios";
import Cookies from "universal-cookie";
import { Dialog, Transition } from '@headlessui/react'
import AudioInterviewModal from "@/app/audioInterviewModal";
import { predefinedtemplates } from "@/data";
import { useRouter } from "next/router";
import { useForm, Controller } from "react-hook-form";

interface ITemplate {
    id: number
    name:string
    agent:string
    prompt:string
    initiationMessage:string
}

function AudioQuestion() {
    const router = useRouter()
    const cookies = new Cookies();
    const [name, setName] = useState<string>("");
    const [prompt, setPrompt] = useState<string>("");
    const [initiationMessage, setInitiationMessage] = useState<string>("");
    const [open, setOpen] = useState(false);
    const [link, setLink] = useState<string>("");
    const [userData, setUserData] = useState<any | null>(null)
    const [loading, setLoading] = useState(true)
    const [voice, setVoice] = useState<string>("");
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: "all",
    });

    // Function to filter objects based on the name property
        function filterByName(arr:Array<ITemplate>, targetName:string) {
            return arr.filter((item) => item.name === targetName);
        }

    useEffect(() => {
        const { value } = router.query
        if (value && typeof value === 'string') {
            const result = filterByName(predefinedtemplates, value)
            setName(result[0].agent)
            setPrompt(result[0].prompt)
            setInitiationMessage(result[0].initiationMessage)
        }
    }, [router.query])

    useEffect(() => {
        setLoading(true)
        const userdata = cookies.get("userdata")
        if (userdata) {
            setUserData(userdata)
            // saveUser(userdata)
            setLoading(false)
        }
    }, [])

    const onSubmit = async (data:any) => {
        console.log(process.env.NEXT_PUBLIC_PUBLIC_URL);
        const userToken = cookies.get('token')
        const result = await axios({
            url: process.env.NEXT_PUBLIC_PUBLIC_URL + "/agents" as string,
            headers:{
                "Content-Type": "application/json",
                "Authorization": userToken
            },
            method: "POST",
            data: {
            name: data.agentName,
            prompt: data.prompt,
            user_id: userData.userId,
            initiation_message: data.initiationMessage,
            voice:voice
            }
        })
        if (result.status == 201) {
            setLink(result.data.slug)
            setOpen(true)
        }
    }   

    return (
        <Sidebar>
            {!loading &&
                <div className="pt-8 sm:ml-60 lg:px-12 bg-white my-4">
                    <AudioInterviewModal open={open} link={link} userId={userData.userId}/>
                    <div className="max-w-lg rounded-lg pb-10 ml-20">
                        <div className="flex flex-col content-center">
                            <div className="bg-white max-w-lg mt-20 rounded-lg pb-10">
                                <h4 className="font-epilogue text-xl font-bold leading-relaxed text-secondary-500 md:text-3xl pb-1 max-w-[350px]">Create Audio Interviews Questions</h4>
                                <form 
                                onSubmit={handleSubmit(onSubmit)}>
                                <div className="mb-3 mt-5 w-full">
                                    <label htmlFor="name" className="font-work_sans text-sm flex items-center py-3 rounded-full dark:text-white dark:hover:bg-gray-700 text-secondary-500">Agent Name</label>
                                    <input
                                        {...register("agentName", {
                                            required: true
                                        })}
                                        // onChange={(e) => setName(e.target.value)}
                                        defaultValue={name}
                                        className="bg-white border border-secondary-500 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block h-12 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                                    />
                                    {errors.agentName && <p className="text-red-500 text-sm font-work_sans mt-1">Agent name is required</p>}
                                </div>
                                <div className="mb-3 mt-5 w-full">
                                    <label htmlFor="gender" className="font-work_sans text-sm flex items-center py-3 rounded-full dark:text-white dark:hover:bg-gray-700 text-secondary-500">Agent Voice</label>
                                    <input
                                    onChange={(e) => setVoice(e.target.value)} 
                                    id="voice-male" type="radio" value="Male" name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"></input>
                                    <label htmlFor="voice-male" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Male</label>

                                    <input 
                                    onChange={(e) => setVoice(e.target.value)} 
                                    id="voice-male" type="radio" value="Female" name="default-radio" className="ms-5 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"></input>
                                    <label htmlFor="voice-female" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Female</label>

                                    <input 
                                    onChange={(e) => setVoice(e.target.value)} 
                                    id="voice-male" type="radio" value="Holmes" name="default-radio" className="ms-5 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"></input>
                                    <label htmlFor="voice-holmes" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Holmes</label>

                                </div>
                                <div className="mb-3 mt-5">
                                    <label htmlFor="prompt" className="font-work_sans text-sm flex items-center py-3 rounded-full dark:text-white dark:hover:bg-gray-700 text-secondary-500">Prompt</label>
                                    <textarea
                                        {...register("prompt", {
                                           required: true
                                        })}
                                        defaultValue={prompt}
                                        // onChange={(e) => setPrompt(e.target.value)}
                                        className="bg-white h-64 border border-secondary-500 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                                    />
                                    {errors.prompt && <p className="text-red-500 text-sm font-work_sans mt-1">Prompt is required</p>}
                                </div>


                                <div className="mb-3 mt-5">
                                    <label htmlFor="prompt" className="font-work_sans text-sm flex items-center py-3 rounded-full dark:text-white dark:hover:bg-gray-700 text-secondary-500">Initiation Message</label>
                                    <textarea
                                        {...register("initiationMessage", {
                                            required: true
                                        })}
                                        defaultValue={initiationMessage}
                                        // onChange={(e) => setInitiationMessage(e.target.value)}
                                        placeholder="e.g Hello {{name}}, It is nice to see you"
                                        className="bg-white h-28 border border-secondary-500 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                                    />
                                    {errors.initiationMessage && <p className="text-red-500 text-sm font-work_sans mt-1">Intitiation message name is required</p>}
                                </div>
                                <button
                                    // onClick={() => { createAgent(name, prompt, userData.userId, initiationMessage, voice) }}
                                    disabled={loading}
                                    type="submit"
                                    className="w-full mt-8 font-work_sans font-medium text-white h-12 bg-primary-500 dark:text-primary-500 focus:ring-4 focus:outline-none focus:ring-primary-50 rounded-lg text-base py-2.5 text-center mr-2 mb-2 disabled:bg-green-300">Generate Interview</button>
                            </form>
                            </div>
                        </div>
                    </div>
                </div>}
        </Sidebar>
    );
}

export default AudioQuestion;
