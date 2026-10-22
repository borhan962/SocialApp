import axios from "axios";
import { baseUrl } from "../constant/enviromant";


export async function likePosts(token: string, postId: string) {
    const { data } = await axios.put(`${baseUrl}/posts/${postId}/like` ,{}, {
        headers: {
            token: token,
            Authorization: `Bearer ${token}`
        }

    });

    return data;
}

export async function likeComment(token: string, postId: string, commentId: string) {
    const headers = {
        token: token,
        Authorization: `Bearer ${token}`
    };

    try {
        const { data } = await axios.put(`${baseUrl}/posts/${postId}/comments/${commentId}/like`, {}, {
            headers
        });
        return data;
    } catch (error: any) {
        if (error.response?.status === 404 || error.response?.status === 405) {
            const { data } = await axios.patch(`${baseUrl}/posts/${postId}/comments/${commentId}/like`, {}, {
                headers
            });
            return data;
        }
        throw error;
    }
}
    
