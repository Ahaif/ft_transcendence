import { SOCKET_URL } from '@/config/config';
import { io } from 'socket.io-client';
import { Cookies } from 'react-cookie';

export const socket = io(SOCKET_URL, {
  extraHeaders: {
    Authorization: `Bearer ${new Cookies().get('token')}`,
  },
});

