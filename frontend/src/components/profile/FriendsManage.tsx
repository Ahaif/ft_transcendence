import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
  Stack,
  Divider,
  Text,
  Avatar,
  Button,
  Flex,
  Spacer,
} from '@chakra-ui/react';
import { useState } from 'react';
import useSWR  from 'swr';
import userService from '@/service/userService';
import { baseUrl } from '@/service/userService';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';

export default function FriendsModal(props: any) {

  const toast = useToast();
  const router = useRouter();
  const handleFriendRemove = (username: string) => {
    try{
      userService.removeFriend(username);
      toast({
        title: 'Friend removed',
        description: 'Friend is removed from friendlists',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      router.reload();
    }catch(error)
    {
      toast({
        title: 'Error',
        description: 'you can not Remove a what does not exist',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };


  const user = props.data;

  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Manage Friends</ModalHeader>
          <ModalCloseButton />
          <ModalBody >
            <Stack overflow={'auto'}>
              {user.map((item: any, index: any) => (
                <>
                  <Box
                    key={index}
                    _hover={{
                      backgroundColor: "gray.700",
                      cursor: 'pointer',
                    }}
                    borderRadius={4}
                  >
                    <Flex direction="row" p={2} alignItems="center">
                      <Avatar size="sm" src={item.avatar} />
                      <Divider orientation="vertical" h={6} mx={2} />
                      <Text mr={2}>{item.intraName}</Text>
                      <Spacer />
                      <Button
                        colorScheme="red"
                        variant="solid"
                        size="sm"
                        onClick={() => {
                          handleFriendRemove(item.intraName);
                        }}
                      >
                        Remove
                      </Button>
                    </Flex>
                  </Box>
                  <Divider orientation="horizontal" />
                </>
              ))}
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme={props.colorScheme}
              onClick={props.onClose}
              variant={'outline'}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
