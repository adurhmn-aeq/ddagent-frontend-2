import React from "react";
import { AnimatePresence, motion } from "framer-motion";

function PreInterview() {
    return ( 
        <AnimatePresence>
        <p className="absolute w-full top-0 h-[60px] flex flex-row justify-between -ml-4 md:-ml-8">
        <span className="text-sm text-[#1a2b3b] font-medium">bilic demo</span>
        <span className="text-sm text-[#1a2b3b] font-medium opacity-20">
          bilic demo
        </span>
        <span className="text-sm text-[#1a2b3b] font-medium">bilic demo</span>
        <span className="text-sm text-[#1a2b3b] font-medium opacity-20 hidden sm:block">
          bilic demo
        </span>
        <span className="text-sm text-[#1a2b3b] font-medium hidden sm:block">
          bilic demo
        </span>
        <span className="text-sm text-[#1a2b3b] font-medium opacity-20 hidden xl:block">
          bilic demo
        </span>
        <span className="text-sm text-[#1a2b3b] font-medium opacity-20 hidden sm:block">
          bilic demo
        </span>
        <span className="text-sm text-[#1a2b3b] font-medium opacity-20 hidden sm:block">
          bilic demo
        </span>
        <span className="text-sm text-[#1a2b3b] font-medium hidden sm:block">
          bilic demo
        </span>
        <span className="text-sm text-[#1a2b3b] font-medium opacity-20 hidden xl:block">
          bilic demo
        </span>
      </p>
      <div className="flex justify-center flex-col m-auto h-screen max-w-xl">
            <p className="text-center font-bold">Company Name</p>
            <div className="flex justify-center">
            <img
            className="w-28 justify-center" 
            src="../profile.jpeg" alt="" />
          </div>
          <p className="text-black font-medium mb-5 mt-5">This is an AI video conducted interview you are about taking part in. 
              The interview is to test your capabilities across a wide range of questions which you are to supply answers to.</p>
          <p className="text-black font-medium">Please speak correctly and fluently into the microphone when answering the questions before you and also try to answer the qustions 
              within the alloted timeframe</p>

            <div className="flex justify-center mt-5">
            <button
                // onClick={handleLogin}
                type="submit" className="w-36 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Next</button>
            </div>
              
      </div>
        </AnimatePresence>
     );
}

export default PreInterview;