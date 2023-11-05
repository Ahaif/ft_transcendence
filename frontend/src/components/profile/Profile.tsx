import {
  Box,
  useDisclosure,
  Flex,
  Grid,
  Avatar,
  VStack,
  Text,
  Image,
  Icon,
  Stack,
  Divider,
  Spacer,
  Button,
  Tooltip,
  Progress,
} from '@chakra-ui/react';
import '@fontsource/kumbh-sans/400.css';
import '@fontsource/kumbh-sans/700.css';
import useSWR from 'swr';
import userService, { baseUrl } from '../../service/userService';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { AddIcon, CloseIcon, ChatIcon, EditIcon } from '@chakra-ui/icons';
import { NextRouter, useRouter } from 'next/router';
import FriendsModal from './FriendsManage';
import { useToast } from '@chakra-ui/react';

const veryDarkDesaturatedBlue = 'hsl(229, 23%, 23%)';
const darkGray = 'hsl(0, 0%, 59%)';

interface StatProps {
  number: string;
  text: string;
}


const Losses = (props: any) => {
    const lost = props.losses;

    return (
        <Stack >
            {lost.map((item: any, index: any) => (
                <>
                    <Box key={index} p={2} borderRadius={4}>
                        <Flex direction="row" alignItems="center">
                            <Divider orientation="vertical" h={6} mx={2} />
                            <Text mr={2}>{item.winner}</Text>
                            <Spacer />
                            <Text mr={2}>{item.score}</Text>
                            <Spacer />
                            <Text mr={2}>{item.loser}</Text>
                        </Flex>
                    </Box>
                    <Divider orientation="horizontal" />
                </>
            ))}
        </Stack>
    );
}

const Wins = (props: any) => {
    const wins = props.wins;

    return (
        <Stack >
            {wins.map((item: any, index: any) => (
                <>
                    <Box key={index} p={2} borderRadius={4}>
                        <Flex direction="row" alignItems="center">
                            <Divider orientation="vertical" h={6} mx={2} />
                            <Text mr={2}>{item.winner}</Text>
                            <Spacer />
                            <Text mr={2}>{item.score}</Text>
                            <Spacer />
                            <Text mr={2}>{item.loser}</Text>
                        </Flex>
                    </Box>
                    <Divider orientation="horizontal" />
                </>
            ))}
        </Stack>
    );
}

function Stat({ number, text }: StatProps) {
  return (
    <VStack spacing="0.5" justifyContent="center">
      <Box
        fontWeight="700"
        fontSize="lg"
        lineHeight="none"
        color={"white"}
      >
        {number}
      </Box>
      <Box color={darkGray} fontSize="xs" fontWeight="400">
        {text}
      </Box>
    </VStack>
  );
}

const Friends = ({items}: any) => {

    const router = useRouter();
    const handleClick = (username: string) => {
        router.push(`/profile/${username}`);
    }

    return (
        <Stack overflow={'auto'}>
              {items.map((item: any, index: any) => (
                <>
                  <Box
                    key={index}
                    _hover={{
                      backgroundColor: 'gray.700',
                      cursor: 'pointer',
                    }}
                    borderRadius={4}
                    onClick={() => {handleClick(item.intraName)}}
                  >
                    <Flex direction="row" p={2} alignItems="center">
                      <Avatar size="sm" src={item.avatar} />
                      <Divider orientation="vertical" h={6} mx={2} />
                      <Text mr={2}>{item.intraName}</Text>
                      <Spacer />
                    </Flex>
                  </Box>
                  <Divider orientation="horizontal" />
                </>
              ))}
            </Stack>
    );
};

