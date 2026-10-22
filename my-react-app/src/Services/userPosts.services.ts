import axios from "axios";
import { baseUrl } from "../constant/enviromant";


export async function getUserPosts(token: string , userId: string){
    const {data} = await axios.get(`${baseUrl}/users/${userId}/posts`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    return data

}
    
