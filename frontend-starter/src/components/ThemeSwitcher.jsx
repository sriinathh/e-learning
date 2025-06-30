import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  SimpleGrid,
  useDisclosure,
  Flex,
  Text,
  Icon,
  Tooltip,
  useColorModeValue
} from '@chakra-ui/react';
import { FiSettings } from 'react-icons/fi';
import { useThemeStore, THEMES } from '../store/themeStore';

const ThemeSwitcher = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { theme, setTheme } = useThemeStore();
  
  // Apply theme to HTML root element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    onClose();
  };

  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.100', 'gray.600');
  const activeBg = useColorModeValue('blue.50', 'blue.900');
  const activeBorder = useColorModeValue('blue.500', 'blue.300');

  // Function to capitalize first letter
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <>
      <Button
        leftIcon={<Icon as={FiSettings} />}
        colorScheme="teal"
        variant="outline"
        onClick={onOpen}
      >
        Change Theme
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Choose a Theme</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <SimpleGrid columns={[2, 3, 4]} spacing={4}>
              {THEMES.map((themeName) => (
                <Tooltip key={themeName} label={capitalize(themeName)}>
                  <Flex
                    direction="column"
                    align="center"
                    p={3}
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor={theme === themeName ? activeBorder : borderColor}
                    cursor="pointer"
                    _hover={{ bg: hoverBg }}
                    bg={theme === themeName ? activeBg : bgColor}
                    boxShadow={theme === themeName ? "md" : "none"}
                    onClick={() => handleThemeChange(themeName)}
                    transition="all 0.2s"
                  >
                    <Box 
                      w="100%" 
                      h="60px" 
                      borderRadius="md" 
                      mb={2}
                      position="relative"
                      overflow="hidden"
                    >
                      {/* Theme preview with theme-specific colors */}
                      <Box 
                        position="absolute" 
                        top="0" 
                        left="0" 
                        right="0" 
                        h="30px" 
                        bg={getPreviewColor(themeName, 'primary')} 
                      />
                      <Box 
                        position="absolute" 
                        bottom="0" 
                        left="0" 
                        right="0" 
                        h="30px" 
                        bg={getPreviewColor(themeName, 'secondary')} 
                      />
                    </Box>
                    <Text 
                      fontSize="sm" 
                      fontWeight={theme === themeName ? "bold" : "normal"}
                    >
                      {capitalize(themeName)}
                    </Text>
                  </Flex>
                </Tooltip>
              ))}
            </SimpleGrid>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

// Function to generate preview colors based on theme name
function getPreviewColor(theme, type) {
  // This is a simplified version - in a real app, you'd have actual theme colors
  const colorMap = {
    light: { primary: '#f8fafc', secondary: '#e2e8f0' },
    dark: { primary: '#1e293b', secondary: '#334155' },
    cupcake: { primary: '#faf7f5', secondary: '#edd3d1' },
    bumblebee: { primary: '#ffffff', secondary: '#fef3c7' },
    emerald: { primary: '#f0fdf4', secondary: '#d1fae5' },
    corporate: { primary: '#f8fafc', secondary: '#e0f2fe' },
    synthwave: { primary: '#2d1b69', secondary: '#e779c1' },
    retro: { primary: '#e4d8b4', secondary: '#a7b99e' },
    cyberpunk: { primary: '#ffee00', secondary: '#ff00a0' },
    valentine: { primary: '#fecdd3', secondary: '#ffe4e6' },
    halloween: { primary: '#22162b', secondary: '#f39c12' },
    garden: { primary: '#e9f5db', secondary: '#b5c99a' },
    forest: { primary: '#2c3639', secondary: '#3f4e4f' },
    aqua: { primary: '#ecfeff', secondary: '#a5f3fc' },
    lofi: { primary: '#f9fafb', secondary: '#d1d5db' },
    pastel: { primary: '#fef2f2', secondary: '#fee2e2' },
    fantasy: { primary: '#efe6ff', secondary: '#c4b5fd' },
    wireframe: { primary: '#f1f5f9', secondary: '#e2e8f0' },
    black: { primary: '#131313', secondary: '#2e2e2e' },
    luxury: { primary: '#302d2d', secondary: '#d4af37' },
    dracula: { primary: '#282a36', secondary: '#44475a' },
    cmyk: { primary: '#0891b2', secondary: '#e0f2fe' },
    autumn: { primary: '#fefce8', secondary: '#713f12' },
    business: { primary: '#e6e6e6', secondary: '#cccccc' },
    acid: { primary: '#ffff00', secondary: '#00ff00' },
    lemonade: { primary: '#fef9c3', secondary: '#eab308' },
    night: { primary: '#0f172a', secondary: '#1e293b' },
    coffee: { primary: '#211720', secondary: '#865439' },
    winter: { primary: '#d6e4ff', secondary: '#e2e8f0' },
    dim: { primary: '#2d333b', secondary: '#373e47' },
    nord: { primary: '#2e3440', secondary: '#3b4252' },
    sunset: { primary: '#fef9c3', secondary: '#fdba74' },
  };

  // Default to coffee if theme not found
  const themeColors = colorMap[theme] || colorMap.coffee;
  return themeColors[type];
}

export default ThemeSwitcher; 