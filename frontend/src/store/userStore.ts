import { proxy } from "valtio";
import { Socket } from "socket.io-client";
import React from "react";

type userData = {
    username: string;
    avatar: string;
    clColor: string;
    clImageUrl: string;
    intraName: string;
}

type State = {
    user: any[];
    username: string;
    avatar: string;
    clColor: string;
    clImageUrl: string;
    intraName: string;
    isExstingUser: boolean;
};


export const userStore = proxy<State>({
    user: [],
    isExstingUser: true,
    username: "",
    avatar: "",
    clColor: "",
    clImageUrl: "",
    intraName: "",
});

export const setData = (newUser: any[]) => {
    userStore.user = newUser;
};

export const setExistingUser = (isExstingUser: boolean) => {
    userStore.isExstingUser = isExstingUser;
}

export const setUserData = (data: userData) => {
    userStore.username = data.username;
    userStore.avatar = data.avatar;
    userStore.clColor = data.clColor;
    userStore.clImageUrl = data.clImageUrl;
    userStore.intraName = data.intraName;
}

export const setUsernameAvatar = (username: string, avatar: string) => {
    userStore.username = username;
    userStore.avatar = avatar;
}





