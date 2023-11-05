import { useEffect, useState } from 'react';
import Router from 'next/router';

export const changeRoute = () => {
  const [changed, setChange] = useState<boolean>(false);
  function init() {
    setChange(false);
  }
  useEffect(() => {
    Router.events.on('routeChangeStart', (url) => {
      if (!url.match(/\/game\/.*/g)) setChange(true);
    });
  }, []);
  return [changed, init];
};
