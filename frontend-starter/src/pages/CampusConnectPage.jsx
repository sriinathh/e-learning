import { Box, Heading, Text, Container, Flex } from "@chakra-ui/react";
import CampusConnectChat from "../components/CampusConnectChat";

const CampusConnectPage = () => {
  return (
    <Container maxW="container.xl" p={4}>
      <Box mb={6} textAlign="center">
        <Heading as="h1" size="xl" color="teal.600" mb={3}>
          CampusConnect AI Assistant
        </Heading>
        <Text color="gray.600" fontSize="lg">
          Your personal AI assistant for all your educational needs
        </Text>
      </Box>

      <Box 
        bg="white" 
        borderRadius="lg" 
        boxShadow="md" 
        overflow="hidden"
        height="75vh"
      >
        <CampusConnectChat />
      </Box>
    </Container>
  );
};

export default CampusConnectPage; 