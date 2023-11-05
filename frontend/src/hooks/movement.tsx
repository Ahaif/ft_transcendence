import React, { useEffect, useState, useContext } from 'react';
import { AppCtx } from '../context/socketContext';
import { socket } from '@/service/socket';

export const usePersonControls = () => {
  const { roomData } = useContext(AppCtx);
  const [movement, setMovement] = useState({
    left: false,
    right: false,
  });
  if (roomData?.player1 == socket.id || roomData?.player2 == socket.id) {
    const keys: any = {
      ArrowRight: 'right',
      ArrowLeft: 'left',
    };

    const moveFieldByKey = (key: string) => keys[key];

    useEffect(() => {
      const handleKeyDown = (e: any) => {
        setMovement((m) => ({ ...m, [moveFieldByKey(e.code)]: true }));
      };
      const handleKeyUp = (e: any) => {
        setMovement((m) => ({ ...m, [moveFieldByKey(e.code)]: false }));
      };
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keyup', handleKeyUp);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
      };
    }, []);
    return movement;
  }
  return movement;
};

export const useResize = () => {
  const [size, setSize] = useState({
    width: 1440,
    height: 1380,
  });
  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return size;
};
