
import axios, { AxiosResponse, AxiosError } from "axios";
import toast from "react-hot-toast";
// const baseurl: string = "http://159.89.164.11:7677/admin/v1"
const baseurl: string = "http://localhost:7777/api/v1"
export const imgBaseUrl : string = "http://localhost:7777"


interface ApiResponse {
    success: boolean;
    message: string;
    [key: string]: any; // Any additional properties in response
}

export const Apiservice = {
    get: async (endpoint: string): Promise<AxiosResponse<ApiResponse> | undefined> => {
        try {
            const res = await axios.get(baseurl + endpoint);
            if (res.data.success === false) {
                toast.error(res.data.message);
                return res;
            }
            return res;
        } catch (error) {
            const err = error as AxiosError
            toast.error(err.message)
        }
    },
    getAuth: async (endpoint: string, token: string): Promise<AxiosResponse<ApiResponse> | undefined> => {
        try {
            const res = await axios.get(baseurl + endpoint, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.data.success === false) {
                toast.error(res.data.message);
                return res;
            }

            return res;
        } catch (error) {
            const err = error as AxiosError
            // toast.error(err.message)
            throw error;
        }
    },

    post: async (endpoint: string, body: Record<string, any>): Promise<AxiosResponse<ApiResponse> | undefined> => {
        try {
            const res = await axios.post(baseurl + endpoint, body);
            if (res.data.success === false) {
                toast.error(res.data.message);
                return res;
            }
            return res;
        } catch (error) {
            const err = error as AxiosError
            toast.error(err.message)
        }
    },

    postAuth: async (endpoint: string, body: Record<string, any>, token: string): Promise<AxiosResponse<ApiResponse> | undefined> => {
        try {
            const res = await axios.post(baseurl + endpoint, body, {
                headers: {
                    Authorization: `Bearer ${token}`,                    
                },
            });
            console.log("ffffffffffresresresresres" , res);
            
            if (res.data.success === false) {
                // toast.error(res.data.message);
                return res;
            }
            toast.success(res.data.message)
            return res;
        } catch (error) {
            const err = error as AxiosError
            // toast.error(err.message);
            throw error;
        }
    },
    postAPIAuthFormData: async (endpoint: string, body: Record<string, any>, token: string): Promise<AxiosResponse<ApiResponse> | undefined> => {
        try {
            const res = await axios.post(baseurl + endpoint, body, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,                    
                },
            });
            if (res.data.success === false) {
                toast.error(res.data.message);
                return res;
            }
            return res;
        } catch (error) {
            const err = error as AxiosError
            // toast.error(err.message);
            throw error;
        }
    },
    postAPI : async (endpoint: string, body: Record<string, any>): Promise<AxiosResponse<ApiResponse> | undefined> => {
        try {
            const res = await axios.post("https://ecommerce.imgglobal.in/backend/" + endpoint, body);
            if (res.data.success === false) {
                toast.error(res.data.message);
                return res;
            }
            return res;
        } catch (error) {
            const err = error as AxiosError
            toast.error(err.message)
        }
    }
};
