"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { gradient } from "@/components/Gradient";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    gradient.initGradient("#gradient-canvas");
  }, []);

  return (
    <AnimatePresence>
      <div className="font-inter relative flex min-h-[100dvh] w-screen flex-col overflow-hidden bg-[#000] sm:min-h-screen">
        <svg
          style={{ filter: "contrast(125%) brightness(110%)" }}
          className="fixed z-[1] h-full w-full opacity-[35%]"
        >
          <filter id="noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency=".7"
              numOctaves="3"
              stitchTiles="stitch"
            ></feTurbulence>
            <feColorMatrix type="saturate" values="0"></feColorMatrix>
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)"></rect>
        </svg>
        <main className="static z-[100] flex h-[90%] w-screen grid-rows-[1fr_repeat(3,auto)_1fr] flex-col justify-center overflow-hidden px-4 pb-[100px] pt-[30px] md:fixed md:px-20 md:py-0">
          <motion.svg
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.15,
              duration: 0.95,
              ease: [0.165, 0.84, 0.44, 1],
            }}
            className="row-start-2 mb-8 block w-[100px] md:mb-6"
            viewBox="0 0 87 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* <path
              d="M0.432617 14H9.31836V11.0469H4.15918V1.31738H0.432617V14ZM13.3771 14H17.1037V1.31738H13.3771V14ZM21.7689 14H25.4955V9.50879H30.1889V6.71387H25.4955V4.27051H30.6811V1.31738H21.7689V14ZM37.5875 14H41.3141V4.27051H44.8297V1.31738H34.0719V4.27051H37.5875V14ZM54.241 14.3428C55.5359 14.3428 56.6609 14.0732 57.616 13.5342C58.5711 12.9951 59.3094 12.2275 59.8309 11.2314C60.3582 10.2354 60.6219 9.0459 60.6219 7.66309V7.64551C60.6219 6.26855 60.3582 5.08203 59.8309 4.08594C59.3094 3.08984 58.5711 2.32227 57.616 1.7832C56.6609 1.24414 55.5359 0.974609 54.241 0.974609C52.952 0.974609 51.827 1.24414 50.866 1.7832C49.9109 2.31641 49.1697 3.08398 48.6424 4.08594C48.115 5.08203 47.8514 6.26855 47.8514 7.64551V7.66309C47.8514 9.0459 48.1121 10.2383 48.6336 11.2402C49.1609 12.2363 49.9021 13.0039 50.8572 13.543C51.8182 14.0762 52.9461 14.3428 54.241 14.3428ZM54.241 11.3018C53.7313 11.3018 53.2801 11.1553 52.8875 10.8623C52.5008 10.5635 52.1961 10.1416 51.9734 9.59668C51.7566 9.0459 51.6482 8.40137 51.6482 7.66309V7.64551C51.6482 6.90723 51.7566 6.26562 51.9734 5.7207C52.1961 5.17578 52.5008 4.75684 52.8875 4.46387C53.2801 4.16504 53.7313 4.01562 54.241 4.01562C54.7508 4.01562 55.199 4.16504 55.5857 4.46387C55.9783 4.75684 56.283 5.17578 56.4998 5.7207C56.7166 6.26562 56.825 6.90723 56.825 7.64551V7.66309C56.825 8.40137 56.7166 9.0459 56.4998 9.59668C56.283 10.1416 55.9783 10.5635 55.5857 10.8623C55.199 11.1553 54.7508 11.3018 54.241 11.3018ZM64.6631 14H68.3896V9.50879H73.083V6.71387H68.3896V4.27051H73.5752V1.31738H64.6631V14ZM77.6252 14H81.3518V9.50879H86.0451V6.71387H81.3518V4.27051H86.5373V1.31738H77.6252V14Z"
              fill="#1E2B3A"
            /> */}
          </motion.svg>
          <p className="text-4xl font-extrabold text-[#7EE757]">NEO-BILIC</p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.15,
              duration: 0.95,
              ease: [0.165, 0.84, 0.44, 1],
            }}
            className="font-inter relative z-[100] text-[16vw] font-extrabold leading-[0.9] tracking-[-2px] text-[#fff] md:mb-[37px] md:ml-[-10px] md:text-[130px]"
          >
            AI Video <br />
            DD <span className="text-[#7EE757]">Agent</span>
            <span className="font-inter text-[#7EE757]">.</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.15,
              duration: 0.95,
              ease: [0.165, 0.84, 0.44, 1],
            }}
            className="z-20 mx-0 mb-0 mt-8 grid max-w-2xl justify-center gap-6 md:mb-[35px] md:mt-0 md:grid-cols-2 md:space-x-8"
          >
            <div>
              <h2 className="flex items-center text-4xl text-[1em] font-semibold text-[#fff]">
                Customer Specific DD
              </h2>
              <p className="text-[14px] text-lg font-normal leading-[20px] text-[#fff]">
                {
                  "AI system trained on regulatory, legal, and risk management principles, would conduct the interview by asking a series of questions. The specific questions would be dynamic, based on the customer&apos;s profile, financial activities, geographical location, and risk score."
                }
              </p>
            </div>
            <div>
              <h2 className="flex items-center text-4xl text-[1em] font-semibold text-[#fff]">
                Automated
              </h2>
              <p className="text-[14px] text-lg font-normal leading-[20px] text-[#fff]">
                {
                  "Depending on the answers given, the AI system could ask follow-up questions for clarification or more information. This could be particularly helpful in cases where the customer&apos;s responses indicate potential risks or red flags."
                }
              </p>
            </div>
          </motion.div>

          <div className="mt-8 flex md:mt-0">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.55,
                duration: 0.55,
                ease: [0.075, 0.82, 0.965, 1],
              }}
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.65,
                duration: 0.55,
                ease: [0.075, 0.82, 0.965, 1],
              }}
            >
              <Link
                href="/auth/login"
                className="group flex scale-100 items-center justify-center rounded-full bg-[#f5f7f9] px-4 py-2 text-[13px] font-semibold text-[#1E2B3A] no-underline transition-all duration-75 active:scale-95"
                style={{
                  boxShadow: "0 1px 1px #0c192714, 0 1px 3px #0c192724",
                }}
              >
                <span className="mr-2"> Try it out </span>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.75 6.75L19.25 12L13.75 17.25"
                    stroke="#1E2B3A"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M19 12H4.75"
                    stroke="#1E2B3A"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </motion.div>
          </div>
        </main>
      </div>
    </AnimatePresence>
  );
}
