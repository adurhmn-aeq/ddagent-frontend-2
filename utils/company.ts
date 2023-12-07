import axios from "axios"

export const createCompanyProfile = async (formData:any, token:string) => {
    console.log("formData", Array.from(formData.values()))
    try {
        const response = axios({
            url: `${process.env.NEXT_PUBLIC_PUBLIC_URL}/ddvagent/company/create`,
            headers:{
                "Authorization": token
        },
            method: "POST",
            data: formData
        })
        return response
    } catch (error) {
        return error
    }
}

export const updateCompanyProfile = async (formData:any, id:string, token:string) => {
    try {
        const response = await axios({
            url: `${process.env.NEXT_PUBLIC_PUBLIC_URL}/ddvagent/company/edit?id=${id}`,
            headers:{
                "Content-Type": "application/json",
                "Authorization": token
            },
            method: "PATCH",
            data: "formData",
        })
        return response
    } catch (error) {
        return error
    }
}

export const getUserCompanyDetails = async (id:string, token:string) => {
    try {
        const response = await axios({
            url: `${process.env.NEXT_PUBLIC_PUBLIC_URL}/ddvagent/company-info?id=${id}`,
            method: "GET",
            headers:{
                    "Content-Type": "application/json",
                    "Authorization": token
            }
        })
        return response.data
    } catch (error) {
        // Handle the error in some way
        console.error("Error fetching user company details:", error);
        throw new Error("Failed to fetch user company details");
    }
}