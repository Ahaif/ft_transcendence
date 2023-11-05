import DashboardPage from '@/components/Dashboard';
import React from 'react';
import Card from '@/components/home/Card';
import styled from 'styled-components';
import Router, { useRouter } from 'next/router';
import Image from 'next/image';
import { Button } from '@/components/home/Card/style';
import { useColorMode } from '@chakra-ui/react';
import { Flex, Text, Stack, Avatar, Box } from '@chakra-ui/react';
import userService from '@/service/userService';
import { baseUrl } from '@/service/userService';
import useSWR from 'swr';
import Loading from '@/components/Loading';

type DivType = {
  theme: 'light' | 'dark';
};
const Div = styled.div<DivType>`
  display: flex;
  padding: 80px;
  width: 100%;
  height: 50%;
  color: ${({ theme }) => (theme == 'dark' ? '#ffff' : '#000')};
  align-items: center;
  .title {
    width: 100%;
    span {
      font-weight: bold;
      font-size: 3.2rem;
    }
    p {
      padding-top: 20px;
      padding-bottom: 20px;
    }
  }
  .player {
    width: 100%;
  }
`;
const Main = styled.div`
  width: 100%;
  color: #fff;
  > div {
    text-align: center;
    font-weight: 700;
    font-size: 1.5rem;
  }
  > .Cards {
    justify-content: center;
    gap: 40px;
    flex-wrap: wrap;
    display: flex;
    grid-template: repeat(3, 1fr) / repeat(3, 1fr);
  }
`;

export const Leaderboard = () => {
  const { data, error, isLoading } = useSWR(
    `${baseUrl}/api/user/leaderboard`,
    () => userService.getLeaderBoard()
  );

  const router = useRouter();

  if (error) {
    return <h1> error</h1>;
  }
  if (isLoading || !data) {
    return <Loading />;
  }

  const Leaderboard = data.data;

  return (
    <Flex
      flexDirection={'column'}
      alignItems={'center'}
      justifyContent={'center'}
      mb={10}
    >
      <Flex
        flexDirection={'column'}
        borderRadius={8}
        _hover={{
          border: '1px solid #FFF',
        }}
        p={8}
      >
        <Text fontSize={'4xl'} fontWeight={'bold'}>
          Leaderboard
        </Text>
        <Text fontSize={'sm'}>Top 10 Players</Text>
        <Stack spacing={4} mt={4}>
          {Leaderboard.map((user: any, index: number) => (
            <Flex
              key={index}
              alignItems={'center'}
              gap={10}
              flexDirection={'row'}
              onClick={() => {
                router.push(`/profile/${user.username}`);
              }}
              _hover={{
                cursor: 'pointer',
              }}
            >
              <Box>
                <Avatar key={index} name={user.username} src={user.avatar} />
              </Box>
              <Box>
                <Text fontSize={'xl'}>{user.wins}</Text>
              </Box>

              <Box>
                <Text fontSize={'xl'} fontWeight={''}>
                  {user.username}
                </Text>
              </Box>
            </Flex>
          ))}
        </Stack>
      </Flex>
    </Flex>
  );
};

export default function HomePage() {
  const { colorMode } = useColorMode();
  const router = useRouter();

  return (
    <DashboardPage>
      <div>
        <Div theme={colorMode}>
          <div className="title">
            <span>Win a Game</span>
            <p>
              Bringing the ping pong experience to your fingertips, Let’s start
              a game against your friend or a random people.
            </p>
            <Button
              type="submit"
              value="PLAY NOW"
              onClick={() => Router.push('/game')}
            />
          </div>
          <div className="player">
            <Image
              src="/Icons/Player.svg"
              width={500}
              height={500}
              alt="player"
            />
          </div>
        </Div>
        <Main>
          <Leaderboard />
        </Main>
      </div>
    </DashboardPage>
  );
}
