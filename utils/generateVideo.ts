import axios from "axios"

export const generateAiVideo = async (text:string) => {
    try {
        const response = await axios({
       url: "https://api.heygen.com/v1/video.generate",
       method: "POST",
       data: JSON.stringify({
            background: "#ffffff",
            clips: [
              {
                avatar_id: "Daisy-inskirt-20220818",
                avatar_style: "normal",
                input_text: text,
                offset: {
                  x: 0,
                  y: 0
                },
                scale: 1,
                voice_id: "1bd001e7e50f421d891986aad5158bc8"
              }
            ],
            ratio: "16:9",
            test: true,
            version: "v1alpha"
          
      }),
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": process.env.NEXT_PUBLIC_HEYGEN_API_KEY
      }, 
    })
    return response.data;
    } catch (error) {
        return error
    }
}

