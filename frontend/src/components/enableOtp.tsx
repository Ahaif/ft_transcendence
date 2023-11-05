import {
  PinInputField,
  Flex,
  Box,
  Image,
  Heading,
  Center,
  Divider,
  Input,
  PinInput,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import userService from "../service/userService";


export default function EnableOtp() {
  const [code, setCode] = useState<string>("");
  const [otp, setOTP] = useState<string>("");
  const toast = useToast();

  const handleSubmit = () => {
    userService
      .enableOTP(code)
      .then((response) => {
        if (response.status === 200) {
          window.location.reload();
        }
      })
      .catch((error) => {
        toast({
          title: "Invalid code !",
          status: "error",
          isClosable: true,
        });
      });
  };

  useEffect(() => {
    userService.generateOTP().then((response) => {
      setOTP(response.data.otpUrl);
    });
  }, []);

  return (
    <Flex
      w={"full"}
      h={"full"}
      maxH={"100vh"}
      maxW={"md"}
      bg={"gray.700"}
      rounded={"xl"}
      boxShadow={"lg"}
      p={6}
      flexDirection={"column"}
    >
      <Center>
        <Heading textAlign={"center"} fontSize={"4xl"}>
          Setup 2FA
        </Heading>
      </Center>
      <Divider mt={2} mb={5} />
        <Center>
        <Flex
            bg={"white"}
            p={6}
        >
        <QRCodeSVG value={otp} size={200} />
    </Flex>
    </Center>
      <Divider mt={5} mb={5} />
      <Box flexDirection={"column"}>
        <Center>
          <PinInput
            type="number"
            onChange={(value) => setCode(value)}
            autoFocus={true}
          >
            <PinInputField required />
            <PinInputField ml={2} />
            <PinInputField ml={2} />
            <PinInputField ml={2} />
            <PinInputField ml={2} />
            <PinInputField ml={2} />
          </PinInput>
        </Center>
      </Box>
      <Divider mt={5} mb={5} />
      <Button
        type="submit"
        bg={"blue.400"}
        color={"white"}
        _hover={{
          bg: "blue.700",
        }}
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </Flex>
  );
}
