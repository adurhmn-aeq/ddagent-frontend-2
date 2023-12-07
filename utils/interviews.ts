//API CALL TO FETCH ALL INTERVIEWS THAT BELONG TO A USERS CREATED QUESTIONS
export const getUserInterviews = async (id:any) => {
    try {
        const options = {
            method: "GET",
            headers: {
                accept: "application/json",
                "content-type": "application/json",
            },
          };
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_PUBLIC_URL}/ddvagent/interview/user/find?id=${id}`,
            options
          );
          return await response.json();
    } catch (error) {
        return error
    }
}

//API CALL TO FETCH A SINGLE INTERVIEW AND ITS DETAILS
export const getInterview = async (id:any) => {
    try {
        const options = {
            method: "GET",
            headers: {
                accept: "application/json",
                "content-type": "application/json",
            },
          };
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_PUBLIC_URL}/ddvagent/interview/find?id=${id}`,
            options
          );
          return await response.json();
    } catch (error) {
        return error
    }
}

//API CALL TO SAVE A USERS INTERVIEW AFTER ANSWERING QUESTIONS
export const saveInterview = async (id:any, name:any, email:any, phonenumber:any, interviewTitle:string, interviewDetails:any, questionId:string) => {
    try {
        const options = {
            method: "POST",
            headers: {
                accept: "application/json",
                "content-type": "application/json",
            },
            body: JSON.stringify({
                userId:id,
                name, 
                email,
                phonenumber,
                interviewTitle: interviewTitle,
                interviewDetails,
                questionId: questionId
            })
          };
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_PUBLIC_URL}/ddvagent/interview/create`,
            options
          );
          return await response.json();
    } catch (error) {
        return error
    }
}

//API CALL TO CHECK A USERS EMAIL BEFORE TAKING AN INTERVIEW
export const checkEmail = async (email:string, questionId:string) => {
    try {
        const options = {
            method: "GET",
            headers: {
                accept: "application/json",
                "content-type": "application/json",
            },
          };
          const response = await fetch(
            `http://localhost:9000/ddvagent/interview/email?email=${email}&questionId=${questionId}`,
            options
          );
          return await response.json();
    } catch (error) {
        return error
    }
}


// export const updateInterview = async(id:string, interviewDetails:object) => {
//     try {
//         const response = await axios({
//             url:`${process.env.NEXT_PUBLIC_PUBLIC_URL}/ddvagent/interview/update`,
//             method: "Patch",
//             data: JSON.stringify({
//                 id,
//                 interviewDetails: [{
//                     interviews: interviewDetails
//                 }]
//             }),
//             headers:{
//                 "Content-Type": "application/json",
//             }
//         })
//     return response.data
//     } catch (error) {
//         return error
//     }
// }