const ProfileCard = (props: any) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  let colorScheme: string = '';
  const {games} = props;
  switch (props.coalition) {
    case 'Pandora':
      colorScheme = 'pink';
      break;
    case 'Bios':
      colorScheme = 'cyan';
      break;
    case 'Freax':
      colorScheme = 'yellow';
      break;
    case 'Commodore':
      colorScheme = 'green';
      break;
    default:
      colorScheme = 'blue';
      break;
  }

  const router = useRouter();
    const {data} = props;

    const addFriend = () => {
        userService.addFriend(props.intraName).then((data) => {
          if (data.status === 204)
            toast({
              title: 'Error',
              description: 'user not found',
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
          else {
            toast({
              title: 'Friend Added',
              description: 'Friend is add to friendlists',
              status: 'success',
              duration: 3000,
              isClosable: true,
            });
            setTimeout(() => router.reload(), 100);
          }
        })
      }


    const cancelRequest = () => {
        userService.cancelRequest(props.intraName);
        setTimeout(() => router.reload(), 500);
    }

    const removeFriend = async () => {
      try{
        await userService.removeFriend(props.username);
        toast({
          title: 'Friend removed',
          description: 'Friend is removed from friendlists',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setTimeout(() => router.reload(), 500);
      }catch(error){
        toast({
          title: 'Error',
          description: 'you can not Remove a what does not exist',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });

      }

    }

    const blockUser = () => {
      try{
        userService.blockUser(props.intraName);
        window.location.reload();
        toast({
          title: 'Friend Blocked',
          description: 'Blocked',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

      }catch(error){
        toast({
          title: 'Error',
          description: 'Error while blocking',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });

      }

    }

    const unblockUser = () => {
      try{
        userService.unblockUser(props.intraName);
        window.location.reload();
        toast({
          title: 'Friend Unblocked',
          description: 'Unblocked',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

      }catch(error){
        toast({
          title: 'Error',
          description: 'Error while unblocking',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });

      }

    }

    const handleNewMessage = () => {
      router.push(`/chat?username=${props.username}`);
    }

    const WL = games.wins / (games.losses ? games.losses : 1);

  return (
    <>
      <Flex alignItems={'center'} justifyContent={'center'}>
        <Grid
          bgColor={"gray.800"}
          w={{ base: '100%', md: '80%', lg: '60%' }}
          overflow="hidden"
          borderRadius="xl"
          gridTemplateColumns="100%"
          gridTemplateRows="90px 50px 50px 95px auto"
          color={veryDarkDesaturatedBlue}
        >
          <Box
            bgImage={`url(${props.clCoverUrl})`}
            bgSize="cover"
            gridRow="1/4"
            gridColumn="1/-1"
          />
          <Grid
            justifyContent="center"
            gridRow="2/4"
            gridColumn="1/-1"
            pos="relative"
            zIndex="1"
          >
            <Avatar src={props.avatar} size="2xl" />
          </Grid>
          <Grid
            placeItems="center"
            gridRow="4/5"
            gridColumn="1/-1"
            fontWeight="700"
            textAlign="center"
          >
            <Box
              fontSize="lg"
              color={"white"}
              mt="6"
              flexDirection={'column'}
            >
              <Flex flexDirection={'row'} alignItems={'center'}>
                {props.username}{' '}
                <Tooltip
                  label={props.coalition}
                  aria-label="A tooltip"
                  bg={props.clColor}
                >
                  <Image
                    src={props.clImageUrl}
                    h="25px"
                    filter={"brightness(0) invert(1)"}
                  />
                </Tooltip>
                  <Text fontSize="sm" fontWeight="400"> {props.status} </Text>
              </Flex>
              <Flex
                color={"gray.300"}
                fontSize="sm"
                fontWeight="400"
              >

              </Flex>
            </Box>
          </Grid>
          <Flex justifyContent="space-around" borderTop="1px solid #ccc" p="6">
            <Stat text="Matches Won" number={games.wins} />
            <Stat text="Matches Lost" number={games.losses} />

          </Flex>
        </Grid>
      </Flex>

      <Flex
        justifyContent="center"
        mt="2"
        flexDirection={{ base: 'column', md: 'row' }}
        height={'sm'}
      >
        <Box
          w={{
            base: '100%',
            md: '50%',
            lg: '30%',
          }}
          bgColor={"gray.800"}
          borderRadius="xl"
          p="6"
          mr={{ base: '0', md: '2' }}
          mb={{ base: '2', md: '0' }}
          flexDirection={'row'}
          h={'100%'}
        >
          {props.self === false ? (
            <Text fontSize="lg" fontWeight="700" mb="4">
              Social
            </Text>
          ) : (
            <Text fontSize="lg" fontWeight="700" mb="4">
              Management
            </Text>
          )}

          {props.self === false ? (
            <>
              <Text fontSize="sm" fontWeight="400" color={darkGray}>
                {props.username} is a {props.coalition} player.
              </Text>
              <Flex justifyContent={'space-around'} w={'100%'}>
                {(props.friend === false || props.status === "pending")  ? (
                    <Button
                        colorScheme={colorScheme}
                        mt="4"
                        w="49%"
                        leftIcon={<AddIcon />}
                        onClick={props.status === "pending" ? cancelRequest : addFriend}
                    >
                        {props.status === "pending" ? "Cancel Request" : "Add Friend"}
                    </Button>

                ) : (
                    <Button
                        colorScheme={'red'}
                        mt="4"
                        w="49%"
                        leftIcon={<AddIcon />}
                        onClick={removeFriend}
                    >
                        Remove Friend
                    </Button>
                )}
                {(props.blocked === false || !props.blocked) ? (
                    <Button
                    colorScheme={'red'}
                    mt="4"
                    w="49%"
                    leftIcon={<CloseIcon />}
                    onClick={blockUser}
                    >
                    Block
                    </Button>
                ) : (
                    <Button
                        colorScheme={'green'}
                        mt="4"
                        w="49%"
                        onClick={unblockUser}
                    >
                        Unblock
                    </Button>
                )}
              </Flex>

              <Button
                colorScheme={colorScheme}
                my="4"
                w="100%"
                leftIcon={<ChatIcon />}
                onClick={handleNewMessage}
              >
                Message
              </Button>
                <Text fontSize="lg" fontWeight="700" mb="4">
                    Friends
                </Text>
                <Flex flexDirection={'column'} w={'100%'} overflow={'auto'} h={'30%'} borderRadius={4}>
                    <Friends items={data.data} />
                </Flex>

            </>
          ) : (
            <>
              <Text fontSize="sm" fontWeight="400" color={darkGray}>
                You are a {props.coalition} player.
              </Text>
              <Button
                colorScheme={colorScheme}
                my="2"
                w="100%"
                leftIcon={<EditIcon />}
                onClick={() => {
                  router.push('/account/settings');
                }}
              >
                Edit Profile
              </Button>
              <Button
                colorScheme={colorScheme}
                my="2"
                w="100%"
                onClick={onOpen}
              >
                Manage Friends
              </Button>
              <FriendsModal
                isOpen={isOpen}
                onClose={onClose}
                onOpen={onOpen}
                colorScheme={colorScheme}
                username={props.username}
                data={data.data}
              />
            </>
          )}
        </Box>
        <Box
          w={{ base: '100%', md: '30%' }}
          bgColor={"gray.800"}
          borderRadius="xl"
          p="6"
        >
          <Text fontSize="lg" fontWeight="700" mb="4">
            Past Matches
          </Text>
          <Tabs variant={'enclosed'}>
            <TabList>
              <Tab
                _hover={{
                  color: props.clColor,
                }}
              >
                Wins
              </Tab>
              <Tab
                _hover={{
                  color: props.clColor,
                }}
              >
                Losses
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    mb="4"
                    flexDirection={'column'}
                    overflowY={'scroll'}
                    h={'17vh'}
                    css={{
                        '&::-webkit-scrollbar': {
                          width: '4px',
                        },
                        '&::-webkit-scrollbar-track': {
                          width: '4px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                          backgroundColor: 'blue',
                          borderRadius: '24px',
                          border: '4px solid transparent',
                        },
                        msOverflowStyle: 'none',
                        scrollbarWidth: 'none',
                      }}
                >
                  <Text fontSize="sm" fontWeight="400" color={darkGray}>
                    Your last matches
                  </Text>
                  <Wins wins={games.games}  />
                </Flex>
              </TabPanel>
              <TabPanel>
                <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    mb="4"
                    flexDirection={'column'}
                    overflowY={'scroll'}
                    h={'17vh'}
                    css={{
                        '&::-webkit-scrollbar': {
                          width: '4px',
                        },
                        '&::-webkit-scrollbar-track': {
                          width: '4px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                          backgroundColor: 'blue',
                          borderRadius: '24px',
                          border: '4px solid transparent',
                        },
                        msOverflowStyle: 'none',
                        scrollbarWidth: 'none',
                      }}
                >
                  <Text fontSize="sm" fontWeight="400" color={darkGray}>
                    Your last matches
                  </Text>
                  <Losses losses={games.opponentGames} />
                </Flex>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Flex>
    </>
  );
};

const ProfileCardComponent = (props: any) => {
    const { data, error, isLoading } = useSWR(`${baseUrl}/api/public/friends/${props.username}`, () => userService.getFriends(props.username));
    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error</div>;
    }
    if (!data) {
        return <div>Not found</div>;
    }
    return <ProfileCard {...props} data={data} />;
}

export default ProfileCardComponent;
