/* eslint-disable */
import React, { ReactNode, useState, useContext } from 'react';
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Badge,
  ColorModeProvider,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FiMenu, FiBell, FiChevronDown } from 'react-icons/fi';

import { IconType } from 'react-icons';
import FriendRequests from './friendrequest/FriendRequests';
import GameInvite from './gameInvite';
import {
  IoHomeOutline,
  IoChatboxOutline,
  IoSettingsOutline,
  IoGameControllerOutline,
  IoSearchCircleOutline,
} from 'react-icons/io5';
import Settings from './Settings';
import ProfileCardComponent from './profile/Profile';
import { motion } from 'framer-motion';
import SearchBar from './SearchBar';
import { useCookies } from 'react-cookie';
import useSWR from 'swr';
import userService, { baseUrl } from '../service/userService';
import { Skeleton } from 'three';
import Loading from './Loading';
import { AppCtx } from '../context/socketContext';
interface LinkItemProps {
  name: string;
  icon: IconType;
}

interface SidebarState {
  selectedItem: string;
}

type SideBarProps = {
  children: ReactNode;
  avatar: string;
  UserName: string;
  otpEnabled: boolean;
  coalition: string;
};

export default function SideBar({
  children,
  avatar,
  UserName,
  otpEnabled,
  coalition,
}: SideBarProps) {
  const [sidebarState, setSidebarState] = useState<SidebarState>({
    selectedItem: '',
  });
  const selectItem = (itemName: string) => {};

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box h="100%" w="100%" bg={'#000'}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
        avatar={avatar}
        userName={UserName}
        otpEnabled={otpEnabled}
        selectItem={selectItem}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} selectItem={selectItem} />
        </DrawerContent>
      </Drawer>
      <MobileNav
        onOpen={onOpen}
        avatar={avatar}
        username={UserName}
        selectItem={selectItem}
        coalition={coalition}
      />
      <Box ml={{ md: '160px' }} h="calc(100vh - 5rem)" px={2}>
        {children}
      </Box>
    </Box>
  );
}

const SidebarContent = ({ onClose, ...rest }: any) => {
  const router = useRouter();
  const handleItemClick = (itemName: string) => {
    switch (itemName) {
      case 'Home':
        router.push('/home');
        break;
      case 'Chat':
        router.push('/chat');
        break;
      case 'Game':
        router.push('/game');
        break;
      case 'Settings':
        router.push('/account/settings');
        break;
      default:
        router.push('/404');
        break;
    }
  };

  return (
    <Box
      borderRight="1px"
      borderRightColor={'gray.700'}
      w={{ base: 'full', md: '170px' }}
      pos="fixed"
      h="full"
      display={rest.display}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          P0NG
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      <NavItem icon={IoHomeOutline} onClick={() => handleItemClick('Home')}>
        Home
      </NavItem>
      <NavItem
        icon={IoGameControllerOutline}
        onClick={() => handleItemClick('Game')}
      >
        Game
      </NavItem>
      <NavItem icon={IoChatboxOutline} onClick={() => handleItemClick('Chat')}>
        Chat
      </NavItem>
      <NavItem
        icon={IoSettingsOutline}
        onClick={() => handleItemClick('Settings')}
      >
        Settings
      </NavItem>
    </Box>
  );
};

const NavItem = ({ icon, children, ...rest }: any) => {
  return (
    <Link style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}

        {children}
      </Flex>
    </Link>
  );
};

const MobileNav = ({ coalition, onOpen, avatar, username, ...rest }: any) => {
  const { games } = useContext(AppCtx);
  const [search, setSearch] = useState<string>('');
  const [, , removeCookie] = useCookies();
  const router = useRouter();
  const handleSearch = (e: any) => {
    setSearch(e.target.value);
  };
  const { data, isLoading } = useSWR(`${baseUrl}/api/pending`, () =>
    userService.getPendingRequest()
  );

  if (isLoading) {
    return <Loading />;
  }
  if (!data) {
    return <Loading />;
  }

  const gameLength: number = games?.length ? games.length : 0;

  const notificationCount: number = data.data.length;

  return (
    <Flex
      ml={{ base: 0, md: 30 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={'#000'}
      borderBottomWidth="1px"
      borderBottomColor={'gray.700'}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
    >
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        size={'sm'}
        icon={<FiMenu />}
      />
      <HStack spacing={{ base: '0', md: '6' }}>
        <SearchBar />
        <Menu>
          <MenuButton
            as={IconButton}
            size="lg"
            variant={gameLength > 0 ? 'outline' : 'ghost'}
            aria-label="open menu"
            icon={<IoGameControllerOutline />}
            colorScheme={gameLength > 0 ? 'red' : ''}
          />
          <MenuList>
            {games && <GameInvite games={games} />}
            {gameLength === 0 && (
              <Text fontSize="sm" color="gray.400" ml="2">
                No pending game invites
                </Text>
            )}
          </MenuList>
        </Menu>
        <Menu>
          <MenuButton
            as={IconButton}
            size="lg"
            variant={notificationCount > 0 ? 'outline' : 'ghost'}
            aria-label="open menu"
            icon={<FiBell />}
            colorScheme={notificationCount > 0 ? 'red' : ''}
          />
          <MenuList>
            <FriendRequests user={data.data} />
          </MenuList>
        </Menu>
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: 'none' }}
            >
              <HStack>
                <Avatar size={'sm'} src={avatar} />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">{username}</Text>
                  <Text fontSize="xs" color="gray.600">
                    {coalition ? coalition : 'No coalition'}
                  </Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem
                onClick={() => {
                  router.push(`/profile/${username}`);
                }}
              >
                Profile
              </MenuItem>
              <MenuItem
                onClick={() => {
                  removeCookie('token', { path: '/' });
                  router.replace('/');
                }}
              >
                Sign out
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};
