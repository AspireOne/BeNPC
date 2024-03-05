import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useQuery } from "@tanstack/react-query";
import { GameState } from "@/types/backend";
import { useGameStore } from "@/stores/gameStore";
import { lsKeys } from "@/lib/localstorage";
import { LoadingScreen } from "@/components/LoadingScreen";
import { createChat, getGameState, getMessages, postChatMessage } from "@/api/api";
import Markdown from "react-markdown";
import {
  Badge,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Icon,
  IconButton,
  Input,
  Progress,
  SimpleGrid,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { FiMenu, FiMoon, FiSend, FiSun, FiVolume2 } from "react-icons/fi";

type Message = {
  role: "assistant" | "user";
  content: string;
};

export default () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [session, setSession] = useState<string | null | undefined>(undefined);
  const [creatingChat, setCreatingChat] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { inventoryItems, stats, setStats, setInventoryItems } = useGameStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("gray.100", "gray.700");

  useQuery<{ state: GameState }>({
    enabled: !!session,
    queryKey: ["game-state"],
    queryFn: async () => {
      const data = await getGameState(session!);
      const store = useGameStore.getState();
      store.setStats(data.state.stats);
      store.setInventoryItems(data.state.inventoryItems);
      return data;
    },
  });

  useQuery({
    enabled: !!session,
    queryKey: ["messages"],
    gcTime: Infinity,
    staleTime: Infinity,
    queryFn: async () => {
      const data = await getMessages(session!);
      setMessages(data.messages);
      return data;
    },
  });

  useEffect(() => {
    const session = localStorage.getItem(lsKeys.session);
    if (session) {
      setSession(session);
      return;
    }

    setSession(null);
    setCreatingChat(true);
    createChat()
      .then((data) => {
        setSession(data.session);
        localStorage.setItem(lsKeys.session, data.session);
        setMessages([
          {
            role: "assistant",
            content: data.message,
          },
        ]);
      })
      .catch()
      .finally(() => setCreatingChat(false));
  }, []);

  const [input, setInput] = useState("");

  useEffect(() => {
    const element = document.getElementById("bottom-anchor");
    if (element) element.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  console.log({ session, messages, stats, creatingChat });

  const handleSendClick = () => {
    if (submitting) {
      console.warn("Already submitting");
      return;
    }

    if (input.trim() !== "") {
      setMessages([...messages, { role: "user", content: input }]);
      setInput("");
      setSubmitting(true);

      postChatMessage(session, input)
        .then((response) => {
          setMessages([
            ...messages,
            { role: "user", content: input },
            { role: "assistant", content: response.message },
          ]);
          setStats(response.state.stats);
          setInventoryItems(response.state.inventoryItems);
          console.log("response stats: ", JSON.stringify(stats));
        })
        .finally(() => setSubmitting(false));
    }
  };

  return (
    <>
      <Head>
        <script
          type="module"
          src="https://cdn.jsdelivr.net/npm/ldrs/dist/auto/quantum.js"
        />
        <script
          type="module"
          src="https://cdn.jsdelivr.net/npm/ldrs/dist/auto/treadmill.js"
        />
      </Head>
      <Box h="95vh" bg={bg} p={4}>
        <IconButton
          aria-label="Toggle Dark Mode"
          icon={colorMode === "light" ? <FiMoon /> : <FiSun />}
          onClick={toggleColorMode}
          mb={2}
        />

        <Flex direction="column" h="full">
          <VStack
            flex={1}
            overflowY="auto"
            spacing={4}
            align="stretch"
            maxHeight="100vh"
          >
            {messages.map((message, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <Message key={index} role={message.role} content={message.content} />
            ))}
            {submitting && <Loading />}
          </VStack>
          <MessageInput
            className={"mx-auto w-full"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              // @ts-ignore
              if (e.key === "Enter") handleSendClick();
            }}
            onClick={handleSendClick}
          />
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

        <Drawer placement="bottom" onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent borderRadius="md">
            <DrawerBody p={4}>
              <PlayerStats />
              <Text fontSize="md" fontWeight="bold" mt={4} mb={2}>
                Inventory
              </Text>
              <SimpleGrid columns={2} spacing={2}>
                {/* Inventory items dynamically populated */}
                <InventoryItem item={{ name: "Meč Pravdy", type: "Weapon" }} />
                {/* Additional items */}
              </SimpleGrid>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Box>
    </>
  );
};

const PlayerStats = () => (
  <VStack align="flex-start">
    <Text fontSize="md" fontWeight="bold" mb={2}>
      Player Stats
    </Text>
    <Text>Health</Text>
    <Progress colorScheme="red" size="sm" value={60} w="full" />
    {/* Additional stats as needed */}
  </VStack>
);

const InventoryItem = (props: {
  item: any;
}) => (
  <Box p={2} shadow="md" borderWidth="1px" flex="1" borderRadius="md">
    <Text>{props.item.name}</Text>
    <Badge ml="1" fontSize="0.8em" colorScheme="green">
      {props.item.type}
    </Badge>
  </Box>
);

const Loading = () => (
  // @ts-ignore
  <div className={"w-[100px] h-[100px] mx-auto"}>
    {/* @ts-ignore */}
    <l-quantum size="50" speed="2" color="#BF1C57" />
  </div>
);

function MessageInput(props: {
  className?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: () => void;
}) {
  return (
    <Flex w="100%">
      <Input
        placeholder="Continue here..."
        className="flex-grow outline-none px-2 bg-transparent"
        value={props.value}
        onChange={props.onChange}
        // handle enter
        // @ts-ignore
        onKeyDown={props.onKeyDown}
      />
      <IconButton
        icon={<Icon as={FiSend} />}
        onClick={props.onClick}
        ml={2}
        colorScheme="blue"
        aria-label="Send"
      />
    </Flex>
  );
}

const Message = (props: {
  content: string;
  role: "user" | "assistant";
}) => {
  const isPlayer = props.role === "user";
  const align = props.role === "user" ? "flex-end" : "flex-start";
  const color = useColorModeValue(
    isPlayer ? "blue.500" : "green.500",
    isPlayer ? "blue.200" : "green.200",
  );
  const toast = useToast();

  const handleTTS = async (text: string) => {
    const options = {
      method: "POST",
      headers: {
        "xi-api-key": "6159660b4f0e8ebd174518fb2b2a64f1", // Replace with your actual API key
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model_id: "eleven_multilingual_v2",
        text: text,
        voice_settings: {
          similarity_boost: 0.75,
          stability: 0.50,
          style: 0.60,
          use_speaker_boost: true,
        },
      }),
    };

    try {
      const response = await fetch(
        "https://api.elevenlabs.io/v1/text-to-speech/pqHfZKP75CvOlQylNhV4?optimize_streaming_latency=2&output_format=mp3_22050_32",
        options,
      );
      if (!response.ok)
        throw new Error("Network response was not ok") && console.error(response);

      // Assuming the response body is the MP3 audio binary data
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();

      // Remember to revoke the object URL after playback is initiated
      audio.onplay = () => {
        URL.revokeObjectURL(url);
      };
    } catch (error) {
      toast({
        title: "Error playing TTS",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      console.error("Error fetching TTS:", error);
    }
  };

  return (
    <Flex w="100%" justify={align}>
      <Box maxW="70%" p={3} bg={color} color="white" borderRadius="lg">
        <Markdown>{props.content}</Markdown>
        {/* TTS Button */}
        <Button
          onClick={() => handleTTS(props.content)}
          size="sm"
          ml={2}
          variant="ghost"
        >
          <FiVolume2 />
        </Button>
      </Box>
    </Flex>
  );
};
