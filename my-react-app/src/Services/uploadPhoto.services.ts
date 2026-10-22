import axios from "axios";
import { baseUrl } from "../constant/enviromant";

export async function uploadUserPhoto(token: string, formData: FormData) {
    const { data } = await axios.put(`${baseUrl}/users/upload-photo`, formData, {
        headers: {
            token: token,
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
        }
    });

    return data;
}
