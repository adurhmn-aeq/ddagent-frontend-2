import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "universal-cookie";
import { useRouter } from "next/router";

import { CurrentUserContextType } from "@/@types/user";
import { UserContext } from "@/context";

import { InterviewsContextType, IInterview } from "@/@types/interview";
import { InterviewContext } from "@/context/InterviewContext";
import Sidebar from "@/app/sidebar";
import { getUserSessions } from "../../../../utils/sessions";
import DashboardHeader from "../../dashboardheader";
import Pagination from "@/app/pagination";

export interface InterviewDetails {
  question: string;
  answer: string;
  feedback: string;
}

export interface Interview {
  id: string;
  name: string;
  email: string;
  phonenumber: string;
  interviewTitle: string;
  interviewDetails: Array<InterviewDetails>;
}

function Sessions() {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { users, saveUser } = React.useContext(
    UserContext,
  ) as CurrentUserContextType;
  const { interviews, saveInterviews } = React.useContext(
    InterviewContext,
  ) as InterviewsContextType;

  const router = useRouter();
  const cookies = new Cookies();

  const [loading, setLoading] = useState(false);
  const [interviewsData, setInterviewsData] = useState<Interview[]>([]);
  const [userData, setUserData] = useState<any | null>(null);

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
      setLoading(true);
      getUserSessions(users[1].userId)
        .then((res) => {
          // console.log(res)
          const updatedInterviews: IInterview = {
            interviews: res,
          };
          saveInterviews(res);
          setInterviewsData(res);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }
  }, [userData]);

  useEffect(() => {}, []);

  const handleClick = (item: any) => {
    router.push(
      {
        pathname: `/dashboard/audio/sessions/${item._id}`,
        query: { id: item._id },
      },
      `/dashboard/audio/sessions/${item._id}`,
    );
  };

  const onPageChanged = (data:any) => {
    const { currentPage, totalPages, pageLimit } = data;
    setCurrentPage(currentPage)
    setTotalPages(totalPages)
    setPostsPerPage(pageLimit)
}

const indexOfLastPost = (currentPage ?? 1) * postsPerPage;
const indexOfFirstPost = indexOfLastPost - postsPerPage;
const currentData = interviewsData?.slice(indexOfFirstPost, indexOfLastPost)

  return (
    <>
      <Sidebar>
        {!loading && (
          <div className="my-4 bg-white p-4 sm:ml-60 lg:px-12">
            <DashboardHeader
              imagePath="/video.svg"
              heading="Audio Interviews"
              paragraph="Manage your collection of Audio interviews."
            />
            <div className="relative mt-4 overflow-x-auto">
              <div className="bg-white pb-12 dark:bg-gray-900">
                <label htmlFor="table-search" className="sr-only">
                  Search
                </label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg
                      className="h-4 w-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </div>
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    type="text"
                    id="table-search"
                    className="block w-80 rounded-lg border border-gray-300 bg-white p-2 pl-10 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                    placeholder="Search interviews by name,title or email"
                  />
                </div>
              </div>
              <table className="w-full text-left font-work_sans text-sm text-gray-500 dark:text-gray-400">
                <thead className="rounded-2xl bg-table_header text-xs font-normal capitalize text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3 font-medium">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 font-medium">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 font-medium">
                      Phone Number
                    </th>
                    <th scope="col" className="px-6 py-3 font-medium">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 font-medium">
                      Details
                      {/* <p className="">Details</p> */}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentData
                    .filter((item) => {
                      const name = item.name || "";
                      const interviewTitle = item.interviewTitle || "";
                      const email = item.email || "";
                      return (
                        searchQuery === null ||
                        name
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()) ||
                        email
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()) ||
                        interviewTitle
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                      );
                    })
                    .map((item: any, index: number) => (
                      <tr
                        key={item._id}
                        className="border-b border-table_border bg-white text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                      >
                        <td
                          scope="row"
                          className="flex items-center gap-x-3 whitespace-nowrap px-6 py-2.5 dark:text-white"
                        >
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-50 font-work_sans font-normal uppercase">
                            {item.name
                              .split(" ", 2)
                              .map((initial: string) => `${initial.charAt(0)}`)
                              .join("")}
                          </span>
                          {item.name}
                        </td>
                        <td className="px-6 py-4">{item.email}</td>
                        <td className="min-w-[180px] px-6 py-4">
                          {item.phonenumber}
                        </td>
                        <td className="min-w-[180px] px-6 py-4">
                          {new Date(item.createdAt).toDateString()}
                        </td>
                        <td className="px-6 py-4 text-left">
                          <button
                            onClick={() => handleClick(item)}
                            className="flex items-center justify-center gap-x-1 rounded-lg border border-table_border px-3 py-1 pr-5 font-normal text-gray-900"
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
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between mt-5">
              <p className="mt-3">{`Page ${currentPage} of ${Math.ceil(
              interviewsData.length / postsPerPage
            )}`}</p>
            <Pagination totalRecords={interviewsData.length} pageLimit={10} pageNeighbours={1} onPageChanged={onPageChanged}/>
            </div>
            
          </div>
        )}
        <ToastContainer />
      </Sidebar>
    </>
  );
}

export default Sessions;
