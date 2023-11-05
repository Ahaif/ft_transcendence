import React from 'react';
import { Box, Flex, Text, Tooltip} from '@chakra-ui/react';
import moment from 'moment';
import { Avatar } from '@chakra-ui/react';
import { Cookies } from 'react-cookie';


const MessageBubble = (props: any) => {
    const { Message, messageType, timestamp, username, avatar } = props;
    return (
      <Box>
        {messageType === 'sent' ? (
          <Flex
            w="fit-content"
            p={4}
            rounded="md"
            margin={2}
            ml="auto"
            maxW="80%"
            pb={6}
            position="relative"
            textAlign="right"
            wordBreak="break-word"
            bg="messenger.500"
            minW="71px"
            color="white"
          >
            <Tooltip
              m={4}
              label={moment(timestamp).format('YYYY-MM-DD')}
              placement="top"
            >
              {Message}
            </Tooltip>
            <Text
              as="span"
              color="white"
              p={3}
              fontSize="9px"
              position="absolute"
              bottom="-2px"
              textAlign="right"
              right="0"
            >
              {moment(timestamp).format('HH:mm')}
            </Text>
          </Flex>
        ) : (
          <>
          <Flex flexDirection={'row'}>
            <Avatar
              src={avatar}
              size={'md'}
              mt={4}
              borderColor='messenger.500'
              borderWidth={1}
            />
          <Flex
            w="fit-content"
            p={4}
            rounded="md"
            m={2}
            minW="71px"
            maxW="80%"
            pb={6}
            position="relative"
            textAlign="left"
            wordBreak="break-word"
            bg={"gray.500"}
          >
            <Tooltip
              m={4}
              label={moment(timestamp).format('YYYY-MM-DD')}
              placement="top"
            >
              {Message}
            </Tooltip>
            <Text
              as="span"
              color={"black"}
              p={3}
              fontSize="9px"
              position="absolute"
              bottom="-2px"
              textAlign="right"
              left="0"
            >
              {moment(timestamp).format('LT')}
            </Text>
          </Flex>
          </Flex>
          </>
        )}
      </Box>
    );
  };

  const RenderMessages = ({ messages, setAllMessages, username, socket}: any) => {
      const cookie = new Cookies().get('token');
      let url: string = '';
      if (!username) {
          return (
              <Text fontSize="lg" color="gray.500" textAlign="center" mt={4}>
                  Start a new chat
              </Text>
          )
      }

      React.useMemo(() => {
          socket.emit('getChatMessages', {username: username});
      }, [username]);

      React.useEffect(() => {
          socket.on('getChatMessages', (data: any) => {
              setAllMessages(data);
          })
        }, [])

      return (
          <>
          {messages.length === 0 && (
              <Text fontSize="sm" color="gray.500" textAlign="center" mt={4}>
              No more messages
              </Text>
          )}
          {messages.map((message: any, index: any) => (
              <MessageBubble
                  key={index}
                  Message={message.message}
                  messageType={message.messageType}
                  timestamp={message.timestamp}
                  username={message.username}
                  avatar={message.avatar}
              />
          ))}
          </>
      );
};

export default RenderMessages;
