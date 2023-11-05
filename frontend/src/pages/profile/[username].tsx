import { useRouter } from 'next/router';
import useSWR from 'swr';
import userService from '@/service/userService';
import { baseUrl } from '@/service/userService';
import ProfileCardComponent from '@/components/profile/Profile';
import DashboardPage from '@/components/Dashboard';
import Loading from '@/components/Loading';
import { Center, Text } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { socket } from '@/service/socket';


const ProfilePage = () => {
  const router = useRouter();
  const username = router.query['username']?.toString();
  const [status, setStatus] = useState('offline');

  useEffect(() => {
    if (username) {
      socket.emit('getStatus', {username: username});
    }

    socket.on('getStatus', (data: any) => {
        setStatus(data.status);
    });
  }, [username])



  const { data, error, isLoading } = useSWR(
    `${baseUrl}/api/user/${username}`,
    () => (username ? userService.getUserPublicInfo(username) : null)
  );
  if (error) {
    return (
        <DashboardPage>
            <Center>
                <Text fontSize="4xl">User not found</Text>
            </Center>
        </DashboardPage>
    )
  }
  if (isLoading || !data) {
    return <Loading />;
  }


  const user = data.data;
  let colorScheme: string = '';
  switch (user.coalition) {
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

  return (
    <DashboardPage>
        {user.notFound === true ? (
            <Center>
                <Text fontSize="4xl">User not found</Text>
            </Center>

    ) : (
      <ProfileCardComponent
        colorScheme={colorScheme}
        avatar={user.avatar}
        coalition={user.coalition}
        username={user.username}
        intraName={user.intraName}
        email={user.email}
        clImageUrl={user.clImageUrl}
        clCoverUrl={user.clCoverUrl}
        self={user.self}
        friend={user.isFriend}
        status={status}
        blocked={user.blocked}
        games={user.games}
      />
      )}
      </DashboardPage>
  );
};
export default ProfilePage;
