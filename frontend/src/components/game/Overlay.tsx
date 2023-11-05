import Image from 'next/image';
import styled from 'styled-components';
import React from 'react';
import { useRouter } from 'next/router';

const Div = styled.div`
  width: 100%;
  height: 100%;
  background-color: #000;
  position: absolute;
  z-index: 11;
  opacity: 88%;
  display: flex;
  align-items: center;
  justify-content: center;
  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;
const Text = styled.div<{ data: boolean }>`
  text-shadow: ${(props) =>
    props.data ? ' 2px 2px #d1d718' : '2px 2px #d71818'};
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  cursor: pointer;
`;
interface type {
  data: boolean;
  isAdmin: boolean;
  hidden: boolean;
  onClick?: () => void;
}
const Overlay: React.FC<type> = ({
  data,
  isAdmin,
  onClick,
  hidden = false,
}: type) => {
    const router = useRouter();
    React.useEffect(() => {
        setTimeout(() => router.reload(), 2000);
    }, [])
  return (
    <Div>
      {hidden ? (
        data ? (
          <div>
            <Image
              src={'/images/giphy.gif'}
              width={250}
              height={250}
              alt="winner"
            />
          </div>
        ) : (
          <Image
            src={'/images/loser.gif'}
            width={300}
            height={300}
            alt="loser"
          />
        )
      ) : (
        <Text data={data}>Game Over</Text>
      )}
    </Div>
  );
};

export default Overlay;
