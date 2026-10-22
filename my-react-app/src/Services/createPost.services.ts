import axios from "axios";
import { baseUrl } from "../constant/enviromant";


export async function createPost(token: string, formData: FormData) {
    const { data } = await axios.post(`${baseUrl}/posts`, formData, {
        headers: {
            token: token,
            Authorization: `Bearer ${token}`
        }

    });

    return data;
}
    
