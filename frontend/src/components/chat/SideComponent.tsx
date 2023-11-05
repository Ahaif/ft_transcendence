import React, { useContext, useState } from 'react';
import {
  Button,
  Flex,
  Stack,
  Text,
  Divider,
  useDisclosure,
  useToast,
  useMediaQuery,
} from '@chakra-ui/react';
import { IoSettingsOutline } from 'react-icons/io5';
import userService from '@/service/userService';
import useSWR from 'swr';
import SearchRecipient from './Search';
import MessageBox from './Messages';
import ChatList from './ChatList';
import Loading from '../Loading';
import CreateGroupModal from './GroupCreate';
import GroupList from './GroupList';
import { useRouter } from 'next/router';
import { socket } from '@/service/socket';
import chatContext from '@/context/chatContext';
import moment from 'moment';
import MobileSideComponent from './MobileSideComponent';

const SideBar = (props: any) => {
  const router = useRouter();
  const username = router.query['username']?.toString();
  const { socket, user } = props;
  const [show, setShow] = useState<boolean>(false);
  const [messages, setMessages] = useState<any>([]);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [groups, setGroups] = useState<any>([]);
  const {showMob,setShowMob, setIsGroupChat, convo, setConvo} = useContext(chatContext);
  const [isSM] = useMediaQuery('(max-width: 500px)');
  const [isLarge] = useMediaQuery('(min-width: 800px)');


  React.useEffect(() => {
    if (props.user.messages && props.user.messages.length > 0 && convo === '') {
      setConvo(props.user.messages[0].username);
    }

    if (username && username !== convo) {
      setConvo(username);
    }
  }, [props.user.messages, convo, username]);

  React.useEffect(() => {
    socket.emit('getGroups', {});
    socket.on('groups', (data: any) => {
      setGroups(data);
    });

  }, []);

  React.useMemo(() => {
      if (isLarge && showMob) setShowMob(false);
  }, [isLarge])

  const showSearchBar = () => setShow(!show);

  return (
    <>
      <Flex w={'100%'} h={'80vh'} flexDirection={'row'} borderRadius={4} p={2}>
        <Flex
          direction="column"
          w={isSM ? '100%' : {base: '0', md: '30%', lg: '20%' }}
          overflowY="scroll"
          css={{
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
          borderRadius={4}
        >
          {!isSM && (
            <Flex
              align="center"
              justify="center"
              position="sticky"
              top={0}
              zIndex={199}
              p={4}
              h={'81px'}
              borderBottom="1px solid"
              borderColor={"gray.700"}
              transitionDuration="200ms"
              bg={"gray.800"}
            >
              <Text
                fontSize={'md'}
                fontWeight="bold"
                color={"white"}
              >
                P0NG CHAT
              </Text>
            </Flex>
          )}
          <Flex
            flexDirection="column"
            bg={"gray.800"}
            transitionDuration="200ms"
            flex="1"
            h={'md'}
            overflowY="scroll"
            css={{
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            <Flex flexDirection={'column'} p={4}>
              {show && (
                <SearchRecipient
                  showSearchBar={showSearchBar}
                  isSmall={false}
                />
              )}
              {show === false && (
                <Button onClick={showSearchBar}>New chat</Button>
              )}
            </Flex>
            <Stack spacing={0} p={4}>
              <ChatList
                items={user.messages}
              />
            </Stack>
          </Flex>
          <Divider my={4} />
          <Flex
            flexDirection="column"
            bg={"gray.800"}
            transitionDuration="200ms"
            flex="1"
            h={'md'}
            overflowY="scroll"
            css={{
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            <Flex alignItems={'center'} justifyContent={'center'}>
              <Button
                colorScheme="messenger"
                w={'80%'}
                variant={'outline'}
                onClick={onOpen}
              >
                New Group
              </Button>
              <CreateGroupModal
                isOpen={isOpen}
                onClose={onClose}
                socket={props.socket}
              />
            </Flex>
            <Stack spacing={0} p={4}>
              <GroupList
                items={groups}
                setIsGroup={setIsGroupChat}
                groups={groups}
              />
            </Stack>
          </Flex>
        </Flex>
      {showMob === false ? (
          <MessageBox
            username={convo}
            messages={messages}
            socket={props.socket}
            user={user}
          />
      ) : (
        <MobileSideComponent
            user={user}
            socket={props.socket}
            groups={groups}
        />
      )}
      </Flex>
    </>
  );
};

const ChatComponent = (props: any) => {
  const [data, setData] = React.useState<any>([]);
  const toast = useToast();
  if (socket === null) {
    throw new Error('Socket is null');
  }

  const { isGroupChat, convo, allMessages, setAllMessages} = useContext(chatContext);

  React.useEffect(() => {
    socket.on('error', (data) => {
      if (data === undefined || data.message === undefined)
        return;
      let { message } = data;
      if (message === undefined || message === null)
        message = "Something went wrong, please try again later"
      toast({
        title: 'Error',
        description: message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    });

    socket.on('info', (data) => {
      toast({
        title: 'Info',
        description: data.message,
        status: 'info',
        duration: 9000,
        isClosable: true,
      });
    });

    socket.on('success', (data: any) => {
      toast({
        title: 'success',
        description: data.message,
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    });

    socket.emit('getGroups', {});
    socket.emit('getInfo', {});
    socket.on('getInfo', (data) => {
      setData('');
      setData(data);
    });
    socket.on('dm', handleIncomingMessageDm);
    socket.on('dmRoom', handleIncomingMessageDmRoom);

    return () => {
      socket.off('error');
      socket.off('info');
      socket.off('getInfo');
      socket.off('success');
      socket.off('dm', handleIncomingMessageDm);
        socket.off('dmRoom', handleIncomingMessageDmRoom);
    };
  }, [isGroupChat, convo]);

  const handleIncomingMessageDm = (data: any, error: any) => {
    if (data.from === 'me' || isGroupChat === true) return;
    setAllMessages((prevMessages: any) => [
        ...prevMessages,
        {
          message: data.message,
          messageType: 'received',
          timestamp: moment().unix(),
          username: data.from,
          avatar: data.avatar,
        },
      ]);
    if (error) {
      console.log(error);
    }
  };

  const handleIncomingMessageDmRoom = (data: any, error: any) => {
    if (data.group !== convo) return;
    setAllMessages((prevMessages: any) => [
      ...prevMessages,
      {
        message: data.message,
        messageType: 'received',
        timestamp: moment().unix(),
        username: data.from,
        avatar: data.avatar,
      },
    ]);
    if (error) {
      console.log(error);
    }
  };




  return (
    <SideBar
      user={data}
      socket={socket}
    />
  );
};

export default ChatComponent;
