import {
    Modal,
    ModalBody,
    Button,
    Input,
    useDisclosure,
    useToast,
    ModalContent,
    ModalCloseButton,
    ModalHeader,
    ModalOverlay,
    Flex,
    Tooltip,
    Checkbox, // Import Checkbox component
  } from '@chakra-ui/react';
  import React from 'react';
import { useRouter } from 'next/router';

  export default function CreateGroupModal(props: any) {
    const { socket } = props;
    const [room, setRoom] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const [isPrivate, setisPrivate] = React.useState<boolean>(false); // State for checkbox
    const { isOpen, onClose, onOpen } = props;
    const toast = useToast();
    const router = useRouter();

    const createRoom = () => {
      if (room) {
        socket.emit('createRoom', { roomName: room, password: password, isPrivate: isPrivate }); // Pass isPrivate to the server

        onClose();
      } else {
        toast({
          title: 'Error',
          description: 'Room name is required',
          status: 'error',
          duration: 2000,
          position: 'top',
        });
      }
    };

    const joinRoom = () => {
      if (room) {
        socket.emit('joinRoom', { roomName: room, password: password });
        setTimeout(() => router.reload(), 500);
        onClose();
      } else {
        toast({
          title: 'Error',
          description: 'Room name is required',
          status: 'error',
          duration: 2000,
          position: 'top',
        });
      }
    };

    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Group</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDirection={'column'}>
              <Input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="room name" mb={2} />
              <Tooltip label="Optional password for the group" aria-label="A tooltip">
                <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" mb={2} />
              </Tooltip>
              <Flex alignItems="center" mb={2}>
                <Checkbox
                  isChecked={isPrivate}
                  onChange={(e) => setisPrivate(e.target.checked)}
                  size="md"
                  colorScheme="teal"
                  mr={2}
                >
                  Private
                </Checkbox>
              </Flex>
              <Flex flexDir={'column'}>
                <Button onClick={createRoom} m={1}>
                  Create Room
                </Button>
                <Button onClick={joinRoom} m={1} colorScheme={'facebook'}>
                  Join Room
                </Button>
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }
