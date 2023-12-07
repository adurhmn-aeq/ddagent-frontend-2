export const getUserQuestions = async (id:any) => {
    try {
        const options = {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          };
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_PUBLIC_URL}/ddvagent/user/questions?id=${id}`,
            options
          );
          return await response.json();
    } catch (error) {
        return error
    }
}

export const deleteQuestions = async (id:any) => {
  try {
      const options = {
          method: "DELETE",
          headers: {
            Accept: "application/json",
          },
        };
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_PUBLIC_URL}/ddvagent/question/delete?id=${id}`,
          options
        );
        return await response.json();
  } catch (error) {
      return error
  }
}

export const getUserAgents = async (id:any, token: string) => {
  try {
      const options = {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Authorization": token
          },
        };
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_PUBLIC_URL}/agents?user_id=${id}`,
          options
        );
        return await response.json();
  } catch (error) {
      return error
  }
}


export const getQuestion = async (id:any) => {
  try {
      const options = {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        };
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_PUBLIC_URL}/ddvagent/question?id=${id}`,
          options
        );
        return await response.json();
  } catch (error) {
      return error
  }
}

export const deleteAgent = async (id:any, token:string) => {
  try {
      const options = {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Authorization": token
          },
        };
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_PUBLIC_URL}/agents/delete?id=${id}`,
          options
        );
        return await response.json();
  } catch (error) {
      return error
  }
}

export const getAgentConnectedDataSources = async (agentID: string) => {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PUBLIC_URL}/agents/data_?agent_id=${agentID}`,
    options
  );
  return await response.json();
}

export const updateAgent = async (id:any, name:string, prompt:string, initiationMessage:string, voice:string, token:string) => {
  try {
    const options = {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "content-type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify({
          name, prompt, initiationMessage, voice
        })
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PUBLIC_URL}/agents/update?agent_id=${id}`,
        options
      );
      return await response.json();
} catch (error) {
    throw new Error('Error updating agent')
}
}
export const getAgent = async (id:any, token:string) => {
  try {
    const options = {
        method: "GET",
        headers:{
          "Content-Type": "application/json",
          "Authorization": token
      },
        
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PUBLIC_URL}/agents/get?agent_id=${id}`,
        options
      );
      return await response.json();
} catch (error) {
    throw new Error('Error getting agent')
}
}



export const createQuestions = async (title:string, category:string, questions: { question: string, videoId: string, videoUrl: string }[], id:string) => {
  try {
      const options = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "content-type": "application/json",
          },
          body: JSON.stringify({
            title, 
            category,
            questions:questions,
            id
          })
        };
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_PUBLIC_URL}/ddvagent/create-question`,
          options
        );
        return await response.json();
  } catch (error) {
      return error
  }
}