import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "universal-cookie";
import { useRouter } from "next/router";
import Sidebar from "@/app/sidebar";
import { getSessionInterview } from "@/utils/sessions";
import { sentimentAnalysis } from "@/services/sentimentAnalysis";
import { string } from "zod";
import exportToPDF from "@/services/pdfExport";
import { Avatar, Box, Grid } from "@chakra-ui/react";
import { FiInfo } from "react-icons/fi";

// You now have a conversation array with 30 messages.
type ConversationEntry = {
  role: "assistant" | "user";
  content: string;
};

function Session() {
  const router = useRouter();
  const cookies = new Cookies();

  // Define the type for a single conversation entry

  const [userid, setUserId] = useState<any | null>(null);
  const [inviteid, setInviteid] = useState<any | null>(null);
  const [interviewDetails, setInterviewDetails] = useState<any | null>(null);
  const [conversations, setConversations] = useState<
    ConversationEntry[] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [sentiment, setSentiment] = useState<string[]>([]);
  const [isLoadingSentiment, setIsloadingSentiment] = useState(true);

  useEffect(() => {
    if (router.query.id) {
      getSessionInterview(router.query.id).then((res) => {
        const temp: any = [];
        temp.push(res.conversation);
        setConversations(JSON.parse(temp));
        setInterviewDetails(res);
        console.log("ggggg before " + conversations);
        const conv = res.conversation;
        const conv2 = JSON.parse(conv);
        console.log("convvvvvv " + typeof conv);

        const conversationString = conv2
          .map((item: any) => item.content)
          .join(" ");
        sentimentAnalysis(conversationString)
          .then((res: any) => {
            console.log("before split ", res.text[0]);
            const sentiments = res.text.split("\n"); // split the results from the newline
            setIsloadingSentiment(true);
            setSentiment(sentiments);
            console.log("after split ", sentiments);
            setIsloadingSentiment(false);
          })
          .catch((e) => console.log(e));
      });
    }
  }, [router.query.id]);

  const handleExportClick = () => {
    const contentToExport = document.getElementById("content-to-export");
    exportToPDF(contentToExport);
  };

  return (
    <>
      <Sidebar>
        <div className="my-4 mt-20 bg-white pt-8 sm:ml-60">
          <div className="mx-auto flex max-w-[90%] grid-cols-7 flex-col-reverse gap-12 lg:grid">
            <div className="col-span-4">
              {!loading && interviewDetails && (
                <div id="content-to-export" className="">
                  {/* <div className="flex justify-center mt-5">
                    <img className="w-20 " src="/bilic_logo_green.svg" alt="" />
                  </div> */}
                  {/* <div className="flex justify-between pl-5">
                    <p className="font-epilogue text-2xl text-slate-950 mt-5 ms-5 font-bold">
                      Interview Report
                    </p>
                    <button
                      className="bg-primary-500 hover:bg-lime-300 me-5 mt-5 rounded-md w-8 h-9 p-1"
                      onClick={handleExportClick}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l3 3m0 0l3-3m-3 3V2.25"
                        />
                      </svg>
                    </button>
                  </div> */}
                  {/* <div>
                    <p className="ms-5 mt-1 mb-4 font-work_sans">{`Name: ${interviewDetails.name} | ${interviewDetails.email} | ${interviewDetails.phonenumber}`}</p>
                  </div> */}
                  {/* <div></div> */}
                  {conversations?.map(({ role, content }, index: number) => (
                    <ChatBlock
                      key={index}
                      role={role as "user" | "assistant"}
                      content={content}
                      mtOff={index === 0}
                    />
                  ))}
                </div>
              )}

              {loading && <p>Loading...</p>}
            </div>

            <div className="col-span-3 leading-6">
              <Grid
                templateColumns={[
                  "1fr",
                  "repeat(2, 1fr)",
                  "repeat(2, 1fr)",
                  "repeat(2, 1fr",
                ]}
                gap={6}
                position={"sticky"}
                top={"110px"}
              >
                {isLoadingSentiment
                  ? "Analysing Sentiment ..."
                  : sentiment.map((item: any, index: number) => {
                      const [label, score] = item.split(":"); // Destructure the first part
                      console.log("Rendering with sentiment data:", sentiment);
                      const result = score
                        .trim()
                        .split("/")
                        .map((x: string) => parseInt(x, 10));
                      return (
                        <ReportBlock
                          key={index}
                          label={label.trim() as string}
                          score={result[0]}
                          grade={result[1]}
                        />
                      );
                    })}
              </Grid>
            </div>
          </div>
        </div>
        <ToastContainer />
      </Sidebar>
    </>
  );
}

