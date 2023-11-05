import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalHeader,
  ModalFooter,
  ModalProps,
  Box,
  Flex,
  Divider,
  Center,
  Avatar,
  Input,
  Text,
  Button,
  useToast,
} from '@chakra-ui/react';
import { useDisclosure, UseDisclosureProps } from '@chakra-ui/hooks';
import { useSnapshot } from 'valtio';
import {
  userStore,
  setExistingUser,
  setUsernameAvatar,
} from '@/store/userStore';
import { useState, useRef } from 'react';
import userService, { baseUrl } from '@/service/userService';
import useSWR from 'swr';
import { useRouter } from 'next/router';

export default function Register() {
  const userdata = useSnapshot(userStore);
  const avatarFile = useRef<HTMLInputElement>(null);
  const history = useRouter();
  const [user, setUser] = useState<string>('');
  const [changed, setChanged] = useState<boolean>(false);
  var [form, setForm] = useState<FormData>(new FormData());
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  React.useEffect(() => {
    if (userdata.isExstingUser === false) {
      onOpen();
    } else {
      onClose();
    }
  }, [userdata, onOpen, onClose]);

  const UpdateUserInfo = () => {
    if (user.length > 15 || user.length < 3) {
      toast({
        title: 'Username must be between 3 and 15 characters.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    let tmpForm: FormData = new FormData();
    if (
      user !== '' &&
      user !== userdata.username &&
      user !== undefined &&
      user !== null
    )
      tmpForm.append('username', user);
    else tmpForm.append('username', userdata.username);
    let avatar: Blob | null = form.get('avatar') as Blob;
    if (avatar !== null) tmpForm.append('avatar', avatar);
    userService
      .updateUserInfo(tmpForm)
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
    setExistingUser(true);
    history.push('/home');
  };

  const handleAvatarChange = () => {
    if (avatarFile.current) {
      avatarFile.current.click();
    }
  };

  const handleAvatarUpload = (e: any) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('avatar', file);
    setForm(formData);
    setChanged(true);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Register</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box w="100%" borderRadius="lg" p={4}>
            <Center>
              <Avatar
                src={
                  changed
                    ? URL.createObjectURL(form.get('avatar') as Blob)
                    : userdata.avatar
                }
                size={'lg'}
                _hover={{
                  boxShadow: '0 0 0 1px #3182ce',
                  borderColor: 'blue.500',
                  transform: 'scale(1.2)',
                  cursor: 'pointer',
                }}
                onClick={handleAvatarChange}
                ref={avatarFile}
              />
              <Input
                type="file"
                accept="image/*"
                ref={avatarFile}
                style={{ display: 'none' }}
                onChange={handleAvatarUpload}
              />
            </Center>
            <Divider my={3} />
            <Text fontSize="lg" fontWeight="bold" mb={1}>
              Username
            </Text>
            <Input
              placeholder="Your custom username"
              onChange={(e) => setUser(e.target.value)}
            />
            <Center>
              <Button
                colorScheme={'teal'}
                my={2}
                w={'70%'}
                variant={'outline'}
                onClick={UpdateUserInfo}
              >
                Submit
              </Button>
            </Center>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
