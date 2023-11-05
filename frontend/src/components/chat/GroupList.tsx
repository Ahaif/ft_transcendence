import React from 'react';
import { Stack } from '@chakra-ui/layout';
import { Box, Flex, Text, Divider, Avatar, AvatarGroup, AvatarBadge } from '@chakra-ui/react';
import chatContext from '@/context/chatContext';
import { useContext } from 'react';


const GroupList = (props: any) => {
    const {setConvo, setIsGroupChat, showMob, setShowMob} = useContext(chatContext);
    const {isSmall} = props
    const items = props.items || [];

    if (items && items.length === 0 || items === undefined) {
        return (
            <Text
                fontSize={'sm'}
                color={"gray.200"}
                fontStyle={'italic'}
            >
                No groups yet
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
              setConvo(item.groupName);
              setIsGroupChat(true);
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
              <AvatarGroup
                size='xs'
                max={2}
              >
                {item.users.map((user: any, index: any) => (
                    <Avatar key={index} src={user.avatar} />
                ))}
              </AvatarGroup>
              <Divider orientation="vertical" h={6} mx={2} mr={3} />
              <Flex mr={2} flexDirection={'column'}>
                <Text
                    fontSize={'sm'}
                    fontWeight="bold"
                    color={"white"}
                >
                    {item.groupName}
                </Text>
                <Text
                  fontSize={'xs'}
                  color={"gray.200"}
                  fontStyle={'italic'}
                >
                  {item.chatMessages[0] ? item.chatMessages[0].message : 'No messages yet'}
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

export default GroupList;
