import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import { SocketContext } from '../context/socketContext';
import React from 'react';

export default function App({ Component, pageProps }: AppProps) {
    React.useEffect(() => {
        localStorage.setItem('chakra-ui-color-mode', 'dark');
    }, []);

  return (
    <SocketContext>
      <ChakraProvider>
        <AnimatePresence>
          <Component {...pageProps} />
        </AnimatePresence>
      </ChakraProvider>
    </SocketContext>
  );
}
