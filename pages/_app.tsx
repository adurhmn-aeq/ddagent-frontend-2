import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import "flowbite";
import UserProvider from "@/context";
import InterviewProvider from "@/context/InterviewContext";
import { ChakraProvider } from "@chakra-ui/react";
import { Work_Sans, Epilogue } from "next/font/google";
import MobileView from "@/app/mobileView";

const work_sans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-work-sans",
  adjustFontFallback: false,
});

const epilogue = Epilogue({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-epilogue",
  adjustFontFallback: false,
});

function TestComponent() {
  return <div>This is a test component.</div>;
}

function MyApp({ Component, pageProps }: AppProps) {
  const [showMobileWarning, setShowMobileWarning] = useState(false);
  useEffect(() => {
    import("flowbite");
  }, []);

  // useEffect(() => {
  //   if(window.innerWidth <= 800){
  //     setShowMobileWarning(true)
  //   }
  // }, [])
  return (
    <ChakraProvider>
      {/* {showMobileWarning ? <MobileView /> :  */}
      <main
        className={`${work_sans.variable} ${epilogue.variable} scroll-smooth bg-sidebar antialiased [font-feature-settings:'ss01']`}
      >
        <UserProvider>
          <InterviewProvider>
            {/* @ts-ignore */}
            <Component {...pageProps} />
          </InterviewProvider>
        </UserProvider>
      </main>
    </ChakraProvider>
  );
}

export default MyApp;
