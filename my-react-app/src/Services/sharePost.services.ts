import axios from "axios";
import { baseUrl } from "../constant/enviromant";

export async function sharePost(token: string, postId: string, payload: any = "") {
    let bodyText = "";

    if (typeof payload === "string") {
        bodyText = payload;
    } else if (payload instanceof FormData) {
        bodyText = (payload.get("body") as string) || (payload.get("content") as string) || "";
    } else if (payload && typeof payload === "object") {
        bodyText = payload.body || payload.content || "";
    }

    const payloadObj = bodyText ? { body: bodyText } : {};

    try {
        const { data } = await axios.post(
            `${baseUrl}/posts/${postId}/share`,
            payloadObj,
            {
                headers: {
                    token: token,
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return data;
    } catch (err: any) {
        // Fallback to FormData if the backend unexpectedly expects multipart
        if (err?.response?.status === 400 || err?.response?.status === 415) {
            const fd = new FormData();
            if (bodyText) {
                fd.append("body", bodyText);
            }
            const { data } = await axios.post(
                `${baseUrl}/posts/${postId}/share`,
                fd,
                {
                    headers: {
                        token: token,
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return data;
        }
        throw err;
    }
}
