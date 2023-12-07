import axios from "axios"

export const retriveVideo = async(id:string) => {
    try {
        const response = await axios({
            url:`https://api.heygen.com/v1/video_status.get?video_id=${id}`,
            method:"GET",
            headers: {
                accept: 'application/json',
                'x-api-key': process.env.NEXT_PUBLIC_HEYGEN_API_KEY
            }
        })

        return response.data
    } catch (error) {
        return error
    }
}

//getting videos from heygen functionality