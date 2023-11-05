import styled from 'styled-components';

type cardType = {
  theme: 'light' | 'dark';
};
const Button = styled.input`
  background: linear-gradient(
    264.81deg,
    #a1158f 8.9%,
    #5f0d55 79.71%,
    rgba(0, 0, 0, 0) 165.18%
  );
  border-radius: 9px;
  color: #ffffff;
  font-size: 1.5rem;
  max-width: 200px;
  width: 100%;
  padding: 15px;
  font-weight: 700;
  cursor: pointer;
`;

const Card = styled.div<cardType>`
  background: ${({ theme }) => (theme === 'dark' ? '#4f1f1f66' : '#000')};
  border-radius: 35px;
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
`;

const Cover = styled.div<any>`
  width: 100%;
  border-radius: 35px 35px 0px 0px;
  height: 160px;
  background: ${(props) =>
    props.background
      ? `linear-gradient(
        180deg,
        rgba(233, 218, 255, 0) 0%,
        rgba(0, 0, 0, 0.74) 100%
      ),url(${props.background})`
      : `linear-gradient(
      180deg,
      rgba(233, 218, 255, 0) 0%,
      rgba(0, 0, 0, 0.74) 100%
    ),
    url("/images/cover.png")`};
  background-position: center;
  background-color: crimson;
  background-size: cover;
  background-repeat: no-repeat;
`;

const Details = styled.div`
  width: 100%;
  border-radius: 0px 0px 35px 35px;
  padding: 10px;
  .result {
    display: flex;
    justify-content: space-around;
    align-items: center;
    align-content: center;
  }
  .infos {
    font-size: 1rem;
    font-weight: normal;
    font-size: 0.8rem;
    display: flex;
    justify-content: space-between;
    padding: 10px;
  }
  .seen {
    display: flex;
    align-items: center;
  }
`;

export { Button, Card, Cover, Details };
