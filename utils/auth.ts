export const createAccount = async (
    firstname: string,
    lastname: string,
    email: string,
    password: string
  ) => {
    try {
      const options = {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          firstname,
          lastname,
          email,
          password,
        }),
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PUBLIC_URL}/ddvagent/register`,
        options
      );
      const data = await response.json();  
      return data;
    } catch (error) {
      return error
  };
}