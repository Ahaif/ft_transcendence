import axios from 'axios';
import { Cookies } from 'react-cookie';

export const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

export function authHeader() {
    const token = new Cookies().get('token');
    if (token) {
        return { Authorization: `Bearer ${token}` };
    }
    return {};
}


class UserService {
    public getUserInfo() {
        return axios.get(`${baseUrl}/api/me`, { headers: authHeader() });
    }

    public checkJWT() {
        return axios.get(`${baseUrl}/api/token/check`, { headers: authHeader() });
    }

    public updateUserInfo(newInfo: FormData) {
        return axios.post(`${baseUrl}/api/user/update`, newInfo, {
            headers: {
                ...authHeader(),
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    public sendOTP(code: string) {
        return axios.post(`${baseUrl}/otp/verify`, {token: code}, { headers: authHeader() });
    }

    public generateOTP() {
        return axios.post(`${baseUrl}/otp/generate`,{}, { headers: authHeader() });
    }

    public enableOTP(code: string) {
        return axios.post(`${baseUrl}/otp/enable`, {token: code}, { headers: authHeader() });
    }

    public disableOTP() {
        return axios.post(`${baseUrl}/otp/disable`, {}, { headers: authHeader() });
    }

    public deleteUserInfo() {
        return axios.post(`${baseUrl}/api/user/delete`, {}, { headers: authHeader() });
    }

    public refreshToken() {
        return axios.post(`${baseUrl}/api/refresh`, {}, { headers: authHeader() });
    }

    public getUserPublicInfo(username: string) {
        return axios.get(`${baseUrl}/api/user/${username}`, { headers: authHeader() });
    }

    public searchUser(username: string) {
        return axios.get(`${baseUrl}/api/search/${username}`, { headers: authHeader() });
    }

    public getPendingRequest() {
        return axios.get(`${baseUrl}/api/pending`, {headers: authHeader() });
    }

    public getFriends(username: string) {
        return axios.get(`${baseUrl}/api/public/friends/${username}`, { headers: authHeader() });
    }

    public addFriend(username: string) {
        return axios.get(`${baseUrl}/api/add/${username}`,{ headers: authHeader() });
    }

    public cancelRequest(username: string) {
        return axios.get(`${baseUrl}/api/cancel/${username}`, { headers: authHeader() });
    }

    public removeFriend(username: string) {
        return axios.get(`${baseUrl}/api/delete/${username}`, { headers: authHeader() });
    }

    public blockUser(username: string) {
        return axios.get(`${baseUrl}/api/block/${username}`, { headers: authHeader() });
    }

    public unblockUser(username: string) {
        return axios.get(`${baseUrl}/api/unblock/${username}`, { headers: authHeader() });
    }

    public getChatInfo() {
        return axios.get(`${baseUrl}/api/chat/info`, { headers: authHeader() });
    }

    public acceptFriend(username: string){
        return axios.get(`${baseUrl}/api/accept/${username}`, { headers: authHeader() })
    }

    public rejectFriend(username: string){
        return axios.get(`${baseUrl}/api/reject/${username}`, { headers: authHeader() })
    }


    public isGroupChat(username?: string) {
      return axios.get(`${baseUrl}/api/check/${username}`,{headers: authHeader()});
    }

    public getLeaderBoard() {
        return axios.get(`${baseUrl}/api/leaderboard`, { headers: authHeader() });
    }

}

export default new UserService();
