import {writable} from "svelte/store";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let window:any;

export const chatVisibilityStore = writable(false);

window.openChat = () => chatVisibilityStore.set(true) //todo: remove this

export enum ChatMessageTypes {
    text=1,
    userIncoming,
    userOutcoming,
}

export interface ChatMessage {
    type: ChatMessageTypes;
    author: string;
    text: string;
}

function createChatMessagesStore() {
    //todo: remove this list
    const dummyList: ChatMessage[] = [
        {type: ChatMessageTypes.userIncoming, author: 'someone', text: ''},
        {type: ChatMessageTypes.text, author: 'someone', text: 'https://www.google.com is cool'},
    ]
    const { subscribe, update} = writable<ChatMessage[]>(dummyList);

    return {
        subscribe,
        //todo: different setters for text message and system messages
        addMessage: (newMessage: ChatMessage) => {
            update(list => {
                list.push(newMessage)
                return list;
            });
        },
    };
}
export const chatMessagesStore = createChatMessagesStore();