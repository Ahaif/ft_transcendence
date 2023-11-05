import {motion} from "framer-motion";
import { useState, useEffect } from "react";
import {Box } from "@chakra-ui/react";
const frames = [
    "/loop/1.svg","/loop/2.svg","/loop/3.svg","/loop/4.svg","/loop/5.svg","/loop/6.svg","/loop/7.svg","/loop/8.svg","/loop/9.svg","/loop/10.svg","/loop/11.svg","/loop/12.svg","/loop/13.svg","/loop/14.svg","/loop/15.svg","/loop/16.svg","/loop/17.svg","/loop/18.svg","/loop/19.svg","/loop/20.svg","/loop/21.svg","/loop/22.svg"
]

export default function Pong() {
    const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((currentIndex + 1) % frames.length);
    }, 30);
    return () => clearInterval(intervalId);
  }, [currentIndex]);
    return (
        <Box
            w="50%"
        >
        <motion.img
            key={frames[currentIndex]}
            src={frames[currentIndex]}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}

            />
        </Box>
    )
}
