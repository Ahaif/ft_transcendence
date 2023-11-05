import React, { createContext } from 'react';

type chatContextType = {
    isGroupChat: boolean;
    setIsGroupChat: React.Dispatch<React.SetStateAction<boolean>>;
    convo: string;
    setConvo: React.Dispatch<React.SetStateAction<string>>;
    allMessages: any[];
    setAllMessages: React.Dispatch<React.SetStateAction<any[]>>;
    showMob: boolean;
    setShowMob: React.Dispatch<React.SetStateAction<boolean>>;
};



const chatContext = createContext<chatContextType>({
    isGroupChat: false,
    setIsGroupChat: () => {},
    convo: '',
    setConvo: () => {},
    allMessages: [],
    setAllMessages: () => {},
    showMob: false,
    setShowMob: () => {},
});

export default chatContext;
