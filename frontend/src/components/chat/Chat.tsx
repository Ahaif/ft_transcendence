import DashboardPage from '../Dashboard';
import {
  Flex,
  Stack,
  Button,
  Avatar,
  IconButton,
  Box,
} from '@chakra-ui/react';
import ChatList from './ChatList';
import userService from '@/service/userService';
import useSWR from 'swr';
import { IoSettingsOutline } from 'react-icons/io5';
import { useState } from 'react';
import SearchRecipient from './Search';
import MessageBox from './Messages';
import ChatComponent from './SideComponent';

export default function Chat() {
  return (
    <DashboardPage>
      <Flex
        overflow={'hidden'}
        borderColor={"gray.700"}
        borderWidth={2}
        borderRadius={8}
        bg={'gray.800'}
      >
        <ChatComponent />
      </Flex>
    </DashboardPage>
  );
}
