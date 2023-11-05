import { Socket } from 'socket.io';

export interface ClientType extends Socket {
    user: {
        user: string
    }
}
