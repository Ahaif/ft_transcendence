import { Card, Cover, Details } from './style';
import Image from 'next/image';
import { Avatar } from '@chakra-ui/react';
import { useColorMode } from '@chakra-ui/react';

type dataType = {
  player1?: {
    img?: string;
    score?: number;
  };
  player2?: {
    img?: string;
    score?: number;
  };
  watchers: number;
};

const cardGame = ({ data }: { data: dataType }) => {
  const { colorMode } = useColorMode();

  return (
    <Card theme={colorMode}>
      <Cover />
      <Details>
        <div className="infos" style={{ fontSize: '12px' }}>
          <div>3 goals left</div>
          <div className="seen">
            <Image
              src="/Icons/Watcher.svg"
              width={15}
              height={15}
              alt="watcher"
            />
            <span style={{ marginLeft: '10px' }}>{data.watchers | 0}</span>
          </div>
        </div>
        <div className="result">
          <Avatar src={data.player1?.img} sx={{ width: 50, height: 50 }} />
          <div>
            {Number(data.player1?.score) | 0} -{' '}
            {Number(data.player2?.score) | 0}
          </div>
          <Avatar src={data.player2?.img} sx={{ width: 50, height: 50 }} />
        </div>
      </Details>
    </Card>
  );
};

export default cardGame;