const ChatBlock = ({
  role,
  content,
  mtOff,
}: ConversationEntry & { mtOff?: boolean }) => {
  return (
    <Box
      w={role === "user" ? "95%" : "full"}
      ml={"auto"}
      my={3}
      mt={mtOff ? 0 : 3}
    >
      {role === "user" && (
        <Avatar
          w={"40px"}
          h={"40px"}
          bg={"#EFFCE8"}
          color={"#7ACD4E"}
          size={"sm"}
          name="N M"
        />
      )}
      {role === "assistant" && <AssistantAvatar />}
      <p className="mt-2 rounded-xl border p-3 text-base text-[#020617]">
        {content}
      </p>
    </Box>
  );
};

const ReportBlock = ({
  label,
  score,
  grade,
}: {
  label: string;
  score: string;
  grade: string;
}) => (
  <div className="rounded-md border p-4 pb-3">
    <div className="flex items-center justify-between">
      <span className="capitalize">{label}</span>
      <FiInfo className="rotate-180" size={20} />
    </div>
    <span className="mt-4 block text-[#020617]">
      <span className="font-work_sans text-4xl">{score}</span>
      <span>/{grade}</span>
    </span>
    <span className="text-xs text-[#02061763]">A.I Assesment</span>
  </div>
);

export const AssistantAvatar = (props: React.SVGAttributes<SVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={40}
    height={40}
    fill="none"
    {...props}
  >
    <rect width={40} height={40} fill="#EFFCE8" rx={20} />
    <path
      fill="#9BD77B"
      d="M28.308 16.056c.056-.191.328-.191.384 0l.909 3.108a.2.2 0 0 0 .136.135l3.107.91c.191.055.191.327 0 .383l-3.108.909a.2.2 0 0 0-.135.136l-.909 3.107c-.056.191-.328.191-.384 0l-.909-3.107a.2.2 0 0 0-.136-.136l-3.107-.909c-.191-.056-.191-.328 0-.384l3.108-.909a.2.2 0 0 0 .135-.135l.909-3.108ZM16.154 16.581c.101-.345.59-.345.692 0l1.635 5.593a.36.36 0 0 0 .245.245l5.593 1.636c.345.1.345.59 0 .69l-5.593 1.636a.36.36 0 0 0-.245.245l-1.636 5.592c-.1.346-.59.346-.69 0l-1.636-5.592a.36.36 0 0 0-.245-.245l-5.592-1.635c-.346-.101-.346-.59 0-.691l5.592-1.636a.36.36 0 0 0 .245-.245l1.635-5.593ZM22.308 8.056c.056-.191.328-.191.384 0l.909 3.108a.2.2 0 0 0 .136.135l3.107.91c.191.055.191.327 0 .383l-3.108.909a.2.2 0 0 0-.135.136l-.909 3.107c-.056.191-.328.191-.384 0l-.909-3.107a.2.2 0 0 0-.136-.136l-3.107-.909c-.191-.056-.191-.328 0-.384l3.108-.909a.2.2 0 0 0 .135-.135l.909-3.108Z"
    />
  </svg>
);

export default Session;
