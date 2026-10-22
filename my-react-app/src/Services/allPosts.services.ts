import axios from "axios";
import { baseUrl } from "../constant/enviromant";


export async function getAllPosts(token: string ){
    const {data} = await axios.get(`${baseUrl}/posts`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    return data

}
    
