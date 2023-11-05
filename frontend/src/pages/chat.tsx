import React from "react";
import Chat from "@/components/chat/Chat";
import chatContext from "@/context/chatContext";

export default function ChatPage() {

    const [isGroupChat, setIsGroupChat] = React.useState<boolean>(false);
    const [convo, setConvo] = React.useState<string>('');
    const [allMessages, setAllMessages] = React.useState<any[]>([]);
    const [showMob, setShowMob] = React.useState<boolean>(false);

    return (
        <chatContext.Provider value={{isGroupChat, setIsGroupChat, convo, setConvo, allMessages, setAllMessages, showMob, setShowMob}}>
            <Chat/>
        </chatContext.Provider>
    );
}
