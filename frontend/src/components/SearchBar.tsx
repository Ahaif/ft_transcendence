import {
  Box,
  Stack,
  Flex,
  Input,
  Avatar,
  Text,
  Divider,
  InputLeftElement,
  InputGroup,
} from '@chakra-ui/react';
import { useRef, useState, useEffect } from 'react';
import userService from '@/service/userService';
import { useRouter } from 'next/router';
import { SearchIcon } from '@chakra-ui/icons';

type DropDownMenuItems = {
  username: string;
  avatar: string;
};

function DropDownMenu({ items }: any) {
  const router = useRouter();
  const handleClick = (username: string) => {
    router.push(`/profile/${username}`);
  };

  return (
    <Box
      position="absolute"
      top="100%"
      left="0"
      width="100%"
      backgroundColor={"gray.800"}
      zIndex={1}
      overflow="auto"
      borderRadius={4}
      borderColor={"gray.700"}
    >
      <Stack>
        {items.map((item: any, index: any) => (
          <>
            <Box
              key={index}
              onClick={() => {
                handleClick(item.username);
              }}
              _hover={{
                backgroundColor: 'gray.700',
                cursor: 'pointer',
              }}
            >
              <Flex direction="row" p={2} alignItems="center">
                <Avatar size="sm" src={item.avatar} />
                <Divider orientation="vertical" h={6} mx={2} />
                <Text mr={2}>{item.username}</Text>
              </Flex>
            </Box>
            <Divider orientation="horizontal" />
          </>
        ))}
      </Stack>
    </Box>
  );
}

export default function SearchBar() {
  const ref = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<DropDownMenuItems[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [ref]);

  const handleChange = () => {
    if (ref.current) {
      if (ref.current.value.length > 0) {
        console.log(ref.current.value);
        userService
          .searchUser(ref.current.value)
          .then((res: any) => {
            setItems(res.data);
            setIsOpen(true);
          })
          .catch((err: any) => {
            console.log(err);
          });
      } else {
        setIsOpen(false);
      }
    }
  };

  return (
    <Box position="relative">
      <Stack>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<SearchIcon color="gray.300" />}
          />
          <Input
            size="sm"
            type="text"
            variant="flushed"
            placeholder="search..."
            onChange={handleChange}
            ref={ref}
          />
        </InputGroup>
        {isOpen && <DropDownMenu items={items} />}
      </Stack>
    </Box>
  );
}
