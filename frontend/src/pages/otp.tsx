import { useToast, Stack, Heading, Flex, PinInput, PinInputField, FormControl, Input, Divider, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState,  } from "react";
import userService from "../service/userService";
import { Cookies, useCookies } from 'react-cookie';

export default function TwoFactor() {
    const [code, setCode] = useState<string>("");
    const toast = useToast();
    const history = useRouter();
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const handleSubmit = () => {
        if (code.length !== 6) {
            toast({
                title: 'Please complete your two factor authentication code.',
                status: 'error',
                isClosable: true,
            });
        }
        else {
            userService.sendOTP(code).then((response) => {
                if (response.status === 200) {
                   removeCookie("token");
                   setCookie("token", response.data.access_token, { path: '/' });
                   history.push("/home");
                }
            }).catch((error) => {
                toast({
                    title: 'Invalid code !',
                    status: 'error',
                    isClosable: true,
                });
            });
        }
    }

    return (
        <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={"gray.800"}>
            <Stack
                spacing={4}
                w={'half'}
                maxW={'md'}
                bg={"gray.700"}
                rounded={'xl'}
                boxShadow={'lg'}
                p={6}
                flexDirection={'column'}
                my={12}
            >
                <Heading textAlign={'center'} fontSize={'4xl'}>OTP</Heading>

                <Stack spacing={6} direction={['column', 'row']}>
                    <FormControl id="otp">
                        <PinInput
                            type='number'
                            onChange={(value) => setCode(value)}
                            value={code}
                            autoFocus={true}
                            mask
                        >
                            <PinInputField required/>
                            <PinInputField ml={2}/>
                            <PinInputField ml={2}/>
                            <PinInputField ml={2}/>
                            <PinInputField ml={2}/>
                            <PinInputField ml={2}/>
                        </PinInput>
                    </FormControl>
                </Stack>
                <Button
                    type="submit"
                    bg={'blue.400'}
                    color={'white'}
                    _hover={{
                        bg: 'blue.700',
                    }}
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
          </Stack>

        </Flex>
    );

}
