import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "universal-cookie";
import { useRouter } from "next/router";
import Link from "next/link";
import { getUserInterviews } from "@/utils/interviews";

import { CurrentUserContextType } from "@/@types/user";
import { UserContext } from "@/context";

import { InterviewsContextType, IInterview } from "@/@types/interview";
import { InterviewContext } from "@/context/InterviewContext";
import Sidebar from "@/app/sidebar";

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

function Dashboard() {
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
      getUserInterviews(users[1].userId)
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

  const handleClick = (item: any) => {
    router.push(
      {
        pathname: `/dashboard/interview/${item._id}`,
        query: { id: item._id },
      },
      `/dashboard/interview/${item._id}`,
    );
  };

  return (
    <>
      <Sidebar>
        {!loading && (
          <div className="my-4 bg-white px-4 pt-16 sm:ml-60 md:pt-20 lg:px-12">
            <section className="relative mt-4 overflow-x-auto">
              <div className="container mx-auto">
                <div className="columns-auto">
                  <div className="grid grid-cols-1"></div>
                </div>
              </div>
              <div className="container mx-auto">
                <div className="columns-auto">
                  <div className="grid gap-4 md:grid-cols-2 md:gap-12 lg:grid-cols-3">
                    <div className="flex min-h-[200px] flex-col justify-between rounded-xl bg-teal-50 bg-gradient-card from-teal-50 to-purple-50 px-6 py-4">
                      <header>
                        <h2 className="font-font-work_sans pb-2 text-2xl font-medium leading-tight text-secondary-500">
                          Video Interview
                        </h2>
                        <p className="max-w-[23rem] font-work_sans text-sm leading-6">
                          Interviews are conducted via video streaming. The AI
                          conducts the interview questions
                        </p>
                      </header>
                      <div className="flex items-center justify-end">
                        <Link
                          href="/dashboard/questions/type"
                          type="button"
                          className="relative flex h-10 w-auto min-w-[160px] flex-shrink-0 items-center justify-center overflow-clip rounded-full border border-[#404040] bg-secondary-500 px-6 py-1 font-work_sans text-sm font-semibold text-white shadow-[0_1px_2px_0_rgb(5,8,2,0.48),0_0_0_1px_rgb(5,8,2,1.0)]"
                        >
                          <div className="absolute top-0 flex h-10 w-[120%] flex-shrink-0 items-center justify-center rounded-full bg-gradient-button from-[#ffffff40] via-[#ffffff00] to-[#050802]">
                            <span className="whitespace-nowrap text-white">
                              Video Interview
                            </span>
                          </div>
                        </Link>
                      </div>
                    </div>
                    <div className="flex min-h-[200px] flex-col justify-between rounded-xl bg-gradient-card from-fuchsia-50 to-orange-50 px-6 py-4">
                      <header>
                        <h2 className="font-font-work_sans pb-1 text-2xl font-medium leading-tight text-secondary-500">
                          Audio Interview
                        </h2>
                        <p className="max-w-[23rem] font-work_sans text-sm leading-6">
                          Interviews are conducted via audio streaming. The AI
                          conducts the interview questions
                        </p>
                      </header>
                      <div className="flex items-center justify-end">
                        <Link
                          href="/dashboard/questions/type"
                          type="button"
                          className="relative flex h-10 w-auto min-w-[160px] flex-shrink-0 items-center justify-center overflow-clip rounded-full border border-[#404040] bg-secondary-500 px-6 py-1 font-work_sans text-sm font-semibold text-white shadow-[0_1px_2px_0_rgb(5,8,2,0.48),0_0_0_1px_rgb(5,8,2,1.0)]"
                        >
                          <div className="absolute top-0 flex h-10 w-[120%] flex-shrink-0 items-center justify-center rounded-full bg-gradient-button from-[#ffffff40] via-[#ffffff00] to-[#050802]">
                            <span className="whitespace-nowrap text-white">
                              Audio Interview
                            </span>
                          </div>
                        </Link>
                      </div>
                    </div>
                    {/* <div className="flex flex-col justify-between bg-orange-50 px-6 py-4 rounded-xl min-h-[200px] bg-gradient-card from-lime-50 to-red-50">
                                            <header>
                                                <h2 className="font-font-work_sans text-2xl font-medium leading-tight text-secondary-500 pb-1">Video Interview</h2>
                                                <p className="font-work_sans max-w-[16rem]">Start creating video interview</p>
                                            </header>
                                            <div className="flex justify-end items-center">
                                                <Link href="/dashboard/questions/type"
                                                    type="button" className="relative flex flex-shrink-0 justify-center items-center rounded-full h-10 w-auto overflow-clip px-6 py-1 bg-secondary-500 text-sm text-white font-work_sans font-semibold border border-[#404040] min-w-[160px] shadow-[0_1px_2px_0_rgb(5,8,2,0.48),0_0_0_1px_rgb(5,8,2,1.0)]">
                                                    <div className="absolute top-0 h-10 w-[120%] flex flex-shrink-0 justify-center items-center rounded-full bg-gradient-button from-[#ffffff40] via-[#ffffff00] to-[#050802]">
                                                        <span className="text-white whitespace-nowrap">Video Interview</span>
                                                    </div>
                                                </Link>
                                            </div>
                                        </div> */}
                  </div>
                </div>
              </div>
            </section>
            {/* <section className="pt-12 pb-7">
                            <menu className="grid grid-cols-3 grid-rows-2 gap-6">
                                <li className="flex items-center border border-[#e2e4e4] gap-3 px-3 py-3 rounded-xl mr-6 font-work_sans">
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="none">
                                            <path fill="#292D32" d="M15.448 9.068c.184.379.293.79.293 1.224-.011 1.473-1.181 2.686-2.644 2.73l.022.801.108-.812a2.346 2.346 0 0 0-.476-.011l.097.802.022-.813a2.739 2.739 0 0 1-2.643-2.74 2.73 2.73 0 0 1 2.74-2.742.811.811 0 1 0 0-1.625 4.362 4.362 0 0 0-4.376 4.366 4.337 4.337 0 0 0 4.203 4.345l.12-.011c.01-.011.032-.011.043-.011h.13c2.34-.076 4.192-1.993 4.203-4.355a4.32 4.32 0 0 0-.466-1.961.808.808 0 0 0-1.094-.368.793.793 0 0 0-.369 1.083l.087.098ZM19.75 20.388a9.989 9.989 0 0 1-6.76 2.622 9.978 9.978 0 0 1-6.76-2.633l.248.683c.076-.79.607-1.57 1.56-2.21 2.687-1.798 7.183-1.798 9.859 0 .942.628 1.473 1.42 1.56 2.2l.249-.694.043.032Zm1.093 1.192a.831.831 0 0 0 .25-.693c-.141-1.3-.954-2.503-2.276-3.391-3.228-2.156-8.439-2.156-11.678-.011-1.332.888-2.145 2.08-2.286 3.38a.81.81 0 0 0 .25.683 11.548 11.548 0 0 0 7.843 3.044c2.946 0 5.709-1.105 7.843-3.055l.054.043Z" />
                                            <path fill="#292D32" d="M3.672 6.013a11.548 11.548 0 0 0-2.329 6.976c0 6.424 5.211 11.646 11.646 11.646 6.424 0 11.646-5.222 11.646-11.646 0-6.435-5.222-11.646-11.646-11.646-1.647 0-3.25.336-4.702.986a.806.806 0 0 0-.411 1.073c.173.4.66.585 1.072.4a9.747 9.747 0 0 1 4.03-.855C18.503 2.947 23 7.432 23 12.967c0 5.525-4.496 10.021-10.02 10.021-5.537 0-10.022-4.495-10.022-10.02 0-2.2.705-4.29 2.005-6.024.26-.368.195-.877-.174-1.137-.368-.271-.877-.206-1.137.162l.021.043Z" />
                                        </svg>
                                    </span>
                                    Complete your profile
                                </li>
                                <li className="flex items-center border border-[#e2e4e4] gap-3 px-3 py-3 rounded-xl mx-2 font-work_sans"><span> <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="none">
                                    <path fill="#292D32" d="M16.12 19.727H6.597a7.24 7.24 0 0 1-1.581-.162c-.25-.033-.553-.13-.867-.25-1.44-.54-3.142-1.873-3.142-5.188v-5.59c0-3.543 2.026-5.58 5.569-5.58h9.511c2.99 0 4.919 1.42 5.439 4.02.097.476.14.975.14 1.538v5.58c0 3.563-2.025 5.578-5.579 5.578l.033.055ZM6.597 4.626c-2.665 0-3.954 1.278-3.954 3.943v5.58c0 1.938.683 3.13 2.08 3.661.217.076.423.12.618.152.411.086.801.13 1.246.13h9.522c2.665 0 3.954-1.29 3.954-3.954v-5.59a6.16 6.16 0 0 0-.108-1.236c-.368-1.841-1.625-2.73-3.846-2.73H6.576l.021.044Z" />
                                    <path fill="#292D32" d="M19.38 22.988H9.848c-.92 0-1.755-.13-2.459-.4-1.592-.596-2.643-1.853-3-3.651a.801.801 0 0 1 .227-.737.79.79 0 0 1 .747-.206c.358.076.759.12 1.214.12h9.522c2.665 0 3.954-1.29 3.954-3.955V8.57c0-.455-.032-.856-.108-1.224a.833.833 0 0 1 .217-.737.782.782 0 0 1 .736-.227c2.6.53 4.03 2.459 4.03 5.416v5.58c0 3.553-2.025 5.568-5.579 5.568l.033.043Zm-12.978-3.25c.347.629.867 1.073 1.582 1.333.52.195 1.138.281 1.863.281h9.523c2.665 0 3.943-1.289 3.943-3.954v-5.59c0-1.711-.53-2.849-1.625-3.445v5.764c0 3.542-2.036 5.568-5.579 5.568H6.37l.032.043Z" />
                                    <path fill="#292D32" d="M11.364 15.047a3.678 3.678 0 0 1-.01-7.355 3.676 3.676 0 0 1 3.672 3.672 3.676 3.676 0 0 1-3.673 3.673l.011.01Zm0-5.73c-1.137 0-2.058.92-2.058 2.047 0 1.127.92 2.048 2.047 2.048a2.053 2.053 0 0 0 0-4.106l.011.01ZM5.178 14.56a.818.818 0 0 1-.812-.813V8.982c0-.444.368-.813.812-.813.444 0 .813.369.813.813v4.767a.811.811 0 0 1-.813.812ZM17.56 14.56a.818.818 0 0 1-.812-.813V8.982c0-.444.369-.813.813-.813.444 0 .812.369.812.813v4.767a.811.811 0 0 1-.812.812Z" />
                                </svg></span> Upgrade your current plan </li>
                                <li className="flex items-center border border-[#e2e4e4] gap-3 px-3 py-3 rounded-xl ms-4 font-work_sans"><span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="none">
                                        <path fill="#292D32" d="M17.333 24.646H8.667c-3.272 0-5.146-1.874-5.146-5.146V8.937c0-3.412 1.733-5.145 5.146-5.145.444 0 .812.368.812.812a1.623 1.623 0 0 0 1.625 1.625h3.792c.899 0 1.625-.726 1.625-1.625 0-.444.368-.812.812-.812 3.413 0 5.146 1.733 5.146 5.146V19.5c0 3.272-1.874 5.146-5.146 5.146ZM7.952 5.438c-1.712.141-2.817.91-2.817 3.5V19.5c0 2.405 1.116 3.52 3.52 3.52h8.668c2.404 0 3.52-1.115 3.52-3.52V8.937c0-2.589-1.105-3.347-2.816-3.499a3.256 3.256 0 0 1-3.142 2.416h-3.792a3.22 3.22 0 0 1-2.296-.953 3.294 3.294 0 0 1-.856-1.463h.01Z" />
                                        <path fill="#292D32" d="M14.896 7.854h-3.792a3.22 3.22 0 0 1-2.296-.953 3.239 3.239 0 0 1-.954-2.297 3.26 3.26 0 0 1 3.25-3.25h3.792c.867 0 1.68.336 2.297.954a3.22 3.22 0 0 1 .953 2.296 3.26 3.26 0 0 1-3.25 3.25ZM11.104 2.98a1.623 1.623 0 0 0-1.148 2.774c.303.303.715.476 1.148.476h3.792a1.623 1.623 0 0 0 1.148-2.773 1.623 1.623 0 0 0-1.148-.477h-3.792ZM13 14.896H8.667a.818.818 0 0 1-.813-.813c0-.444.369-.812.813-.812H13c.444 0 .813.368.813.812a.818.818 0 0 1-.813.813ZM17.333 19.23H8.667a.818.818 0 0 1-.813-.813c0-.445.369-.813.813-.813h8.666c.445 0 .813.369.813.813a.818.818 0 0 1-.813.812Z" />
                                    </svg></span> Audio Questions </li>
                                <li className="flex items-center border border-[#e2e4e4] gap-3 px-3 py-3 rounded-xl mr-6 font-work_sans"><span><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="none">
                                    <path fill="#292D32" d="M17.333 24.646H8.667c-3.954 0-6.23-2.275-6.23-6.23V7.584c0-3.954 2.276-6.229 6.23-6.229h8.666c3.955 0 6.23 2.275 6.23 6.23v10.833c0 3.954-2.275 6.229-6.23 6.229ZM8.667 2.979c-3.099 0-4.604 1.506-4.604 4.604v10.834c0 3.098 1.505 4.604 4.604 4.604h8.666c3.099 0 4.605-1.506 4.605-4.604V7.583c0-3.098-1.506-4.604-4.605-4.604H8.667Z" />
                                    <path fill="#292D32" d="M20.042 10.02h-2.167a2.977 2.977 0 0 1-2.98-2.978V4.875c0-.444.37-.813.813-.813.444 0 .813.369.813.813v2.167c0 .747.606 1.354 1.354 1.354h2.167c.444 0 .812.368.812.812a.818.818 0 0 1-.812.813ZM13 14.896H8.667a.818.818 0 0 1-.813-.813c0-.444.369-.812.813-.812H13c.444 0 .813.368.813.812a.818.818 0 0 1-.813.813ZM17.333 19.23H8.667a.818.818 0 0 1-.813-.813c0-.445.369-.813.813-.813h8.666c.445 0 .813.369.813.813a.818.818 0 0 1-.813.812Z" />
                                </svg></span> Video Questions </li>
                            </menu>
                        </section> */}
            <section>
              <div className="relative mt-4 overflow-x-auto">
                <div className="bg-white pb-4 dark:bg-gray-900">
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
                      className="block w-80 rounded-lg border border-table_border bg-white p-2 pl-10 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      placeholder="Search interviews by name,title or email"
                    />
                  </div>
                </div>
                <table className="w-full text-left font-work_sans text-sm text-gray-500 dark:text-gray-400">
                  <thead className="rounded-2xl bg-table_header text-xs font-normal capitalize text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th
                        scope="col"
                        className="rounded-bl-lg rounded-tl-lg px-6 py-3 font-medium"
                      >
                        Title
                      </th>
                      <th scope="col" className="px-6 py-3 font-medium">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 font-medium">
                        Email
                      </th>
                      <th
                        scope="col"
                        className="min-w-[180px] px-6 py-3 font-medium"
                      >
                        Phone Number
                      </th>
                      <th
                        scope="col"
                        className="min-w-[180px] px-6 py-3 font-medium"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="rounded-br-lg rounded-tr-lg px-6 py-3"
                      >
                        <span className="sr-only">Details</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {interviewsData
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
                          className="border-b border-table_border bg-white text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600 "
                        >
                          <td className="px-6 py-2.5 font-medium text-gray-900">
                            {item.interviewTitle || "Untitled"}
                          </td>
                          <td
                            scope="row"
                            className="flex items-center gap-x-3 whitespace-nowrap px-6 py-2.5 dark:text-white"
                          >
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-50 font-work_sans font-normal uppercase">
                              {item.name
                                .split(" ", 2)
                                .map(
                                  (initial: string) => `${initial.charAt(0)}`,
                                )
                                .join("")}
                            </span>
                            {item.name}
                          </td>
                          <td className="px-6 py-2.5">{item.email}</td>
                          <td className="px-6 py-2.5">{item.phonenumber}</td>
                          <td className="px-6 py-2.5">
                            {new Date(item.createdAt).toDateString()}
                          </td>
                          <td className="px-6 py-2.5 text-right">
                            <button
                              onClick={() => handleClick(item)}
                              className="flex items-center justify-center gap-x-1 rounded-lg border border-gray-200 px-3 py-1 pr-5 font-normal text-gray-900"
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
            </section>
          </div>
        )}
        <ToastContainer />
      </Sidebar>
    </>
  );
}

export default Dashboard;
