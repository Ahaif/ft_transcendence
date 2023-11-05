import DashboardPage from '@/components/Dashboard';
import Pong from '@/components/home/Pong';
import { color, motion } from 'framer-motion';
import {
  Heading,
  Box,
  Flex,
  Text,
  Center,
  chakra,
  Container,
  Link,
  Stack,
  VisuallyHidden,
} from '@chakra-ui/react';

import ReactApexChart from 'react-apexcharts';
import { useState } from 'react';
import { useEffect } from 'react';
import userService from '@/service/userService';
import LoginPage from '@/components/Login';


export function SmallCentered() {
  return (
    <Flex
      px={{ base: 4, md: 4 }}
      height="5vh"
      alignItems="center"
      bg={"#000"}
      borderBottomWidth="1px"
      borderBottomColor={"gray.700"}
      justifyContent={{ base: 'space-between' }}
    >
      <Text
        sx={{
          fontSize: ['1xl', '2xl', '3xl'],
          fontWeight: 'bold',
          color: 'grey.500',
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.25)',
          textAlign: 'center',
          letterSpacing: 'tight',
          lineHeight: 'shorter',
        }}
      >
        P0NG
      </Text>
    </Flex>
  );
}

export default function HomePage() {
  const [signedIn, setSigned] = useState<boolean>(false);

  const line1: string =
    'Our revolutionary multiplayer pong game is not just a mere pastime;\
                        it is a way of life. This game transcends the boundaries of\
                        traditional gaming, challenging you to master the art of skill,\
                        strategy, and timing.';
  return (
    <>
      <SmallCentered />
      <Flex
        justifyContent={'space-around'}
        alignItems={'center'}
        w={'90%'}
        direction={{ base: 'column', md: 'row' }}
        minH={'87vh'}
        mx="auto"
        px={{ base: '6', md: '8' }}
        py={{ base: '16', md: '20' }}
        rounded="lg"
        zIndex="1"
      >
        <Box w={{ base: '100%', md: '45%' }} h={'50%'}>
          <Heading
            as="h2"
            size="2xl"
            fontWeight="extrabold"
            letterSpacing="tight"
            mb="4"
            sx={{
              fontSize: ['3xl', '4xl', '5xl'],
              fontWeight: 'bold',
              color: 'teal.900',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.25)',
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: 'tight',
              lineHeight: 'shorter',
            }}
          >
            Welcome to ft_transcendance
          </Heading>
          <motion.h1

            style={{
              fontSize: '1.3rem',

              fontSmooth: 'always',
              fontFamily:
                'SF Mono, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',
            }}

            variants={{
              hidden: { opacity: 1 },
              visible: {
                opacity: 1,
                transition: {
                  delay: 0.1,
                  staggerChildren: 0.009,
                },
              },
            }}
            initial={'hidden'}
            animate={'visible'}
          >
            {line1.split('').map((char, index) => {
              return (
                <motion.span
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 50 },
                    visible: {
                      opacity: 1,
                      y: 0,
                    },
                  }}
                >
                  {char}
                </motion.span>
              );
            })}
          </motion.h1>
          <Center>
            <LoginPage p={4} />
          </Center>
        </Box>

        <Box
          alignItems="center"
          display="space-between"
          justifyContent="center"
          w={{ base: '100%', md: '70%', lg: '50%' }}
          h={{ base: '30vh', md: '40vh', lg: '20vh' }}
        >
          <Pong />
        </Box>
      </Flex>
      <Container
        as={Stack}
        maxW={'6xl'}
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={'center'}
        align={'center'}
      >
        <Text>© 2023 ft_transcendance. All rights reserved</Text>
      </Container>
    </>
  );
}
