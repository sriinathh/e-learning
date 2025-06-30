import React, { useState } from 'react';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  useDisclosure,
  useColorModeValue,
  Stack,
  Badge,
  Text,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from 'react-icons/hamburger';
import { FaBell, FaUsers } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import MessageBox from './MessageBox';

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMessageOpen, setIsMessageOpen] = useState(false);

  const toggleMessage = () => {
    setIsMessageOpen(!isMessageOpen);
  };

  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4} position="relative" zIndex="1000">
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <Box>Logo</Box>
            <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
              <Button
                as={Link}
                to="/community"
                variant="ghost"
                colorScheme="blue"
                leftIcon={<FaUsers />}
                _hover={{ bg: 'blue.50' }}
              >
                Community
              </Button>
            </HStack>
          </HStack>
          <Flex alignItems={'center'} gap={4}>
            <Button
              as={Link}
              to="/messages"
              variant="ghost"
              onClick={toggleMessage}
              position="relative"
              _hover={{ bg: 'gray.200' }}
              borderRadius="full"
              p={2}
            >
              <HStack spacing={2}>
                <FaBell size="20px" />
                <Text display={{ base: 'none', md: 'block' }}>Messages</Text>
                <Badge
                  position="absolute"
                  top="-2px"
                  right="-2px"
                  colorScheme="red"
                  borderRadius="full"
                  fontSize="xs"
                >
                  3
                </Badge>
              </HStack>
            </Button>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
              <Button
                variant="ghost"
                onClick={toggleMessage}
                justifyContent="flex-start"
                leftIcon={<FaBell />}
              >
                Messages
                <Badge ml={2} colorScheme="red" borderRadius="full" fontSize="xs">
                  3
                </Badge>
              </Button>
              <Button
                as={Link}
                to="/community"
                variant="ghost"
                colorScheme="blue"
                leftIcon={<FaUsers />}
                _hover={{ bg: 'blue.50' }}
              >
                Community
              </Button>
            </Stack>
          </Box>
        ) : null}
      </Box>

      <MessageBox isOpen={isMessageOpen} onClose={() => setIsMessageOpen(false)} />
    </>
  );
};

export default Navbar; 