import React, { useEffect, useRef } from 'react';
import {
  Box,
  Flex,
  Text,
  Avatar,
  Tooltip,
  Divider,
  IconButton,
  FormControl,
  Input,
  Button,
  useMediaQuery,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
  Center,
  Spinner
} from '@chakra-ui/react';
import moment from 'moment';
import { IoSendOutline, IoArrowBack } from 'react-icons/io5';
import { useState } from 'react';
import { Cookies } from 'react-cookie';
import ManageGroup from './groups/ManageGroup';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ChatComponent from './SideComponent';
import chatContext from '@/context/chatContext';
import RenderMessages from './RenderMessages';

const Header = (props: any) => {
  let { isGroup, socket } = props;
  const [data, setData] = useState<any>({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [isOnline, setIsOnline] = useState(false);
  const router = useRouter();
  const [pending, setPending] = useState(false);

  React.useEffect(() => {
    if (isGroup === true) {
      socket.emit('groupInfo', { groupName: props.username });
    }
    socket.on('groupInfo', (data: any) => {
      setData(data);
    });

    const fetchUserStatus = () => {
      socket.emit('getUserStatus', { username: props.username });

      socket.on('userStatus', (status: string) => {
        setIsOnline(status === 'online');
      });

      return () => {
        socket.off('userStatus');
      };
    };
    if (!isGroup) fetchUserStatus();
  }, [props.username, socket]);

  const leaveFromGroup = () => {
    socket.emit('leaveGroup', { groupName: props.username });
    socket.on('leaveGroup', (data: any) => {
      toast({
        title: 'Info',
        description: data,
        status: 'info',
        duration: 9000,
        isClosable: true,
      });
    });
    setTimeout(() => router.reload(), 500);
  };

  React.useEffect(() => {
    socket.on('InviteRejected', () => {
      toast({
        title: 'Game Invite Rejected',
        description: 'Invite Rejected',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      setPending(false);
    })

    return () => {
      socket.off('InviteRejected');
    }
  }, [pending])

  return (
    <>
      {props.username !== '' &&
      props.username !== undefined &&
      props.username !== null ? (
        <Flex flexDirection={'row'} w={'100%'} justifyContent="space-between">
          <Flex flexDirection={'row'}>
            <Box ml={3}>
              <Link href={isGroup ? `#` : `/profile/${props.username}`}>
                <Text>
                  {isGroup ? (
                    <Text
                      color={'gray.400'}
                      fontWeight={'bold'}
                      fontSize={'sm'}
                      textTransform={'uppercase'}
                      cursor={'not-allowed'}
                    >
                      {props.username} (Group)
                    </Text>
                  ) : (
                    <Text
                      color={'blue.500'}
                      fontWeight={'bold'}
                      fontSize={'lg'}
                      _hover={{
                        textDecoration: 'underline',
                      }}
                    >
                      {props.username}
                    </Text>
                  )}
                </Text>
              </Link>
              {!isGroup ? (
                <Text color={'gray.400'}>
                  {isOnline ? 'Online' : 'Offline'}
                </Text>
              ) : (
                <Text
                  color={'blue.500'}
                  fontWeight={'bold'}
                  fontSize={'sm'}
                  textTransform={'uppercase'}
                >
                  {data.users && data.users.length} members
                </Text>
              )}
            </Box>
          </Flex>

          {isGroup ? (
            <Flex>
              {data.admin ? (
                <>
                  <Button
                    alignSelf={'flex-end'}
                    onClick={onOpen}
                    ml={2}
                    size="sm"
                  >
                    Manage Group
                  </Button>
                </>
              ) : (
                <Button alignSelf={'flex-end'} onClick={() => leaveFromGroup()}>
                  Leave Group
                </Button>
              )}
            </Flex>
          ) : (
            <>
              {!pending && (
                <Button
                  alignSelf={'flex-end'}
                  onClick={() => {
                    setPending(true);
                    socket.emit('createPrivateGame', {
                      username: props.username,
                    });
                  }}
                >
                  Invite to game
                </Button>
              )}
              {pending && (
                <Button alignSelf={'flex-end'} isDisabled>
                  {' '}
                  Pending
                  <Spinner color='messenger.500' ml={2}/>
                </Button>
              )}
            </>
          )}
        </Flex>
      ) : (
        <Box ml={3}>
          <Text fontWeight="bold">Welcome to P0NG CHAT</Text>
        </Box>
      )}
      <Modal isOpen={isOpen} onClose={onClose} size="3xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Manage your group</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ManageGroup
              users={data.users}
              socket={socket}
              groupName={props.username}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

const MessageBox = (props: any) => {
  const { intraName } = props.user;
  const { socket, groupy } = props;
  const messageRef = React.useRef<HTMLInputElement>(null);
  const sendButtonRef = React.useRef<HTMLButtonElement>(null);
  const messageBoxRef = React.useRef<HTMLDivElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isGroupChat,
    setShowMob,
    showMob,
    convo,
    allMessages,
    setAllMessages,
  } = React.useContext(chatContext);
  const username = convo;

  const handleSendMessage = () => {
    if (!messageRef.current?.value) return;

    if (isGroupChat === false) {
      socket.emit('dm', {
        message: messageRef.current.value,
        to: username,
      });
      // THis must be fixed, it must not setAllMessages on Error, Error will be sent if blocked user
      setAllMessages([
        ...allMessages,
        {
          message: messageRef.current.value,
          messageType: 'sent',
          timestamp: moment().unix(),
        },
      ]);
    } else {
      socket.emit('dmRoom', {
        message: messageRef.current.value,
        group: username,
      });
    }
    messageRef.current.value = '';
  };

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputBlur = () => {
    sendButtonRef.current?.focus();
  };

  const showSideBarMobile = () => {
    setShowMob(!showMob);
  };

  React.useEffect(() => {
    const messageBox = messageBoxRef.current;
    if (messageBox) messageBox.scrollTop = messageBox.scrollHeight;
  }, [allMessages]);

  return (
    <>
      <Divider orientation="vertical" />
      <Box
        borderRadius={4}
        w={'100%'}
        display="flex"
        flexDirection="column"
        bg={'gray.800'}
        transition="background-color 200ms"
      >
        <Flex
          align="center"
          position="sticky"
          top={0}
          p={4}
          h={'81px'}
          borderBottom="1px solid"
          borderColor={'gray.700'}
          transitionDuration="200ms"
          bg={'gray.800'}
        >
          <IconButton
            display={{ base: 'flex', md: 'none' }}
            variant="solid"
            aria-label="open menu"
            size={'md'}
            icon={<IoArrowBack />}
            mr={4}
            onClick={showSideBarMobile}
          />
          <Header
            username={username}
            isGroup={isGroupChat}
            socket={socket}
            intraName={intraName}
          />
        </Flex>
        <>
          <Box
            id="msg-box"
            p={6}
            pb={0}
            flex={1}
            overflowY="scroll"
            className="invisible"
            ref={messageBoxRef}
            css={{
              '&::-webkit-scrollbar': {
                width: '4px',
              },
              '&::-webkit-scrollbar-track': {
                width: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'blue',
                borderRadius: '24px',
                border: '4px solid transparent',
              },
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            <RenderMessages
              messages={allMessages}
              setAllMessages={setAllMessages}
              username={username}
              socket={socket}
            />
          </Box>
          <FormControl
            p={2}
            zIndex={3}
            as="form"
            display="flex"
            alignItems="center"
          >
            <Input
              position="sticky"
              bottom={0}
              type="text"
              placeholder="Type a message"
              ref={messageRef}
              onBlur={handleInputBlur}
              onKeyDown={handleKeyDown}
              disabled={!username || username === ''}
            />
            <IconButton
              aria-label="send"
              ml={2}
              icon={<IoSendOutline />}
              _focus={{ boxShadow: 'none' }}
              size="md"
              isRound
              onClick={handleSendMessage}
              ref={sendButtonRef}
              color={'messenger.400'}
              hidden={!username || username === ''}
            />
          </FormControl>
        </>
      </Box>
    </>
  );
};

export default MessageBox;
