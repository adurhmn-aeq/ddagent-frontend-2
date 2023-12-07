export const getUserSessions = async (id:any) => {
    try {
        const options = {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          };
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_PUBLIC_URL}/agents/sessions?user_id=${id}`,
            options
          );
          return await response.json();
    } catch (error) {
        return error
    }
  }

  export const getSessionInterview = async (id:any) => {
    try {
        const options = {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          };
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_PUBLIC_URL}/agents/session/interview?sessionId=${id}`,
            options
          );
          return await response.json();
    } catch (error) {
        return error
    }
  }