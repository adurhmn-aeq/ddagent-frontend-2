// interface InterviewDetails{
//     question: string;
//     answer: string;
//     feedback: string;
// }

// interface InterviewData {
//     createdAt: string;
//     email: string;
//     interviewDetails: Array<InterviewDetails>;
//     name: string;
//     userId: string;
//     id: string
// }

export interface IInterview {
    interviews: {}
}

export type InterviewsContextType = {
    interviews: IInterview[];
    saveInterviews: (interviews: IInterview) => void
}