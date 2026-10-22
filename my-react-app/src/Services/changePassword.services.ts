import axios from "axios";
import { baseUrl } from "../constant/enviromant";

export interface ChangePasswordPayload {
  password: string;
  newPassword: string;
}

export async function changePassword(token: string, payload: ChangePasswordPayload) {
  const { data } = await axios.patch(
    `${baseUrl}/users/change-password`,
    payload,
    {
      headers: {
        token: token,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return data;
}
