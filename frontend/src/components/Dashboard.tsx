import { useEffect, useContext } from 'react';
import axios from 'axios';
import {
    useToast,
} from '@chakra-ui/react';
import SideBar from './SideBar';
import userService, { baseUrl } from '../service/userService';
import useSWR from 'swr';
import { useState } from 'react';
import Loading from './Loading';
import { useRouter } from 'next/router';
import { socket } from '@/service/socket';
import chatContext from '@/context/chatContext';

export default function DashboardPage({ children }: any) {
    const [loading, setIsLoading] = useState<boolean>(true);
    const {convo } = useContext(chatContext);
    const router = useRouter();

  const { data, isLoading, error } = useSWR(
    `${baseUrl}/api/me`,
    () => userService.getUserInfo(),
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
    }
  );

    useEffect(() => {
        userService.checkJWT().then().catch((err) => {
            router.push('/');
          });
    }, []);

  const [active, setActive] = useState<string>('dashboard');


  if (isLoading) {
    return <Loading />;
  }
  else if (!data) {
    return <Loading />;
  }

  const user = data.data;

  return (
    <SideBar
      avatar={user.avatar}
      UserName={user.username}
      otpEnabled={user.otpEnabled}
      coalition={user.coalition}
    >
      {children}
    </SideBar>
  );
}
