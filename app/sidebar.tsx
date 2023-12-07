import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Header from "./header";

function Sidebar({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const cookies = new Cookies();

  const [userData, setUserData] = useState<any | null>(null);

  useEffect(() => {
    const userdata = cookies.get("userdata");
    setUserData(userdata);
  }, []);

  // const handleInvite = () => {
  //     navigator.clipboard.writeText(`http://localhost:3000/invite/${userData.inviteId}?userid=${userData.userId}`)
  //     toastNotification("Copied to Clipboard")
  // }

  const handleLogout = () => {
    localStorage.clear();
    cookies.remove("token", { path: "/" });
    router.push("/auth/login");
  };
  const currentRoute = usePathname() || "";

  const getPageAddress = () => {
    const page = currentRoute.split("/").pop() || "";
    return page.charAt(0).toUpperCase() + page.slice(1);
  };

  // styles for all links
  const linkStyle =
    "font-work_sans text-sm flex items-center px-4 py-2 rounded-full dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700";
  // styles for active and non-active links
  const activeStyle = `${linkStyle} bg-white shadow-sm focus:ring-4 focus:ring-gray-300 text-secondary-900`;
  const nonActiveStyle = linkStyle + "bg-transparent text-secondary-500";

  return (
    <>
      <nav className="fixed top-0 left-0 md:left-60 right-0 border-b border-gray-100  z-50 bg-white dark:bg-gray-800 dark:border-gray-700">
        <div className="px-8 py-3 lg:px-5 lg:pl-3 pl-2 md:pl-3">
          <div className="flex items-center justify-between w-full ml-3">
            <div>
              <h6 className="font-work_sans text-base md:text-lg font-normal leading-tight text-gray-900">
                Session: {getPageAddress()}
              </h6>
            </div>
            <div className="flex items-center justify-end">
              <Link
                href="/dashboard/questions/type"
                type="button"
                className="flex justify-center items-center border border-secondary-500 hover:border-primary-600 rounded-full h-10 w-auto px-6 py-1 text-sm shadow-sm  font-work_sans font-semibold  hover:bg-primary-600 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 text-secondary-500 hover:text-white transition"
              >
                <span>New Question</span>
              </Link>
            </div>
            {/* <div className="z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600" id="dropdown-user">
                                    <div className="px-4 py-3" role="none">
                                        <p className="text-sm text-gray-900 dark:text-white" role="none">
                                            Neil Sims
                                        </p>
                                        <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none">
                                            neil.sims@flowbite.com
                                        </p>
                                    </div>
                                    <ul className="py-1" role="none">
                                        <li>
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Dashboard</a>
                                        </li>
                                        <li>
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Settings</a>
                                        </li>
                                        <li>
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Earnings</a>
                                        </li>
                                        <li>
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Sign out</a>
                                        </li>
                                    </ul>
                                </div> */}
          </div>
        </div>
      </nav>

      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-[240px] h-screen overflow-y-scroll pt-5 transition-transform -translate-x-full bg-sidebar border-table-border sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700 px-2"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-scroll bg-sidebar dark:bg-gray-800">
          <div className="flex items-center justify-start bg-sidebar">
            <Header />
          </div>
          <ul className="font-medium pt-5">
            {/* <li>
                            <Link href="/dashboard/questions/type"
                                type="button" className="flex justify-center items-center rounded-full h-10 w-auto px-6 py-1 mb-4 text-sm text-secondary-500 shadow-sm  font-work_sans font-semibold bg-white hover:bg-primary-600 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600">
                                <span className="text-secondary-500">New Question</span>
                            </Link>
                        </li> */}
            <li>
              <Link
                href="/dashboard"
                className={
                  currentRoute === "/dashboard" ? activeStyle : nonActiveStyle
                }
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g fill="#292D32">
                    <path d="M17.59 22.55H6.38c-1.83 0-3.48-1.4-3.78-3.2l-1.34-7.96c-.21-1.24.39-2.84 1.38-3.63L9.57 2.2c1.34-1.08 3.44-1.07 4.79.01l6.93 5.54c.98.79 1.58 2.38 1.38 3.62l-1.33 7.95c-.3 1.77-1.99 3.2-3.78 3.2ZM11.98 2.93c-.53-.01-1.07.15-1.46.46L3.59 8.94c-.57.46-.96 1.47-.84 2.19l1.33 7.96c.18 1.05 1.22 1.94 2.29 1.94h11.2c1.07 0 2.11-.89 2.29-1.95l1.33-7.96c.12-.72-.28-1.76-.84-2.21l-6.93-5.55c-.4-.31-.93-.47-1.47-.47Z" />
                    <path d="M12 16.25c-1.79 0-3.25-1.46-3.25-3.25s1.46-3.25 3.25-3.25 3.25 1.46 3.25 3.25 -1.46 3.25-3.25 3.25Zm0-5c-.96 0-1.75.79-1.75 1.75s.79 1.75 1.75 1.75 1.75-.79 1.75-1.75 -.79-1.75-1.75-1.75Z" />
                  </g>
                </svg>
                <span className="ml-3">Home</span>
              </Link>
            </li>
            <li className="text-xs font-work_sans ml-3 mt-5 mb-2 opacity-70 uppercase pointer-events-none">
              Interviews
            </li>
            <li>
              <Link
                href="/dashboard/video"
                className={
                  currentRoute === "/dashboard/video"
                    ? activeStyle
                    : nonActiveStyle
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                >
                  <g fill="#292D32">
                    <path d="M15 22.75H9c-5.43 0-7.75-2.32-7.75-7.75V9c0-5.43 2.32-7.75 7.75-7.75h6c5.43 0 7.75 2.32 7.75 7.75v6c0 5.43-2.32 7.75-7.75 7.75Zm-6-20C4.39 2.75 2.75 4.39 2.75 9v6c0 4.61 1.64 6.25 6.25 6.25h6c4.61 0 6.25-1.64 6.25-6.25V9c0-4.61-1.64-6.25-6.25-6.25H9Z" />
                    <path d="M10.75 16.37c-.42 0-.81-.1-1.16-.3-.8-.46-1.26-1.4-1.26-2.59v-2.96c0-1.19.46-2.14 1.26-2.6.79-.46 1.83-.39 2.86.21l2.57 1.48c1.02.59 1.61 1.46 1.61 2.38 0 .92-.59 1.79-1.61 2.38l-2.57 1.48c-.58.34-1.17.51-1.71.51Zm.01-7.25c-.16 0-.3.03-.41.1-.32.19-.51.66-.51 1.29v2.96c0 .63.17 1.1.5 1.29.32.19.82.11 1.37-.21l2.57-1.48c.55-.32.86-.71.86-1.08 0-.37-.31-.77-.86-1.08l-2.57-1.49c-.36-.21-.69-.31-.96-.31Z" />
                  </g>
                </svg>
                <span className="ml-3">Video Transcripts</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/audio/sessions"
                className={
                  currentRoute === "/dashboard/audio/sessions"
                    ? activeStyle
                    : nonActiveStyle
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                >
                  <g fill="#292D32">
                    <path d="M12 16.25c-2.62 0-4.75-2.13-4.75-4.75V6c0-2.62 2.13-4.75 4.75-4.75S16.75 3.38 16.75 6v5.5c0 2.62-2.13 4.75-4.75 4.75Zm0-13.5c-1.79 0-3.25 1.46-3.25 3.25v5.5c0 1.79 1.46 3.25 3.25 3.25s3.25-1.46 3.25-3.25V6c0-1.79-1.46-3.25-3.25-3.25Z" />
                    <path d="M11.99 19.75c-4.63 0-8.4-3.77-8.4-8.4V9.64c0-.41.34-.75.75-.75s.75.34.75.75v1.7c0 3.8 3.1 6.9 6.89 6.9 3.8 0 6.9-3.1 6.9-6.9V9.63c0-.41.34-.75.75-.75s.75.34.75.75v1.7c0 4.63-3.77 8.4-8.4 8.4ZM13.38 7.18c-.08 0-.17-.01-.26-.04-.73-.27-1.53-.27-2.26 0a.764.764 0 0 1-.97-.45.75.75 0 0 1 .45-.96 4.89 4.89 0 0 1 3.29 0c.39.14.59.57.45.96-.12.3-.41.49-.71.49Z" />
                    <path d="M12.8 9.3c-.07 0-.13-.01-.2-.03-.4-.11-.81-.11-1.21 0a.75.75 0 0 1-.92-.53c-.11-.39.13-.8.53-.91.65-.18 1.35-.18 2 0 .4.11.64.52.53.92-.09.33-.4.55-.73.55ZM12 22.75c-.41 0-.75-.34-.75-.75v-3c0-.41.34-.75.75-.75s.75.34.75.75v3c0 .41-.34.75-.75.75Z" />
                  </g>
                </svg>
                <span className="ml-3 text-sm">Audio Transcripts</span>
              </Link>
            </li>
            <li className="text-xs font-work_sans ml-3 mt-5 mb-2 opacity-70 uppercase pointer-events-none">
              Questions
            </li>
            <li>
              <Link
                href="/dashboard/questions"
                className={
                  currentRoute === "/dashboard/questions"
                    ? activeStyle
                    : nonActiveStyle
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                >
                  <g fill="#292D32">
                    <path d="M16 22.75H8c-3.02 0-4.75-1.73-4.75-4.75V8.25C3.25 5.1 4.85 3.5 8 3.5c.41 0 .75.34.75.75a1.499 1.499 0 0 0 1.5 1.5h3.5c.83 0 1.5-.67 1.5-1.5 0-.41.34-.75.75-.75 3.15 0 4.75 1.6 4.75 4.75V18c0 3.02-1.73 4.75-4.75 4.75ZM7.34 5.02c-1.58.13-2.6.84-2.6 3.23V18c0 2.22 1.03 3.25 3.25 3.25h8c2.22 0 3.25-1.03 3.25-3.25V8.25c0-2.39-1.02-3.09-2.6-3.23a3.006 3.006 0 0 1-2.9 2.23h-3.5c-.8 0-1.55-.31-2.12-.88a3.04 3.04 0 0 1-.79-1.35Z" />
                    <path d="M13.75 7.25h-3.5c-.8 0-1.55-.31-2.12-.88a2.99 2.99 0 0 1-.88-2.12c0-1.65 1.35-3 3-3h3.5c.8 0 1.55.31 2.12.88.57.57.88 1.32.88 2.12 0 1.65-1.35 3-3 3Zm-3.5-4.5a1.498 1.498 0 0 0-1.06 2.56c.28.28.66.44 1.06.44h3.5a1.498 1.498 0 0 0 1.06-2.56c-.28-.28-.66-.44-1.06-.44h-3.5ZM12 13.75H8c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h4c.41 0 .75.34.75.75s-.34.75-.75.75ZM16 17.75H8c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h8c.41 0 .75.34.75.75s-.34.75-.75.75Z" />
                  </g>
                </svg>
                <span className="flex-1 ml-3 whitespace-nowrap">
                  Video Agents
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/audio"
                className={
                  currentRoute === "/dashboard/audio"
                    ? activeStyle
                    : nonActiveStyle
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                >
                  <g fill="#292D32">
                    <path d="M16 22.75H8c-3.65 0-5.75-2.1-5.75-5.75V7c0-3.65 2.1-5.75 5.75-5.75h8c3.65 0 5.75 2.1 5.75 5.75v10c0 3.65-2.1 5.75-5.75 5.75Zm-8-20C5.14 2.75 3.75 4.14 3.75 7v10c0 2.86 1.39 4.25 4.25 4.25h8c2.86 0 4.25-1.39 4.25-4.25V7c0-2.86-1.39-4.25-4.25-4.25H8Z" />
                    <path d="M18.5 9.25h-2c-1.52 0-2.75-1.23-2.75-2.75v-2c0-.41.34-.75.75-.75s.75.34.75.75v2c0 .69.56 1.25 1.25 1.25h2c.41 0 .75.34.75.75s-.34.75-.75.75ZM12 13.75H8c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h4c.41 0 .75.34.75.75s-.34.75-.75.75ZM16 17.75H8c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h8c.41 0 .75.34.75.75s-.34.75-.75.75Z" />
                  </g>
                </svg>
                <span className="flex-1 ml-3 whitespace-nowrap">
                  Audio Agents
                </span>
              </Link>
            </li>
            <li className="text-xs font-work_sans ml-3 mt-5 mb-2 opacity-70 uppercase pointer-events-none">
              Account
            </li>
            <li>
              <Link
                href="/dashboard/profile"
                className={
                  currentRoute === "/dashboard/profile"
                    ? activeStyle
                    : nonActiveStyle
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                >
                  <g fill="#292D32">
                    <path d="M12 22.75c-.67 0-1.35-.17-1.95-.52L4.1 18.8c-1.2-.7-1.95-1.99-1.95-3.38V8.58c0-1.39.75-2.68 1.95-3.38l5.94-3.43c1.2-.7 2.69-.7 3.9 0l5.94 3.42c1.2.7 1.95 1.99 1.95 3.38v6.83c0 1.39-.75 2.68-1.95 3.38l-5.94 3.43c-.6.35-1.28.52-1.95.52Zm0-20c-.41 0-.83.11-1.2.32L4.85 6.5c-.74.43-1.2 1.22-1.2 2.08v6.83c0 .85.46 1.65 1.2 2.08l5.94 3.43c.74.43 1.66.43 2.4 0l5.94-3.43c.74-.43 1.2-1.22 1.2-2.08V8.57c0-.85-.46-1.66-1.2-2.09l-5.94-3.43c-.37-.21-.79-.32-1.2-.32Z" />
                    <path d="M11.99 11.74c-1.7 0-3.08-1.38-3.08-3.08 0-1.7 1.37-3.08 3.07-3.08 1.7 0 3.08 1.37 3.08 3.07 0 1.7-1.38 3.08-3.08 3.08Zm0-4.66c-.87 0-1.58.7-1.58 1.57 0 .87.71 1.58 1.58 1.58.87 0 1.58-.71 1.58-1.58 0-.87-.71-1.58-1.58-1.58ZM16 17.41c-.41 0-.75-.34-.75-.75 0-1.38-1.46-2.51-3.25-2.51s-3.25 1.12-3.25 2.5c0 .41-.34.75-.75.75s-.75-.34-.75-.75c0-2.21 2.13-4.01 4.75-4.01s4.75 1.79 4.75 4c0 .41-.34.75-.75.75Z" />
                  </g>
                </svg>
                <span className="ml-3">Profile</span>
              </Link>
            </li>
            {/* /dashboard/plans */}
            <li>
              <Link
                href=""
                className={
                  currentRoute === "/dashboard/plans"
                    ? activeStyle
                    : nonActiveStyle
                }
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g fill="#292D32">
                    <path d="M18.55 7.91v5.15c0 2.49-1.25 3.65-3.65 3.65H6.1c-.42 0-.79-.04-1.12-.12 -.23-.04-.42-.09-.62-.17 -1.26-.47-1.92-1.55-1.92-3.38V7.88c0-2.5 1.24-3.65 3.64-3.65h8.79c2.02 0 3.2.81 3.54 2.51 .07.4.1.75.1 1.13Zm1.5 0c0-.48-.05-.92-.14-1.41 -.49-2.48-2.33-3.75-5.02-3.75h-8.8C2.87 2.75.94 4.54.94 7.89v5.15c0 2.43 1.01 4.08 2.89 4.78 .29.1.57.18.85.22 .4.09.88.13 1.39.13h8.79c3.21 0 5.15-1.81 5.15-5.15V7.86Z" />
                    <path d="M21.55 10.92v5.15c0 2.49-1.25 3.65-3.65 3.65H9.1c-.68 0-1.25-.1-1.73-.28 -.99-.37-1.59-1.09-1.83-2.26l-.74.14 -.17.73c.44.1.92.14 1.44.14h8.79c3.21 0 5.15-1.81 5.15-5.15V7.89c0-.52-.05-.99-.14-1.44l-.74.15 -.16.73c1.65.34 2.52 1.47 2.52 3.54Zm1.5 0c0-2.77-1.36-4.52-3.72-5.02 -.53-.12-1 .35-.89.88 .06.34.1.71.1 1.12v5.15c0 2.49-1.25 3.65-3.65 3.65h-8.8c-.42 0-.79-.04-1.12-.12 -.53-.12-1.01.34-.91.87 .33 1.67 1.29 2.82 2.76 3.36 .65.24 1.4.36 2.25.36h8.79c3.21 0 5.15-1.81 5.15-5.15v-5.15Z" />
                    <path d="M10.49 13.88c1.87 0 3.39-1.52 3.39-3.39 0-1.88-1.52-3.4-3.39-3.4 -1.88 0-3.39 1.51-3.39 3.39 0 1.87 1.51 3.39 3.39 3.39Zm0-1.5c-1.05 0-1.89-.85-1.89-1.89 0-1.05.84-1.9 1.89-1.9 1.04 0 1.89.84 1.89 1.89 0 1.04-.85 1.89-1.89 1.89Z" />
                    <path d="M4.03 8.3v4.4c0 .41.33.75.75.75 .41 0 .75-.34.75-.75V8.29c0-.42-.34-.75-.75-.75 -.42 0-.75.33-.75.75Z" />
                    <path d="M15.47 8.3v4.4c0 .41.33.75.75.75 .41 0 .75-.34.75-.75V8.29c0-.42-.34-.75-.75-.75 -.42 0-.75.33-.75.75Z" />
                  </g>
                </svg>
                <span className="ml-3">Plans</span>
              </Link>
            </li>
            <ul className="absolute bg-sidebar bottom-2 left-0 right-0 space-y-2 font-medium  dark:border-gray-700 ps-7 pt-2">
              <li>
                <Link
                  // onClick={handleLogout}
                  href="" className="font-work_sans text-sm flex items-center p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none">
                    <path fill="#292D32" d="M11 20.854c-5.436 0-9.854-4.418-9.854-9.854 0-5.436 4.418-9.854 9.854-9.854 5.436 0 9.854 4.418 9.854 9.854 0 5.436-4.418 9.854-9.854 9.854Zm0-18.333C6.325 2.52 2.52 6.325 2.52 11c0 4.675 3.805 8.48 8.48 8.48 4.675 0 8.48-3.805 8.48-8.48 0-4.675-3.805-8.48-8.48-8.48Z" />
                    <path fill="#292D32" d="M8.9 16.353a.967.967 0 0 1-.586-.183c-.247-.165-.632-.587-.394-1.53l.706-2.852-.853-.21c-.852-.211-1.045-.752-1.081-.972-.037-.22-.055-.798.66-1.302l4.739-3.29c.797-.55 1.32-.358 1.567-.193.248.165.624.587.385 1.53l-.706 2.842.844.211c.852.211 1.045.752 1.081.981.037.23.055.797-.66 1.302l-4.748 3.29c-.394.266-.715.358-.98.358l.027.018Zm-.55-6.05 1.284.321a.678.678 0 0 1 .495.825l-.807 3.245 4.318-3.007-1.293-.32a.702.702 0 0 1-.504-.844l.807-3.245-4.327 2.998.028.027Z" />
                  </svg>
                  <span className="ml-3">Upgrade</span>
                </Link>
              </li>
              <li>
                <Link
                  // onClick={handleLogout}
                  href="" className="font-work_sans text-sm flex items-center p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none">
                    <path fill="#292D32" d="M7.333 20.45c-.256 0-.531-.063-.77-.192a1.596 1.596 0 0 1-.843-1.411v-1.302c-2.768-.284-4.583-2.328-4.583-5.243v-5.5c0-3.154 2.117-5.271 5.27-5.271h9.167c3.154 0 5.271 2.117 5.271 5.27v5.492c0 3.153-2.117 5.27-5.27 5.27h-3.457l-3.914 2.604a1.62 1.62 0 0 1-.889.256l.018.028ZM6.417 2.907c-2.365-.01-3.896 1.53-3.896 3.896v5.5c0 2.365 1.53 3.896 3.896 3.896.376 0 .687.311.687.687v1.952c0 .12.074.175.12.202a.223.223 0 0 0 .238-.009l4.07-2.713a.707.707 0 0 1 .385-.12h3.666c2.365 0 3.896-1.53 3.896-3.895v-5.51c0-2.364-1.53-3.895-3.896-3.895H6.408l.009.009Z" />
                    <path fill="#292D32" d="M10.99 11.092a.693.693 0 0 1-.687-.688v-.192c0-1.064.78-1.595 1.073-1.797.34-.23.45-.385.45-.623a.845.845 0 0 0-.835-.844.837.837 0 0 0-.834.835.692.692 0 0 1-.688.687.693.693 0 0 1-.687-.687c0-1.22.98-2.219 2.2-2.219 1.219 0 2.209.99 2.209 2.21 0 1.044-.77 1.567-1.054 1.76-.358.238-.468.394-.468.65v.193a.687.687 0 0 1-.687.687l.009.028ZM11 13.383a.687.687 0 1 1-.002-1.373.687.687 0 0 1 .002 1.373Z" />
                  </svg>
                  <span className="ml-3">Help</span>
                </Link>
              </li>
              <li>
                <Link
                  // onClick={handleLogout}
                  href="" className="font-work_sans text-sm flex items-center p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none">
                    <path fill="#292D32" d="M11 14.438A3.439 3.439 0 0 1 7.562 11 3.439 3.439 0 0 1 11 7.562 3.439 3.439 0 0 1 14.438 11 3.439 3.439 0 0 1 11 14.438Zm0-5.5A2.066 2.066 0 0 0 8.937 11c0 1.137.926 2.063 2.063 2.063A2.066 2.066 0 0 0 13.063 11 2.066 2.066 0 0 0 11 8.937Z" />
                    <path fill="#292D32" d="M13.942 20.332a2.49 2.49 0 0 1-.577-.074 2.25 2.25 0 0 1-1.348-1.017l-.11-.183c-.54-.936-1.283-.936-1.824 0l-.1.174c-.303.513-.78.88-1.348 1.026a2.146 2.146 0 0 1-1.678-.229l-1.576-.907a2.429 2.429 0 0 1-.899-3.319c.266-.467.34-.889.184-1.155-.156-.265-.55-.421-1.091-.421a2.433 2.433 0 0 1-2.43-2.43v-1.613c0-1.338 1.092-2.429 2.43-2.429.54 0 .935-.156 1.09-.422.157-.266.092-.687-.183-1.155a2.44 2.44 0 0 1-.238-1.842A2.365 2.365 0 0 1 5.381 2.86l1.586-.908c1.035-.614 2.401-.256 3.025.798l.11.183c.54.935 1.283.935 1.824 0l.1-.174c.624-1.063 1.99-1.42 3.035-.797l1.576.907a2.429 2.429 0 0 1 .899 3.318c-.266.468-.34.89-.184 1.155.156.266.55.422 1.091.422 1.339 0 2.43 1.091 2.43 2.43v1.613c0 1.338-1.091 2.429-2.43 2.429-.54 0-.935.156-1.09.421-.156.266-.092.688.183 1.155.32.56.412 1.22.238 1.843a2.365 2.365 0 0 1-1.137 1.476l-1.585.907a2.281 2.281 0 0 1-1.11.294ZM11 16.94c.816 0 1.577.513 2.1 1.42l.1.175c.11.192.293.33.513.385.22.055.44.027.624-.083l1.585-.916a1.06 1.06 0 0 0 .395-1.44c-.523-.898-.587-1.824-.184-2.53.404-.705 1.238-1.109 2.283-1.109.586 0 1.054-.467 1.054-1.054v-1.613c0-.578-.468-1.054-1.054-1.054-1.045 0-1.88-.404-2.283-1.11-.403-.705-.339-1.631.184-2.53.137-.238.174-.522.1-.797a1.072 1.072 0 0 0-.485-.642l-1.586-.907a.843.843 0 0 0-1.155.302l-.101.175c-.523.907-1.283 1.42-2.1 1.42-.815 0-1.576-.513-2.098-1.42l-.101-.184a.842.842 0 0 0-1.137-.293l-1.586.917a1.06 1.06 0 0 0-.394 1.439c.523.898.587 1.824.183 2.53-.403.706-1.237 1.109-2.282 1.109-.587 0-1.054.467-1.054 1.054v1.614c0 .577.467 1.054 1.054 1.054 1.045 0 1.88.403 2.282 1.109.404.706.34 1.631-.183 2.53a1.048 1.048 0 0 0-.1.797c.073.275.247.495.485.642l1.586.907a.81.81 0 0 0 .632.092.87.87 0 0 0 .523-.394l.1-.174c.523-.899 1.284-1.421 2.1-1.421Z" />
                  </svg>
                  <span className="ml-3">Settings</span>
                </Link>
              </li>
              <li>
                <Link
                  onClick={handleLogout}
                  href="" className="font-work_sans text-sm flex items-center p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
                    <g fill="#292D32">
                      <path d="M15.23 22.27h-.13c-4.44 0-6.59-1.75-6.96-5.67-.04-.41.26-.78.68-.82.4-.04.78.27.82.68.29 3.14 1.77 4.31 5.46 4.31h.13c4.07 0 5.51-1.44 5.51-5.51V8.73c0-4.07-1.44-5.51-5.51-5.51h-.13c-3.71 0-5.2 1.19-5.47 4.39-.05.41-.4.72-.82.68a.751.751 0 0 1-.69-.81c.34-3.98 2.49-5.76 6.96-5.76h.13c4.91 0 7.01 2.1 7.01 7.01v6.52c0 4.91-2.1 7.01-7.01 7.01Z" />
                      <path d="M14.99 12.75H3.61c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h11.37c.41 0 .75.34.75.75s-.34.75-.75.75Z" />
                      <path d="M5.84 16.09c-.19 0-.38-.07-.53-.22l-3.35-3.35a.754.754 0 0 1 0-1.06l3.35-3.35c.29-.29.77-.29 1.06 0 .29.29.29.77 0 1.06l-2.82 2.81 2.82 2.82c.29.29.29.77 0 1.06-.14.15-.34.22-.53.22Z" />
                    </g>
                  </svg>
                  <span className="ml-3">Logout</span>
                </Link>
              </li>
            </ul>
          </ul>
        </div>
      </aside>
      <div>{children}</div>
      <ToastContainer />
    </>
  );
}

export default Sidebar;
