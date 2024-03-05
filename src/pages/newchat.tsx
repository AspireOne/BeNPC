import React from 'react';
import {
    ChakraProvider,
    Box,
    VStack,
    Flex,
    Input,
    IconButton,
    Text,
    Progress,
    Drawer,
    DrawerBody,
    DrawerOverlay,
    DrawerContent,
    Button,
    useDisclosure,
    useColorMode,
    useColorModeValue,
    Icon,
    SimpleGrid,
    Badge
} from '@chakra-ui/react';
import { FiSend, FiMenu, FiSun, FiMoon } from 'react-icons/fi';

const ChatMessage = ({ sender, message }) => {
    const isPlayer = sender === 'Player';
    const align = isPlayer ? 'flex-end' : 'flex-start';
    const color = useColorModeValue(isPlayer ? 'blue.500' : 'green.500', isPlayer ? 'blue.200' : 'green.200');
    return (
        <Flex w="100%" justify={align}>
            <Box maxW="70%" p={3} bg={color} color="white" borderRadius="lg">
                {message}
            </Box>
        </Flex>
    );
};

const ChatInput = ({ onSend }) => {
    const [message, setMessage] = React.useState('');
    const handleSend = () => {
        onSend(message);
        setMessage('');
    };

    return (
        <Flex w="100%">
            <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <IconButton
                icon={<Icon as={FiSend} />}
                onClick={handleSend}
                ml={2}
                colorScheme="blue"
            />
        </Flex>
    );
};

const PlayerStats = () => (
    <VStack align="flex-start">
        <Text fontSize="md" fontWeight="bold" mb={2}>Player Stats</Text>
        <Text>Health</Text>
        <Progress colorScheme="red" size="sm" value={60} w="full"/>
        {/* Additional stats as needed */}
    </VStack>
);

const InventoryItem = ({ item }) => (
    <Box p={2} shadow="md" borderWidth="1px" flex="1" borderRadius="md">
        <Text>{item.name}</Text>
        <Badge ml="1" fontSize="0.8em" colorScheme="green">
            {item.type}
        </Badge>
    </Box>
);

// Main Component
const NewChat = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { colorMode, toggleColorMode } = useColorMode();
    const bg = useColorModeValue('gray.100', 'gray.700');

    return (
        <Box h="100vh" bg={bg} p={4}>
            <IconButton
                aria-label="Toggle Dark Mode"
                icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
                onClick={toggleColorMode}
                mb={2}
            />
            <Flex direction="column" h="full">
                <VStack flex={1} overflowY="auto" spacing={4} align="stretch">
                    {/* Dynamically populated ChatMessages; Placeholder example: */}
                    <ChatMessage sender="NPC" message="Welcome to the Dungeon! Choose your path wisely." />
                    <ChatMessage sender="Player" message="I will take the path less traveled." />
                    {/* Continued conversation */}
                </VStack>
                <ChatInput onSend={(msg) => console.log(msg)} />
            </Flex>

            <IconButton
                aria-label="Open Inventory"
                icon={<FiMenu />}
                onClick={onOpen}
                position="fixed"
                bottom="4"
                right="4"
                colorScheme="teal"
            />

            {/* Stats & Inventory Drawer */}
            <Drawer placement="bottom" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent borderRadius="md">
                    <DrawerBody p={4}>
                        <PlayerStats />
                        <Text fontSize="md" fontWeight="bold" mt={4} mb={2}>Inventory</Text>
                        <SimpleGrid columns={2} spacing={2}>
                            {/* Inventory items dynamically populated */}
                            <InventoryItem item={{ name: "Sword of Truth", type: "Weapon" }} />
                            {/* Additional items */}
                        </SimpleGrid>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Box>
    );
};

export default NewChat;