import axios from "axios";
import { baseUrl } from "../constant/enviromant";


export async function getFeedFollowing(token: string) {
    const { data } = await axios.get(`${baseUrl}/posts/feed?only=following&limit=10`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return data;
}
