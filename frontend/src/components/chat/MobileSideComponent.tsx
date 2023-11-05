import React from 'react';
import {
  Button,
  Flex,
  Stack,
  Text,
  Divider,
  useDisclosure,
  IconButton,
} from '@chakra-ui/react';
import ChatList from './ChatList';
import GroupList from './GroupList';
import chatContext from '@/context/chatContext';
import SearchRecipient from './Search';
import CreateGroupModal from './GroupCreate';
import { IoArrowForward } from 'react-icons/io5';

const MobileSideComponent = (props: any) => {
  const [show, setShow] = React.useState<boolean>(false);
  const { showMob, setShowMob, setIsGroupChat, convo, setConvo } =
    React.useContext(chatContext);
  const { isOpen, onClose, onOpen } = useDisclosure();

  const { user, groups, socket } = props;
  const showSearchBar = () => setShow(!show);

  const showSideBarMobile = () => {
    setShowMob(!showMob);
  };

  return (
    <Flex w={'100%'} h={'80vh'} flexDirection={'row'} borderRadius={4} p={2}>
      <Flex
        w={'100%'}
        h={'100%'}
        flexDirection={'column'}
        borderRadius={4}
        overflowY="scroll"
        p={2}
        css={{
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        <IconButton
          aria-label="Go to chat"
          icon={<IoArrowForward />}
          onClick={showSideBarMobile}
          alignSelf={'flex-end'}
          m={2}
        />
        <Flex
          flexDirection="column"
          transitionDuration="200ms"
          flex="1"
          h={'md'}
          overflowY="scroll"
          css={{
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          <Flex flexDirection={'column'} p={4}>
            {show && (
              <SearchRecipient showSearchBar={showSearchBar} isSmall={true} />
            )}
            {show === false && (
              <Button onClick={showSearchBar}>New chat</Button>
            )}
          </Flex>
          <Stack spacing={0} p={4}>
            <ChatList items={user.messages} isSmall={true} />
          </Stack>
        </Flex>
        <Divider my={4} />
        <Flex
          flexDirection="column"
          bg={"gray.800"}
          transitionDuration="200ms"
          flex="1"
          h={'md'}
          overflowY="scroll"
          css={{
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          <Flex alignItems={'center'} justifyContent={'center'}>
            <Button
              colorScheme="messenger"
              w={'80%'}
              variant={'outline'}
              onClick={onOpen}
            >
              New Group
            </Button>
            <CreateGroupModal
              isOpen={isOpen}
              onClose={onClose}
              socket={socket}
            />
          </Flex>
          <Stack spacing={0} p={4}>
            <GroupList
              items={groups}
              setIsGroup={setIsGroupChat}
              isSmall={true}
            />
          </Stack>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default MobileSideComponent;
