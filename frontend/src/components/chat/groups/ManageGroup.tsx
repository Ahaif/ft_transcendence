import {
  Tooltip,
  Stack,
  Box,
  Flex,
  Spacer,
  Button,
  Divider,
  Text,
  Avatar,
  useToast,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Center,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

export default function ManageGroup(props: any) {
  const router = useRouter();
  const { users, socket, groupName } = props;
  const toast = useToast();
  const [muteDuration, setMuteDuration] = useState(0);
  const [newPassword, setNewPassword] = useState('');

  const deleteFromGroup = (username: string) => {
    if (username !== '') {
      socket.emit('deleteFromGroup', {
        username: username,
        groupName: groupName,
      });
    }
  };

  const setAdmin = (username: string) => {
    if (username !== '') {
      socket.emit('setAdmin', { username: username, groupName: groupName });
    }
  };

  const banUser = (username: string) => {
    if (username !== '') {
      socket.emit('banUser', { username: username, groupName: groupName });
    }
  };

  const muteUser = (username: string) => {
    if (username !== '') {
      socket.emit('muteUser', {
        username: username,
        groupName: groupName,
        duration: muteDuration,
      });
    }
  };

  const handleMuteDurationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const duration = parseInt(event.target.value);
    setMuteDuration(duration);
  };


  const leaveFromGroup = () => {
    socket.emit('leaveGroup', { groupName: groupName });
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

  const changePrivacy = () => {
    socket.emit('changePrivacy', { groupName: groupName });
  };

  const removePassword = () => {
    socket.emit('removePassword', { groupName: groupName });
  };

  const handleChangePassword = () => {
    socket.emit('changePassword', { groupName: groupName, newPassword });

    // Clear the input field after the password is changed
    setNewPassword('');
  };

  return (
    <>
      <Center>
      <Flex flexDirection="column" w={'50%'} justifyContent={'center'} >
        <Button onClick={() => changePrivacy()} colorScheme="teal" size="sm" my={2}>
          Change Privacy
        </Button>
        <Button
          onClick={() => removePassword()}
          colorScheme="red"
          size="sm"
          my={2}
        >
          Remove Password
        </Button>
        <Flex alignItems="center" my={2} width="100%">
          <Input
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            size="sm"
          />
          <Button
            onClick={() => handleChangePassword()}
            colorScheme="blue"
            ml={2}
            size="sm"
            width="200px"
          >
            Change password
          </Button>
        </Flex>
        <Button
          onClick={() => leaveFromGroup()}
          colorScheme="yellow"
          my={2}
          size="sm"
        >
          Leave
        </Button>
      </Flex>
      </Center>
      <Text fontStyle={'bold'} fontSize={'lg'} mt={2}>
        Group Members
      </Text>
      <Stack overflow="auto">
        {users.map((item: any, index: any) => (
          <Box
            key={index}
            _hover={{
              backgroundColor: "gray.700",
            }}
            borderRadius={4}
          >
            <Divider my={2} />
            <Flex
              direction="row"
              alignItems="center"
              overflow={'scroll'}
              css={{
                '&::-webkit-scrollbar': {
                  width: '1px',
                  height: '5px',
                },
                '&::-webkit-scrollbar-track': {
                  width: '1px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'gray',
                  border: '1px solid transparent',
                },
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
              }}
            >
              <Avatar
                size="md"
                src={item.avatar}
                onClick={() => {
                  router.push(`/profile/${item.username}`);
                }}
              />
              <Divider orientation="vertical" h={6} mx={4} />
              <Text fontWeight="bold">{item.username}</Text>
              <Spacer />
              <Flex alignItems="center">
                <Tooltip
                  label="Mute duration in seconds"
                  aria-label="A tooltip"
                >
                  <Input
                    type="number"
                    onChange={handleMuteDurationChange}
                    value={muteDuration}
                    min={0}
                    mr={2}
                    w="90px"
                    h="33px"
                  />
                </Tooltip>
                <Button
                  variant={'outline'}
                  mx={2}
                  onClick={() => muteUser(item.username)}
                >
                  Mute User
                </Button>
                <Menu>
                  <MenuButton px={4} py={2} as={Button} colorScheme="teal">
                    Manage
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      mr={2}
                      onClick={() => deleteFromGroup(item.username)}
                    >
                      Kick
                    </MenuItem>
                    <MenuItem mr={2} onClick={() => setAdmin(item.username)}>
                      Set Admin
                    </MenuItem>
                    <MenuItem mr={2} onClick={() => banUser(item.username)}>
                      Ban User
                    </MenuItem>
                    {/* <Button
                colorScheme="yellow"
                ml={2}
                onClick={() => leaveGroup(item.username)}
              >
                Leave
              </Button> */}
                  </MenuList>
                </Menu>
              </Flex>
            </Flex>
          </Box>
        ))}
      </Stack>
    </>
  );
}
