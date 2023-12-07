import axios from "axios"

export const createCustomer = async (id:string, token: string) => {
    try {
        const response = await axios({
            url: `${process.env.NEXT_PUBLIC_PUBLIC_URL}/ddvagent/company/subscription?id=${id}`,
            headers:{
                "Content-Type": "application/json",
                "Authorization": token
            },
            method: "POST",
        })
        return response.data;
    } catch (error) {
        throw error
    }
}

export const createSubscription = async(product:string, customerID:string, token:string) => {
    try {
        const response = await axios({
            url: `${process.env.NEXT_PUBLIC_PUBLIC_URL}/ddvagent/company/subscription/checkout`,
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                "Authorization": token
        },
            data: JSON.stringify({
                product,
                customerID
            })
        })
        return response.data
    } catch (error) {
        throw error
    }
}

export const createBilling = async(customerId:string, token: string) => {
    try {
        const response = await axios({
            url: `${process.env.NEXT_PUBLIC_PUBLIC_URL}/ddvagent/company/subscription/billing`,
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                "Authorization": token
        },
            data: JSON.stringify({
                customerId
            })
        })
        return response.data
    } catch (error) {
        throw error
    }
}