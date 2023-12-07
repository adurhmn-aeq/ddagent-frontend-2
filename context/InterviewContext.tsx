import { useState, createContext } from "react";
import { InterviewsContextType, IInterview } from "@/@types/interview";

export const InterviewContext = createContext<InterviewsContextType | null>(null);

function InterviewProvider({ children }: { children: React.ReactNode }) {
  const [interviews, setInterviews] = useState<IInterview[]>([]);

//   const saveInterviews = (interview: IInterview) => {
//     const newInterview: IInterview = {
//       interviews: [interview]
//     };
//     setInterviews([...interviews, newInterview]);
//   };

const saveInterviews = (interview: IInterview) => {
    setInterviews((prevInterviews) => [...prevInterviews, interview]);
  };

  return (
    <InterviewContext.Provider value={{ interviews, saveInterviews }}>
      {children}
    </InterviewContext.Provider>
  );
}

export default InterviewProvider;
