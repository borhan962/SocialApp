import axios from "axios";
import { baseUrl } from "../constant/enviromant";


export async function deletePost(token: string , postId:string) {
    const { data } = await axios.delete(`${baseUrl}/posts/${postId}`, {
        headers: {
            token: token,
            Authorization: `Bearer ${token}`
        }

    });

    return data;
}
    
