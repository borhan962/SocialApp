import axios from "axios";
import { baseUrl } from "../constant/enviromant";


export async function getAllComments(token: string , postId:string ){
    const {data} = await axios.get(`${baseUrl}/posts/${postId}/comments?page=1&limit=10`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    return data

}
    
