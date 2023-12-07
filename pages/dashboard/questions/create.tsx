import React, { useEffect, useState, ChangeEvent } from "react";
import Sidebar from "@/app/sidebar";
import Cookies from "universal-cookie";
import { createQuestions } from "../../../utils/question";
import { generateAiVideo } from "@/utils/generateVideo";

import { CurrentUserContextType, IUser } from "@/@types/user";
import { UserContext } from "@/context";
import { useRouter } from "next/navigation";

function Questions() {
    const { users, saveUser } = React.useContext(UserContext) as CurrentUserContextType

    const cookies = new Cookies();
    const router = useRouter()

    const [title, setTitle] = useState<any | null>(null)
    const [category, setCategory] = useState<any | null>(null)
    const [loading, setLoading] = useState(false)
    const [userData, setUserData] = useState<any | null>(null)

    const [inputFields, setInputFields] = useState<string[]>([]);

    // Function to add a new input field
    const addInputField = (): void => {
        setInputFields([...inputFields, '']);
    };

    useEffect(() => {
        setLoading(true)
        const userdata = cookies.get("userdata")
        if (userdata) {
            setUserData(userdata)
            saveUser(userdata)
            setLoading(false)
        }
    }, [])

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

    const getQuestion = async (questions: string[]) => {
        const temp = [];
        const promises = questions.map((question) =>
            generateAiVideo(question).then((res) => {
                const { video_id } = res.data;
                temp.push(video_id);
                return {
                    question: question,
                    videoId: video_id,
                    videoUrl: "",
                };
            })
        );

        const Questions = await Promise.all(promises);
        return Questions;
    };


    const handleCreate = async (title: string, category: string, id: string, questions: string[]) => {
        setLoading(true);
        try {
            if (questions.length === 1) {
                generateAiVideo(questions[0]).then((res: any) => {
                    const { video_id } = res.data
                    console.log(res)
                    const Questions = [
                        {
                            question: questions[0],
                            videoId: video_id,
                            videoUrl: ''
                        }
                    ]
                    createQuestions(title, category, Questions, users[1].userId)
                        .then((res) => {
                            setLoading(false);
                            console.log(res);
                            router.push("/dashboard/questions")
                        }).catch((e) => {
                            console.log(e);
                        });
                }).catch((e) => console.log(e))
            } else {
                const Questions = await getQuestion(questions);
                console.log(Questions)
                createQuestions(title, category, Questions, users[1].userId)
                    .then((res) => {
                        setLoading(false);
                        console.log(res);
                        router.push("/dashboard/questions")
                    }).catch((e) => {
                        console.log(e);
                    });
            }
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <Sidebar>
            <div className="pt-28 sm:ml-60 lg:px-12 bg-white my-4">
                <div className="max-w-lg rounded-lg pb-10 ml-20">
                    <div className="flex flex-col content-center">
                        <h4 className="font-epilogue text-xl font-bold leading-relaxed text-secondary-500 md:text-3xl pb-1 max-w-[350px]">Create video Interviews Questions</h4>
                        <div className="mb-3 mt-5">
                            <label htmlFor="title" className="font-work_sans text-sm flex items-center py-3 rounded-full dark:text-white dark:hover:bg-gray-700 text-secondary-500">Title</label>
                            <input
                                onChange={(e) => setTitle(e.target.value)}
                                className="bg-white border border-secondary-500 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block h-12 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="category" className="font-work_sans text-sm flex items-center py-3 rounded-full dark:text-white dark:hover:bg-gray-700 text-secondary-500">Category</label>
                            <input
                                onChange={(e) => setCategory(e.target.value)}
                                className="bg-white border border-secondary-500 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block h-12 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                            />
                        </div>
                        <div>
                            {inputFields.map((value, index) => (
                                <div className="" key={index}>
                                    <label htmlFor="question" className="block ms-5 text-sm font-medium text-gray-900 dark:text-white">{`Question ${index + 1}`}</label>
                                    <div className="flex">
                                        <input
                                            className="ms-5 mt-5 mb-3 bg-gray-50 border h-12 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-2/3 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>

                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button
                                className="w-full mt-8 font-work_sans font-medium text-white h-12 bg-primary-500 dark:text-primary-500 focus:ring-4 focus:outline-none focus:ring-primary-50 rounded-lg text-base py-2.5 text-center mr-2 mb-2"
                                onClick={addInputField}
                                disabled={inputFields.length === 2}
                            >{inputFields.length === 0 ? "Add a question" : "Add another question"}</button>

                            {inputFields.length > 0 ?
                                <button
                                    onClick={() => handleCreate(title, category, users[1].userId, inputFields)}
                                    disabled={loading}
                                    className="w-full mt-8 font-work_sans font-medium text-white h-12 bg-primary-500 dark:text-primary-500 focus:ring-4 focus:outline-none focus:ring-primary-50 rounded-lg text-base py-2.5 text-center mr-2 mb-2">Save Questions</button>
                                :
                                null
                            }
                        </div>
                    </div>
                </div>
            </div>
        </Sidebar>
    );
}

export default Questions;