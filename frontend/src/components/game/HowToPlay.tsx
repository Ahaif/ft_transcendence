import Image from 'next/image';
import styled from 'styled-components';
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  filter: blur(18.5px);
  -webkit-filter: blur(18.5px);
  background: #5e535354;
  position: absolute;
`;
const Card = styled.div`
  background: #2c2c2c;
  box-shadow: 0px 15px 18px rgba(0, 0, 0, 0.92);
  border-radius: 10px;

  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  gap: 12px;
  > span:nth-of-type(2) {
    font-size: 1.5rem;
    font-weight: bold;
    margin-top: 1rem;
  }
`;
const HowToPlay = ({
  hidden,
  setHidden,
}: {
  hidden: boolean;
  setHidden: (v: boolean) => void;
}) => {
  if (!hidden) return (null);
  return (
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9,
        }}
        onClick={() => setHidden(false)}
      >
        <Container></Container>
        <Card>
          <Image src={'/Icons/InfosC.svg'} width={50} height={50} alt="info" />
          <span>CONTROLS</span>
          <Image src={'/Icons/Arrow.svg'} width={150} height={150} alt="info" />
          <span>Use arrow keys to play the game</span>
        </Card>
      </div>
  );
};

export default HowToPlay;
