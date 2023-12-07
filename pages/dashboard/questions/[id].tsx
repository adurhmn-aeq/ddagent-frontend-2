import React, { useEffect, useState, ChangeEvent } from "react";
import Sidebar from "@/app/sidebar";
import { getQuestion } from "../../../utils/question";
import Cookies from "universal-cookie";

import { CurrentUserContextType } from "@/@types/user";
import { UserContext } from "@/context";
import { useRouter } from "next/router";
import { retriveVideo } from "@/utils/retrieveVideoUrl";

function Questions() {
    const { users, saveUser } = React.useContext(UserContext) as CurrentUserContextType

    const cookies = new Cookies();
    const router = useRouter()

    const [questions, setQuestions] = useState<any | null>(null)
    const [title, setTitle] = useState<any | null>(null)
    const [loading, setLoading] = useState(false)
    const [userData, setUserData] = useState<any | null>(null)
    const [videoUrl, setVideoUrl] = useState<any | null>(null)

    const [inputFields, setInputFields] = useState<string[]>([]);

    // Function to add a new input field
    const addInputField = (): void => {
        setInputFields([...inputFields, '']);
    };

    const handleInputChange = (index: number, value: string): void => {
        const updatedFields = [...inputFields];
        updatedFields[index] = value;
        setInputFields(updatedFields);
    };

    const removeInputField = (index: number): void => {
        const updatedFields = [...inputFields];
        updatedFields.splice(index, 1);
        setInputFields(updatedFields);
    };

    useEffect(() => {
        setLoading(true)
        const userdata = cookies.get("userdata")
        if (userdata) {
            setUserData(userdata)
            saveUser(userdata)
        }
    }, [])

    useEffect(() => {
        if (userData) {
            getQuestion(router.query.id)
                .then((res) => {
                    if (res.length === 0) {
                        setQuestions(null);
                        setLoading(false);
                    } else {
                        setTitle(res[0].title);
                        const questionsData = res[0].questions.map((data: { question: string, videoId: string }) => ({
                            question: data.question,
                            videoId: data.videoId,
                        }));
                        const videoId = res[0].questions.map((data: { videoId: string }) => data.videoId);
                        console.log(videoId)
                        Promise.all(videoId.map(retriveVideo))
                            .then((results) => {
                                // console.log(results)
                                const videoUrls = results.map((res: any) => res.data.video_url);
                                setVideoUrl(videoUrls);
                                setLoading(false);
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                        setQuestions(questionsData);

                    }
                })
                .catch((error) => {
                    console.error(error);
                    setLoading(false);
                });
        }
    }, [userData, router.query.id]);

    return (
        <Sidebar>
            <div className="absolute left-0 right-0 m-auto bg-slate-100 max-w-4xl mt-16 rounded-lg pb-10">
                {!loading && questions && (
                    <div className="mt-5 ms-5">
                        <p className="text-2xl mb-8 font-bold">{title}</p>
                        {questions.map((item: any, index: number) => (
                            <div key={item._id}>
                                <label htmlFor="large-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{`Question ${index + 1}`}</label>
                                <input
                                    defaultValue={item.question}
                                    type="text" id="large-input" className="bg-gray-50 border h-14 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-2/3 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-6"
                                />
                                {videoUrl[index] && (
                                    <video width="320" height="240" controls crossOrigin="anonymous">
                                        <source src={videoUrl[index]} type="video/mp4" />
                                    </video>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                {loading === false && questions === null ?
                    <>
                        <p className="text-lg mt-5 ms-5">You have not set any questions yet.</p>
                        <div>
                            {inputFields.map((value, index) => (
                                <div className="flex" key={index}>
                                    <input
                                        placeholder="Enter a new question"
                                        className="ms-5 mt-5 bg-gray-50 border h-12 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-2/3 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        key={index}
                                        value={value}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                            handleInputChange(index, e.target.value)
                                        }
                                    />
                                    <button
                                        className="ms-4 mt-5"
                                        onClick={() => removeInputField(index)}>

                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="red" className="w-6 h-6">
                                            <path strokeLinecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>

                                    </button>
                                </div>
                            ))}
                            <button
                                className="ms-5 mt-5 text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                onClick={addInputField}>{inputFields.length === 0 ? "Add a question" : "Add another question"}</button>

                            {/* {inputFields.length > 0 ?
                                <button
                                onClick={() => handleCreate(title, category, users[1].userId, inputFields)}
                                disabled={loading}
                                className="ms-5 mt-5 text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Save Questions</button>
                            :
                                null
                            } */}
                        </div>
                    </>
                    : null
                }
            </div>
        </Sidebar>
    );
}

export default Questions;