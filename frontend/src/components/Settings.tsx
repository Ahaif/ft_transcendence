import {
  Stack,
  Button,
  Center,
  Text,
  Box,
  Flex,
  useDisclosure,
  Input,
  Avatar,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  useToast,
} from "@chakra-ui/react";
import { useState, useRef } from "react";
import userService, { baseUrl } from "../service/userService";
import  useSWR  from "swr";
import EnableOtp from "./enableOtp";
import AlertDelete from "./DeleteAccount";
import { useRouter } from "next/router";



export default function Settings() {
  const {data, error, isLoading} = useSWR(`${baseUrl}/api/me`, () => userService.getUserInfo());
  if (!data) {
    return (
      <h1> afafs</h1>
    );
  }
  const dat = data.data;
  const avatarFile = useRef<HTMLInputElement>(null);
  const history = useRouter();
  const [user, setUser] = useState<string>(dat.username);
  const [TwoFactor, setTwoFactor] = useState<boolean>(dat.otpEnabled);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  var [form, setForm] = useState<FormData>(new FormData());
  const [changed, setChanged] = useState<boolean>(false);
  const toast = useToast();
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSwitchChange = () => {
    setTwoFactor(TwoFactor === false ? true : false);
    if (TwoFactor === true) {
      setIsModalOpen(true);
    }
  };

  const DisableTwoFactor = () => {
    userService
      .disableOTP()
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
    history.reload();
  };

  const UpdateUserInfo = () => {
    if (user.length > 15 || user.length < 3) {
        toast({
            title: "Username must be between 3 and 15 characters.",
            status: "error",
            duration: 5000,
            isClosable: true,
            });
            return;
        }
    let tmpForm: FormData = new FormData();
    if (
      user !== "" &&
      user !== dat.username &&
      user !== undefined &&
      user !== null
    )
      tmpForm.append("username", user);
    else tmpForm.append("username", dat.username);
    let avatar: Blob | null = form.get("avatar") as Blob;
    if (avatar !== null) tmpForm.append("avatar", avatar);
    userService
      .updateUserInfo(tmpForm)
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
    history.reload();
  };

  const handleAvatarChange = () => {
    if (avatarFile.current) {
      avatarFile.current.click();
    }
  };

  const handleAvatarUpload = (e: any) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("avatar", file);
    setForm(formData);
    setChanged(true);
  };
  return (
   <>
            <Box
                w="100%"
                bgColor={"gray.800"}
                borderRadius="lg"
                p={4}
            >
                <Text fontSize="xl" fontWeight="bold"> Settings </Text>
                <Divider my={3} />
              <Center>
                <Avatar
                  src={
                    changed
                      ? URL.createObjectURL(form.get("avatar") as Blob)
                      : dat.avatar
                  }
                  ref={avatarFile}
                  size={"lg"}
                  onClick={handleAvatarChange}
                  _hover={{
                    cursor: "pointer",
                    boxShadow: "0 0 0 1px #3182ce",
                    borderColor: "blue.500",
                    transform: "scale(1.2)",
                  }}
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={avatarFile}
                  style={{ display: "none" }}
                  onChange={handleAvatarUpload}
                />
              </Center>
              <Divider my={3} />
              <Text>Username</Text>
              <Input
                defaultValue={dat.username}
                placeholder="Your username"
                mt={3}
                onChange={(e) => {
                  setUser(e.target.value);
                }}
                _hover={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px #3182ce",
                }}
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px #3182ce",
                }}
              />
              <Stack direction="row" spacing={4} mt={3} justifyContent={'center'} >
                  {dat.otpEnabled === false ? (
                    <Button
                      colorScheme="green"
                      variant={"outline"}
                      onClick={() => setIsModalOpen(true)}
                    >
                      Enable Two Factor Authentication
                    </Button>

                  ) : (
                  <Button
                    colorScheme="red"
                    variant={"outline"}
                    onClick={DisableTwoFactor}
                  >
                    Disable Two Factor Authentication
                  </Button>
                  )}
              </Stack>
              <Divider my={3} />
              <Flex
                direction={{ base: "row", md: "column" }}
                mt={3}
                justifyContent="space-between"
                alignItems={{ base: "flex-start", md: "center" }}
                >
              <Button
                colorScheme={"teal"}
                mb={3}
                onClick={UpdateUserInfo}
                w={{ base: "70%", md: "50%" }}
              >
                Submit
              </Button>
              <Button
                type="submit"
                colorScheme={"red"}
                onClick={onOpen}
                w={{ base: "70%", md: "50%" }}
              >
                Delete my account
              </Button>
              </Flex>
              <AlertDelete onOpen={onOpen} onClose={onClose} isOpen={isOpen} />
    <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
        <ModalCloseButton />
        <EnableOtp />
        </ModalContent>
    </Modal>
    </Box>
    </>
  );
}
