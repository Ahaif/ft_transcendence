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
  IconButton,
  Flex,
  Spacer,
} from '@chakra-ui/react';
import { FiCheck, FiX } from 'react-icons/fi';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import { useRouter } from 'next/router';
import userService from '@/service/userService';

export const baseUrl = process.env.BACKEND_URL || 'http://localhost:3000';

export function authHeader() {
  const token = new Cookies().get('token');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

export default function FriendRequests({ user }: any) {
  const toast = useToast();
  const router = useRouter();
  const accept = async (username: string) => {
    userService
      .acceptFriend(username)
      .then(() => {
        toast({
          title: 'Friend accepted',
          description: 'You have accepted the friend request.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setTimeout(() => router.reload(), 500);
      })
      .catch((error) => {
        toast({
          title: 'Error',
          description: 'An error occurred while accepting the friend request.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const reject = async (username: string) => {
    userService
      .rejectFriend(username)
      .then(() => {
        toast({
          title: 'Friend accepted',
          description: 'You have accepted the friend request.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setTimeout(() => router.reload(), 100);
      })
      .catch((error) => {
        toast({
          title: 'Error',
          description: 'An error occurred while accepting the friend request.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  };
  return user.length > 0 ? (
    <Stack overflow={'auto'}>
      {user.map((item: any, index: any) => (
        <>
          <Box
            key={index}
            _hover={{
              backgroundColor: 'gray.700',
              cursor: 'pointer',
            }}
            borderRadius={4}
          >
            <Flex direction="row" p={1} alignItems="center">
              <Text mx={2}>{item.userId}</Text>
              <Spacer />
              <IconButton
                colorScheme="green"
                variant="solid"
                icon={<FiCheck />}
                size="sm"
                onClick={() => {
                  accept(item.userId);
                }}
                aria-label="Accept"
              />
              <IconButton
                colorScheme="red"
                variant="solid"
                size="sm"
                onClick={() => {
                  reject(item.userId);
                }}
                icon={<FiX />}
                mx={1}
                aria-label="Reject"
              />
            </Flex>
          </Box>
        </>
      ))}
    </Stack>
  ) : (
    <Box p={2} alignItems={'center'}>
      <Text fontSize={'xs'} fontStyle={'italic'} fontWeight={'light'}>
        No Incoming friend requests.
      </Text>
    </Box>
  );
}
