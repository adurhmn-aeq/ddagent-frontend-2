import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { useRouter } from 'next/router';
import Sidebar from "@/app/sidebar";
import { getAgent, getAgentConnectedDataSources, updateAgent } from "@/utils/question";

function Agent() {
    const router = useRouter();
    const cookies = new Cookies();
    const {id} = router.query

    const [name, setName] = useState<any | null>(null)
    const [prompt, setPrompt] = useState<any | null>(null)
    const [initiationMessage, setInitiationMessage] = useState<any | null>(null)
    const [voice, setVoice] = useState<any | null>(null)
    const [loading, setloading] = useState(true)

    useEffect(() => {
        if (id) {
            const userToken = cookies.get('token')
            getAgent(id,userToken).then((data) => {
                setName(data.name)
                setPrompt(data.prompt)
                setVoice(data.voice)
                setInitiationMessage(data.initiationMessage)
                setloading(false)
            });

             getAgentConnectedDataSources(id as string)
            .then ((result) => {
                console.log(result)
            })
            
        }else{
            router.push("/dashboard/audio")
        }
    }, [])

    const handleUpdate = ( name:string, prompt:string, initiationMessage:string, voice:string) => {
        const userToken = cookies.get('token')
        updateAgent(id, name, prompt, initiationMessage, voice, userToken).then((result) => {
            router.push("/dashboard/audio")
        })
    }

    return (
        <Sidebar>
        {loading && <p>Loading.....</p>}
        {!loading &&
        <div className="pt-8 sm:ml-60 lg:px-12 bg-white my-4">
            <div className="max-w-lg rounded-lg pb-10 ml-20">
                <div className="flex flex-col content-center">
                    <div className="bg-white max-w-lg mt-20 rounded-lg pb-10">
                        <h4 className="font-epilogue text-xl font-bold leading-relaxed text-secondary-500 md:text-3xl pb-1 max-w-[350px]">Create Audio Interviews Questions</h4>
                        <div className="mb-3 mt-5 w-full">
                            <label htmlFor="name" className="font-work_sans text-sm flex items-center py-3 rounded-full dark:text-white dark:hover:bg-gray-700 text-secondary-500">Agent Name</label>
                            <input
                                defaultValue={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-white border border-secondary-500 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block h-12 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                            />
                        </div>
                        <div className="mb-3 mt-5 w-full">
                            <label htmlFor="gender" className="font-work_sans text-sm flex items-center py-3 rounded-full dark:text-white dark:hover:bg-gray-700 text-secondary-500">Agent Voice</label>

                            <input
                            defaultChecked={voice === "Male" ? true : false}
                            onChange={(e) => setVoice(e.target.value)} 
                            id="voice-male" type="radio" value="Male" name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"></input>
                            <label htmlFor="voice-male" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Male</label>

                            <input 
                            defaultChecked={voice === "Female" ? true : false}
                            onChange={(e) => setVoice(e.target.value)} 
                            id="voice-male" type="radio" value="Female" name="default-radio" className="ms-5 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"></input>
                            <label htmlFor="voice-female" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Female</label>

                            <input 
                            defaultChecked={voice === "Holmes" ? true : false}
                            onChange={(e) => setVoice(e.target.value)} 
                            id="voice-male" type="radio" value="Holmes" name="default-radio" className="ms-5 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"></input>
                            <label htmlFor="voice-holmes" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Holmes</label>

                        </div>
                        <div className="mb-3 mt-5">
                            <label htmlFor="prompt" className="font-work_sans text-sm flex items-center py-3 rounded-full dark:text-white dark:hover:bg-gray-700 text-secondary-500">Prompt</label>
                            <textarea
                                defaultValue={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="bg-white h-64 border border-secondary-500 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                            />
                        </div>


                        <div className="mb-3 mt-5">
                            <label htmlFor="prompt" className="font-work_sans text-sm flex items-center py-3 rounded-full dark:text-white dark:hover:bg-gray-700 text-secondary-500">Initiation Message</label>
                            <textarea
                                defaultValue={initiationMessage}
                                onChange={(e) => setInitiationMessage(e.target.value)}
                                placeholder="e.g Hello {{name}}, It is nice to see you"
                                className="bg-white h-28 border border-secondary-500 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                            />
                        </div>
                        <button
                            onClick={() => { handleUpdate(name, prompt, initiationMessage, voice) }}
                            // disabled={loading}
                            className="w-full mt-8 font-work_sans font-medium text-white h-12 bg-primary-500 dark:text-primary-500 focus:ring-4 focus:outline-none focus:ring-primary-50 rounded-lg text-base py-2.5 text-center mr-2 mb-2">Update Interview</button>
                    </div>
                </div>
            </div>
        </div>}
        </Sidebar>
      );
}

export default Agent;