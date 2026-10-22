import axios from "axios";
import { baseUrl } from "../constant/enviromant";


export async function createComment(token: string, postId: string, formData: FormData) {
    const { data } = await axios.post(`${baseUrl}/posts/${postId}/comments`, formData, {
        headers: {
            token: token,
            Authorization: `Bearer ${token}`
        }

    });

    return data;
}
    
