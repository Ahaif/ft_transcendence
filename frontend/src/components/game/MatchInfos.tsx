import { useState, useContext } from 'react';
import Image from 'next/image';
import { AppCtx } from '@/context/socketContext';
import { socket } from '@/service/socket';
import { Button } from '@chakra-ui/react';

const MatchInfos = ({ setHidden }: { setHidden: (v: boolean) => void }) => {
  const { gameData, roomData, watchers } = useContext(AppCtx);
  const [show, setShow] = useState(true);

  const handleClick = () => {
     socket.emit('startGame', {
      roomName: roomData.roomName,
    })
    setShow(false);
  };

  return (
    <div>
      {roomData?.player1 == socket.id && roomData?.status == 'pending' && (
        <>
        {show && 
        <Button
          style={{
            color: 'white',
            position: 'absolute',
            fontWeight: 'bold',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            zIndex: 9,
          }}
          onClick={handleClick}
          colorScheme='green'
          variant={'outline'}
          m={4}
        >
          PLAY
        </Button>}
        </>
      )}
      {/* @ts-ignore */}
      <div
        style={{
          color: 'white',
          position: 'absolute',
          fontWeight: 'bolder',
          backgroundColor: 'transparent',
          cursor: 'pointer',
          left: '50%',
          zIndex: 1,
        }}
      >
        {gameData.score.player1.toString()} - {gameData.score.player2.toString()}
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '5px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          left: '85%',
          zIndex: 9,
        }}
      >
        <div
          style={{ marginRight: '5px', fontWeight: 600, fontSize: '0.9rem' }}
        >
          {watchers?.length | 0}
        </div>
        <Image src={'/Icons/Eye.svg'} width={17} height={17} alt="eye"/>
        <div
          style={{
            marginLeft: '10px',
            fontWeight: 'bolder',
            cursor: 'pointer',
          }}
          onClick={() => setHidden(true)}
        >
          ?
        </div>
      </div>
    </div>
  );
};

export default MatchInfos;
