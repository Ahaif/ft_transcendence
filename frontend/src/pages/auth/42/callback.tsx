import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { setExistingUser } from '@/store/userStore';
import userService, { baseUrl } from '@/service/userService';
import {  setUserData } from '@/store/userStore';

import useSWR from 'swr';
import Register from '@/components/home/registration/register';
import Loading from '@/components/Loading';
import { useCookies } from 'react-cookie';

function CallbackPage() {
  const router = useRouter();
  const { data, error } = useSWR(`${baseUrl}/api/me`, userService.getUserInfo);
  const [cookies, setCookie] = useCookies(['token']);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let token = params.get('access_token');
    let existingUser = params.get('exists');
    if (existingUser === 'false') {
      setExistingUser(false);
    }
    let otp = params.get('otp');
    if (otp === 'true') {
      if (token) setCookie('token', token, { path: '/' , sameSite: 'strict'});
      router.push('/otp');
      return;
    }

    if (token && token !== undefined && token !== null && token !== '') {
      setCookie('token', token, { path: '/' });
      if (existingUser === 'true') {
        router.push('/home');
      }
    }

    if (data) {
      setUserData({
        username: data.data.username,
        avatar: data.data.avatar,
        clColor: data.data.clColor,
        clImageUrl: data.data.clImageUrl,
        intraName: data.data.intraName,
      });
    }

    if (error) {
        console.log(error);
    }
  }, [data]);


  return <Register />;
}

export default CallbackPage;
