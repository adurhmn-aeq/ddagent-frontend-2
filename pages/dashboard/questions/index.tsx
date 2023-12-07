import React, { useEffect, useState, ChangeEvent } from "react";
import Cookies from "universal-cookie";
import { CurrentUserContextType, IUser } from "@/@types/user";
import { UserContext } from "@/context";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastNotification } from "@/utils/toasts";
import Sidebar from "@/app/sidebar";
import {
  getUserQuestions,
  deleteQuestions,
} from "../../../utils/question";
import Link from "next/link";
import DashboardHeader from "../dashboardheader";
import Pagination from "@/app/pagination";

function Questions() {
  const { users, saveUser } = React.useContext(
    UserContext,
  ) as CurrentUserContextType;

  const cookies = new Cookies();
  const router = useRouter();

  const [questions, setQuestions] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any | null>(null);
  const [remove, setRemove] = useState(false);
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const [currentPage, setCurrentPage] = useState(null);
  const [totalPages, setTotalPages] = useState(null);
  const [postsPerPage, setPostsPerPage] = useState(10);

  useEffect(() => {
    setLoading(true);
    const userdata = cookies.get("userdata");
    if (userdata) {
      setUserData(userdata);
      saveUser(userdata);
    }
  }, []);

  useEffect(() => {
    if (userData) {
      getUserQuestions(users[1].userId).then((res) => {
        if (res.length === 0) {
          setQuestions(null);
          setLoading(false);
        } else {
          setQuestions(res);
          setLoading(false);
        }
      });
    }
  }, [userData, remove]);

  const handleInvite = (id: string) => {
    navigator.clipboard.writeText(
      `${baseURL}/invite/${userData.userId}?inviteId=${id}`,
    );
    toastNotification("Copied to Clipboard");
  };

  const handleView = (item: any) => {
    router.push(
      {
        pathname: `/dashboard/questions/${item._id}`,
        query: { id: item._id },
      },
      `/dashboard/questions/${item._id}`,
    );
  };

  const handleDelete = (id: string) => {
    deleteQuestions(id).then(() => {
      setRemove((remove) => !remove);
    })
  };

  const onPageChanged = (data:any) => {
    const { currentPage, totalPages, pageLimit } = data;
    setCurrentPage(currentPage)
    setTotalPages(totalPages)
    setPostsPerPage(pageLimit)
}

const indexOfLastPost = (currentPage ?? 1) * postsPerPage;
const indexOfFirstPost = indexOfLastPost - postsPerPage;
const currentData = questions?.slice(indexOfFirstPost, indexOfLastPost)

  return (
    <>
      <Sidebar>
        {!loading && questions &&(
          <div className="my-4 bg-white p-4 sm:ml-60 lg:px-12">
            <DashboardHeader
              imagePath="/question.svg"
              heading="Video Questions"
              paragraph="Manage Edit & share your video questions."
            />
            <div className="relative mt-4 overflow-x-auto">
              {/* <Link href="/dashboard/questions/type">
                        <button className="mt-5 ms-3 mb-5 text-white rounded-md h-8 w-44  bg-green-600 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600">Create new question</button>
                        </Link>      */}
              <table className="w-full text-left font-work_sans text-sm text-gray-500 dark:text-gray-400">
                <thead className="rounded-2xl bg-table_header text-xs font-normal capitalize text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3 font-medium">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3 font-medium">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 font-medium">
                      Category
                    </th>
                    <th
                      scope="col"
                      className="min-w-[180px] px-6 py-3 font-medium"
                    >
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 font-medium">
                      Action
                    </th>
                    <th
                      scope="col"
                      className="min-w-[240px] px-6 py-3 font-medium"
                    ></th>
                    <th scope="col" className="py-3 pl-6 font-medium"></th>
                  </tr>
                </thead>
                {!loading && questions && (
                  <tbody>
                    {currentData && currentData.map((item: any) => (
                      <tr
                        key={item._id}
                        className="border-b border-table_border bg-white text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                      >
                        <th
                          scope="row"
                          className="whitespace-nowrap px-6 py-2.5 font-medium text-gray-900"
                        >
                          {item._id}
                        </th>
                        <td className="px-6 py-2.5">{item.title}</td>
                        <td className="px-6 py-2.5">{item.category}</td>
                        <td className="px-6 py-2.5">
                          {new Date(item.createdAt).toDateString()}
                        </td>
                        <td className="px-6 py-2.5">
                          {
                            item.questions[0].videoUrl === "" ? (
                              // <p className="text-black">Processing</p>
                              <button
                                type="button"
                                className="flex h-8 min-w-[180px] items-center justify-center gap-x-1 rounded-lg border border-table_border bg-primary-50 px-3 py-1 pr-5 font-normal text-primary-900 duration-[500ms,800ms] hover:cursor-not-allowed"
                                disabled
                              >
                                <div className="m-[10px] flex items-center justify-center">
                                  <div className="h-4 w-4 animate-spin rounded-full border-4 border-solid border-primary-900 border-t-transparent"></div>
                                  <div className="ml-2"> Processing... </div>
                                </div>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleView(item)}
                                type="button"
                                className="flex h-8 min-w-[180px] items-center justify-center gap-x-1 rounded-lg border border-table_border bg-primary-50 px-3 py-1 pr-5 font-normal text-primary-900 hover:bg-primary-200"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                >
                                  <g fill="#292D32">
                                    <path d="M14.82 11.99c0 1.56-1.27 2.83-2.83 2.83-1.57 0-2.83-1.27-2.83-2.83 0-1.57 1.26-2.83 2.82-2.83 1.56 0 2.83 1.26 2.83 2.82Zm1.5 0c0-2.4-1.94-4.33-4.33-4.33-2.4 0-4.33 1.93-4.33 4.32 0 2.39 1.93 4.33 4.32 4.33 2.39 0 4.33-1.94 4.33-4.33Z" />
                                    <path d="M12 21.02c3.78 0 7.31-2.21 9.74-6.03 1.05-1.66 1.05-4.34-.01-6-2.44-3.83-5.96-6.03-9.75-6.03s-7.32 2.2-9.75 6.02c-1.06 1.65-1.06 4.34 0 5.99 2.43 3.82 5.95 6.02 9.74 6.02Zm0-1.5c-3.24 0-6.31-1.92-8.48-5.34-.75-1.17-.75-3.23-.01-4.39 2.17-3.42 5.23-5.34 8.47-5.34 3.23 0 6.3 1.91 8.47 5.33.74 1.16.74 3.22 0 4.38-2.18 3.41-5.24 5.33-8.48 5.33Z" />
                                  </g>
                                </svg>
                                View
                              </button>
                            )
                            // <button
                            //     onClick={() => handleView(item)}
                            //     className="font-medium text-blue-600 dark:text-blue-500 hover:underline">View
                            // </button>
                          }
                        </td>
                        <td className="px-6 py-2.5">
                          <button
                            disabled={item.questions[0].videoUrl === ""}
                            onClick={() => handleInvite(item._id)}
                            className="border-grey-50 disabled:text-grey-900 flex h-8 min-w-[180px] items-center justify-center gap-x-1 rounded-lg border px-3 py-1 pr-5 font-normal text-gray-900 hover:bg-gray-100 disabled:bg-gray-200 disabled:opacity-20"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                            >
                              <g fill="#292D32">
                                <path d="M15.25 12.9v4.2c0 3.08-1.07 4.15-4.15 4.15H6.9c-3.09 0-4.15-1.07-4.15-4.15v-4.2c0-3.09 1.06-4.15 4.15-4.15h4.2c3.08 0 4.15 1.06 4.15 4.15Zm1.5 0c0-3.92-1.74-5.65-5.65-5.65H6.9c-3.92 0-5.65 1.73-5.65 5.65v4.2c0 3.91 1.73 5.65 5.65 5.65h4.2c3.91 0 5.65-1.74 5.65-5.65v-4.2Z" />
                                <path d="M21.25 6.9v4.2c0 3.08-1.07 4.15-4.15 4.15H16l.75.75v-3.1c0-3.92-1.74-5.65-5.65-5.65H8l.75.75V6.9c0-3.09 1.06-4.15 4.15-4.15h4.2c3.08 0 4.15 1.06 4.15 4.15Zm1.5 0c0-3.92-1.74-5.65-5.65-5.65h-4.2c-3.92 0-5.65 1.73-5.65 5.65V8c0 .41.33.75.75.75h3.1c3.08 0 4.15 1.06 4.15 4.15V16c0 .41.33.75.75.75h1.1c3.91 0 5.65-1.74 5.65-5.65V6.9Z" />
                              </g>
                            </svg>
                            Copy interview link
                          </button>
                        </td>
                        <td>
                          <button onClick={() => handleDelete(item._id)}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="red"
                              className="h-5 w-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
            </div>
            <div className="flex justify-between mt-5">
              <p className="mt-3">{`Page ${currentPage} of ${Math.ceil(
              questions.length / postsPerPage
            )}`}</p>
            <Pagination totalRecords={questions.length} pageLimit={10} pageNeighbours={1} onPageChanged={onPageChanged}/>
            </div>
          </div>
        )}
        <ToastContainer />
      </Sidebar>
    </>
  );
}

export default Questions;
