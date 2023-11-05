import { Flex, Spinner} from '@chakra-ui/react';

export default function Loading() {
  return (
    <Flex
      justifyContent={'center'}
      alignItems={'center'}
      h={'100vh'}
      w={'100vw'}
      bg={'gray.900'}
    >
      <Spinner
        size="xl"
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        color="messenger.500"
      />
    </Flex>
  );
}
