import axios from "axios";
import { baseUrl } from "../constant/enviromant";


export async function getUserData(token: string){

    const res = await axios.get(`${baseUrl}/users/profile-data`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    return res.data

}
    
