import type { NextPage } from 'next';
import { useState } from 'react';
import Loading from '@/components/FindGame';
import { Div, Container } from '@/styles/style';
import Select from '@/components/Select';
import { Button } from '@/components/home/Card/style';
import DashboardPage from '@/components/Dashboard';
import { socket } from '@/service/socket';

const Home: NextPage = () => {
  const [search, setSearch] = useState(false);
  const [select, setSelected] = useState('Easy');
  return (
    <DashboardPage>
      <Container>
        <Icon className={'top'} />
        <Icon className={'bottom'} />
        <Div>
          <span>Let’s Play</span>
          <p>
            Pong is a sports game that simulates table tennis. The player
            controls an in-game paddle by moving it vertically across the left
            or right side of the screen. They can compete against another player
            controlling a second paddle on the opposing side.
          </p>
          <p>
            Players use the paddles to hit a ball back and forth. The goal is
            for each player to reach eleven points before the opponent; points
            are earned when one fails to return the ball to the other.
          </p>
          {!search ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '35px',
              }}
            >
              <Select select={select} setSelected={setSelected} />
              <Button
                type="submit"
                value="READY"
                onClick={() => {
                  setSearch(!search);
                  socket.emit('findGame', { dificulty: select });
                }}
              />
            </div>
          ) : (
            <Loading message="Finding a player ..." />
          )}
        </Div>
      </Container>
    </DashboardPage>
  );
};

export default Home;

const Icon = ({ className }: any) => {
  return (
    <svg
      className={className}
      width="559"
      height="280"
      viewBox="0 0 559 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M231.412 2.12124L84.9249 86.6954C79.187 90.0083 77.2122 97.3336 80.5155 103.055L164.841 249.111C168.142 254.828 175.468 256.789 181.213 253.472L327.7 168.898C333.438 165.585 335.413 158.26 332.11 152.538L247.784 6.48241C244.481 0.761334 237.158 -1.19612 231.412 2.12124ZM164.842 181.137C164.842 181.136 164.842 181.135 164.842 181.134L187.325 97.7178C187.612 96.6535 188.706 96.0219 189.771 96.3057L268.585 117.299C270.308 117.758 270.614 120.072 269.07 120.964L164.85 181.14C164.847 181.142 164.843 181.14 164.842 181.137V181.137ZM338.341 187.336C338.342 187.336 338.342 187.337 338.342 187.338L191.858 271.91C186.12 275.223 184.153 282.543 187.457 288.265L271.782 434.321C275.083 440.038 282.404 441.992 288.143 438.679L434.629 354.104C440.367 350.792 442.346 343.474 439.043 337.753L354.709 191.689C351.407 185.979 344.085 184.021 338.341 187.335C338.34 187.336 338.341 187.337 338.341 187.336V187.336ZM334.31 346.665C334.023 347.729 332.929 348.361 331.864 348.077L253.053 327.081C251.33 326.622 251.024 324.308 252.568 323.416L352.615 265.654C354.159 264.763 356.01 266.185 355.546 267.907L334.31 346.665ZM152.811 294.454L6.32449 379.028C0.59037 382.338 -1.3882 389.666 1.91509 395.387L86.2405 541.443C89.5435 547.164 96.8763 549.12 102.615 545.807L249.101 461.233C254.836 457.923 256.806 450.599 253.502 444.875L169.176 298.819C165.873 293.098 158.542 291.145 152.811 294.454ZM175.781 458.868C176.671 460.409 175.255 462.258 173.534 461.8L94.7147 440.808C93.645 440.523 93.0102 439.424 93.2983 438.355L114.528 359.599C114.992 357.88 117.301 357.577 118.191 359.119L175.781 458.868ZM523.884 80.2107C523.885 80.2123 523.885 80.2143 523.883 80.2152L377.399 164.788C371.665 168.098 369.686 175.426 372.99 181.147L457.315 327.203C460.616 332.92 467.949 334.877 473.688 331.564L620.172 246.986C625.91 243.674 627.885 236.348 624.582 230.627L540.251 84.5614C536.953 78.8488 529.631 76.8912 523.886 80.2062C523.884 80.2071 523.883 80.2092 523.884 80.2107V80.2107ZM512.844 265.9C512.38 267.619 510.071 267.921 509.18 266.379L451.593 166.635C450.703 165.093 452.12 163.244 453.84 163.703L532.656 184.697C533.725 184.982 534.36 186.081 534.072 187.15L512.844 265.9Z"
        fill="#4B4B4B"
      />
    </svg>
  );
};
