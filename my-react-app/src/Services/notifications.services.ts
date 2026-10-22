import axios from "axios";
import { baseUrl } from "../constant/enviromant";


export async function getNotifications(token: string) {
    const { data } = await axios.get(`${baseUrl}/notifications?page=1&limit=10`, {
        headers: {
            token: token,
            Authorization: `Bearer ${token}`
        }
    });

    return data;
}

export async function getUnreadCount(token: string) {
    try {
        const { data } = await axios.get(`${baseUrl}/notifications/unread-count`, {
            headers: {
                token: token,
                Authorization: `Bearer ${token}`
            }
        });
        return data;
    } catch {
        // Fallback: calculate unread count directly from notifications list
        try {
            const { data } = await axios.get(`${baseUrl}/notifications?page=1&limit=50`, {
                headers: {
                    token: token,
                    Authorization: `Bearer ${token}`
                }
            });

            const list =
                (Array.isArray(data?.data?.notifications) ? data.data.notifications : null) ??
                (Array.isArray(data?.notifications) ? data.notifications : null) ??
                (Array.isArray(data?.data) ? data.data : null) ??
                (Array.isArray(data) ? data : []);

            const count = list.filter((n: any) => !(n.isRead ?? n.read)).length;
            return { unreadCount: count };
        } catch {
            return { unreadCount: 0 };
        }
    }
}

export async function markAllNotificationsAsRead(token: string) {
    const { data } = await axios.patch(`${baseUrl}/notifications/read-all`, {}, {
        headers: {
            token: token,
            Authorization: `Bearer ${token}`
        }
    });

    return data;
}

export async function markNotificationAsRead(token: string, notificationId: string) {
    const { data } = await axios.patch(`${baseUrl}/notifications/${notificationId}/read`, {}, {
        headers: {
            token: token,
            Authorization: `Bearer ${token}`
        }
    });

    return data;
}
