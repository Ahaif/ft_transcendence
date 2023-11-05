import { Box, IconButton, Flex } from '@chakra-ui/react';
import { FiCheck, FiX } from 'react-icons/fi';
import { socket } from '@/service/socket';
import { NextRouter, useRouter } from 'next/router';
import { useContext } from 'react';
import { AppCtx } from '@/context/socketContext';
interface GameInvite {
  roomName: string;
  userName: string;
}
const accept = (roomName: string) => {
  return socket.emit('joinPrivateGame', { type: 'accept', roomName });
};
const reject = (roomName: string, otherPlayer: string, router: NextRouter) => {
  socket.emit('joinPrivateGame', { type: 'reject', roomName, otherPlayer: otherPlayer});
};
export default function GameInvite({ games }: { games?: GameInvite[] }) {
  const router = useRouter();
  const gameContext = useContext(AppCtx)
  return (
    <Flex flexDirection="column" alignItems="center">
      {games?.map((item: GameInvite) => (
        <Box w="100%" p={4} display="flex" gap="10px" alignItems="center">
          <Box
            mt="1"
            fontWeight="semibold"
            as="h4"
            lineHeight="tight"
            noOfLines={1}
          >
            {`${item.userName} invite to play a game!`}
          </Box>

          <IconButton
            colorScheme="green"
            variant="solid"
            icon={<FiCheck />}
            size="sm"
            onClick={() => {
              accept(item.roomName);
              gameContext.setGames(games.filter((game) => game.roomName !== item.roomName))
            }}
            aria-label="Accept"
          />
          <IconButton
            colorScheme="red"
            variant="solid"
            size="sm"
            onClick={() => {
              reject(item.roomName, item.userName, router);
              gameContext.setGames(games.filter((game) => game.roomName !== item.roomName))
            }}
            icon={<FiX />}
            mx={1}
            aria-label="Reject"
          />
        </Box>
      ))}
    </Flex>
  );
}
