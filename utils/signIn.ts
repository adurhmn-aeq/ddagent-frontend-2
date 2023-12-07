import axios from 'axios';

const signIn = async (email:string, password:string) => {
    try {
        const options = {
            method: 'POST',
            url: `${process.env.NEXT_PUBLIC_PUBLIC_URL}/ddvagent/login`,
            headers: {
                accept: 'audio/mpeg', // Set the expected response type to audio/mpeg.
                'content-type': 'application/json', // Set the content type to application/json.
            },
            data: {
                email: email, // Pass in the inputText as the text to be converted to speech.
                password: password
            },
        }
        const response = axios.request(options as any);
        return response   
    } catch (error) {
        return error
    }
}

export default signIn