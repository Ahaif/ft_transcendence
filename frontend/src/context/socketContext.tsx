import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import Router from 'next/router';
import { initialRoom, intialValue } from './helpers';
import { GameDataType, userDataInterface, RoomDataType } from './types';
import { changeRoute } from '../hooks/changeRoute';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { socket } from '../service/socket';

interface AppContextInterface {
  gameData: GameDataType;
  userData: userDataInterface | null;
  roomData: RoomDataType;
  watchers: string[];
  games: GameInvite[];
  setGames: React.Dispatch<React.SetStateAction<GameInvite[]>>;
}
interface GameInvite {
  roomName: string;
  userName: string;
}
export const AppCtx = createContext<AppContextInterface>({
  gameData: intialValue,
  userData: null,
  roomData: initialRoom,
  watchers: [],
  games: [],
  setGames: () => {},
});

// export const useAppContext = (): AppContextInterface => {
//   const context = useContext(AppCtx);
//   if (!context) {
//     throw new Error('useAppContext must be used within an AppCtx.Provider');
//   }
//   return context;
// };

export const SocketContext: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userData, setUserData] = useState<userDataInterface | null>(null);
  const [roomData, setRoomData] = useState<RoomDataType>(initialRoom);
  const [watchers, setWatchers] = useState<string[]>([]);
  const [games, setGames] = useState<GameInvite[]>([]);
  const [gameData, setGameData] = useState<GameDataType>(intialValue);
  const [changed, init] = changeRoute();

  useEffect(() => {
    if (changed && roomData.roomName) {
      socket.emit('leftRoom', { roomName: roomData.roomName });
    }
    return () => {
      if (typeof init === 'function') {
        init();
      }
    };
  }, [changed, roomData]);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await axios.get('/');
        setUserData(res.data);
      } catch (e) {
        // Handle error
      }
    };
    getUserData();
  }, []);

  useEffect(() => {
    socket.on('requestToPlay', (data) => {
      const { roomName, userName } = data;
      setGames([...games, { roomName, userName }]);
    });
    socket.on('watcher', (data) => {
      const { socketId, type, roomName, watchersRoom } = data;
      if (type !== 'LEAVE') {
        if (socketId === socket.id) {
          setRoomData({ ...roomData, roomName });
        }
        setWatchers([...watchersRoom]);
      } else {
        setWatchers([...watchersRoom]);
      }
    });

    socket.on('error', () => {
      Router.push('/game/');
    });

    socket.on('joinRoom', (data: RoomDataType) => {
      setGameData(intialValue);
      setRoomData(data);
      Router.push('/game/' + data.roomName);
    });

    socket.on('leftGame', (data) => {
      setRoomData({
        ...roomData,
        status: data.status,
        winner: data.player1 !== '' ? roomData.player1 : roomData.player2,
      });
    });

    socket.on('gameOver', (data) => {
      const { status, player1, player2 } = data;
      setRoomData({
        ...roomData,
        status: status,
        winner: player1 === 10 ? roomData.player1 : roomData.player2,
      });
      setGameData({
        ...intialValue,
        score: {
          player1: player1,
          player2: player2,
        },
      });
    });
    return () => {
      socket.off('watcher');
      socket.off('error');
      socket.off('joinRoom');
      socket.off('leftGame');
      socket.off('gameOver');
    };
  }, [roomData]);

  useEffect(() => {
    socket.on('gameData', (data: GameDataType) => {
      setGameData(data);
    });
    return () => {
      socket.off('gameData');
    };
  }, [gameData.ball]);

  return (
    <AppCtx.Provider
      value={{
        setGames,
        gameData,
        userData,
        roomData,
        watchers,
        games,
      }}
    >
      {children}
    </AppCtx.Provider>
  );
};
