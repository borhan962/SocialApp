import axios from "axios";
import { baseUrl } from "../constant/enviromant";


export async function getSinglePost(token: string , postId: string){
    const {data} = await axios.get(`${baseUrl}/posts/${postId}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    return data

}
    
