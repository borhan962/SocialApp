import axios from "axios";
import { baseUrl } from "../constant/enviromant";


export async function showFollowSuggest(token: string) {
    const { data } = await axios.get(`${baseUrl}/users/suggestions?limit=10`, {
        headers: {
            token: token,
            Authorization: `Bearer ${token}`
        }

    });

    return data;
}



export async function follow(token: string , userId : string) {
    const { data } = await axios.put(
        `${baseUrl}/users/${userId}/follow`,
        {},
        {
            headers: {
                token: token,
                Authorization: `Bearer ${token}`
            }
        }
    );

    return data;
}


    
