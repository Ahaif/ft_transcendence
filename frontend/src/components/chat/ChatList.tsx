import React from 'react';
import { Stack } from '@chakra-ui/layout';
import { Box, Flex, Text, Divider, Avatar } from '@chakra-ui/react';
import chatContext from '@/context/chatContext';
import { useContext } from 'react';
const ChatList = (props: any) => {
   const {isGroupChat, setIsGroupChat, setConvo, showMob, setShowMob} = useContext(chatContext);
   const {isSmall} = props
   const items = props.items || [];

    if (items && items.length === 0 || items === undefined) {
        return (
            <Text
                fontSize={'sm'}
                color={'gray.200'}
                fontStyle={'italic'}
            >
                {'No chats yet'}
            </Text>
        )
    }
  return (
    <Stack>
      {items.map((item: any, index: any) => (
        <React.Fragment key={index}>
          <Box
            key={index}
            onClick={() => {
              setConvo(item.friendUserId);
              setIsGroupChat(false);
              if (isSmall && isSmall === true) {
                setShowMob(!showMob);
              }
            }}
            _hover={{
              backgroundColor: "gray.700",
              cursor: 'pointer',
            }}
            borderRadius={4}
            borderX={1}
          >
            <Flex direction="row" p={1} alignItems="center">
              <Avatar size="sm" src={item.avatar} />
              <Divider orientation="vertical" h={6} mx={2} mr={3} />
              <Flex mr={2} flexDirection={'column'}>
                <Text>{item.friendUserId}</Text>
                <Text
                  fontSize={'xs'}
                  color={"gray.200"}
                  fontStyle={'italic'}
                >
                  {item.message}
                </Text>
              </Flex>
            </Flex>
          </Box>
          <Divider orientation="horizontal" />
        </React.Fragment>
      ))}
    </Stack>
  );
};

export default ChatList;
