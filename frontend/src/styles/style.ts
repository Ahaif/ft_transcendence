import styled from 'styled-components';

const Div = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  width: 80%;
  max-width: 1000px;
  z-index: 1;
  > span {
    font-weight: 700;
    font-size: 3.5rem;
    padding-bottom: 20px;
  }
  > p {
    /* font-weight: 600;
    font-size: 0.8rem; */
    line-height: 2rem;
    padding-bottom: 20px;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%; /// the height didnt work
  position: relative;
  .bottom {
    position: absolute;
    bottom: 0;
    right: 0;
    height: 30%;
    width: 30%;
  }
  .top {
    position: absolute;
    top: 0;
    right: 0;
    transform: scaleX(-1) rotate(179deg);
    height: 30%;
    width: 30%;
  }
  @media (max-width: 450px) {
    .top,
    .bottom {
      display: none;
    }
  }
`;

export { Div, Container };
