import { Button, Center, Image, Box } from "@chakra-ui/react";
import { useCallback, useEffect} from "react";
import userService from "../service/userService";
import { useRouter } from 'next/router';

const login_url = process.env.NEXT_PUBLIC_LOGIN_URL || 'http://localhost:3000/auth/42';


function LoginPage(props: any) {
    const router = useRouter();

    const handleClick = () => {
        router.replace(login_url);
    };
  return (
    <>
    <Box {...props} >

        {/* <Particles options={particlesOptions as ISourceOptions} init={particlesInit}/> */}
      <Button
        size="lg"
        boxShadow={'dark-lg'}
        colorScheme="messenger"
        onClick={handleClick}
        leftIcon={<Center><Image src="https://42.fr/wp-content/uploads/2021/05/42-Final-sigle-seul.svg" alt="42 Network Logo" boxSize="30px" /></Center>}
      >
        Login with 42
      </Button>
      </Box>
      </>
  );
}

export default LoginPage;
