import axios from "axios";
import { baseUrl } from "../constant/enviromant";


export async function bookmarkPost(token: string, postId: string) {
    const { data } = await axios.put(`${baseUrl}/posts/${postId}/bookmark`, {}, {
        headers: {
            token: token,
            Authorization: `Bearer ${token}`
        }
    });

    return data;
}
