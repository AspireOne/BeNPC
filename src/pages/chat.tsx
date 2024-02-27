import Link from "next/link";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { IoSend } from "react-icons/io5";
import { twMerge } from "tailwind-merge";
import { StatsDashboard } from "@/components/ui/stats-dashboard";
import Head from "next/head";
import { useQuery } from "@tanstack/react-query";
import { GameState } from "@/types/backend";
import { useGameStore } from "@/stores/gameStore";
import { lsKeys } from "@/lib/localstorage";
import { LoadingScreen } from "@/components/LoadingScreen";
import { createChat, getGameState, getMessages, postChatMessage } from "@/api/api";
import { InventoryDashboard } from "@/components/ui/inventory-dashboard";
import Markdown from "react-markdown";

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
  if (creatingChat) return <LoadingScreen text={"Creating chat..."} />;
  if (!session || messages.length === 0 || !stats) return <LoadingScreen />;

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
    <div className={"flex flex-row p-4 relative justify-between"}>
      <Head>
        <script
          type="module"
          src="https://cdn.jsdelivr.net/npm/ldrs/dist/auto/quantum.js"
        ></script>
        <script
          type="module"
          src="https://cdn.jsdelivr.net/npm/ldrs/dist/auto/treadmill.js"
        ></script>
      </Head>

      <StatsDashboard />

      <div
        className={
          "relative flex flex-col gap-4 overflow-y-scroll hide-scrollbar max-w-[900px] mx-auto"
        }
      >
        <h1
          className={
            "text-5xl py-2 font-bold mx-auto text-center text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-indigo-400"
          }
        >
          Dungeons & Dragons
        </h1>

        <div>
          {messages.map((message, index) => (
            <Message key={index} role={message.role} content={message.content} />
          ))}
          {submitting && <Loading />}
          <div id={"bottom-anchor"} />
          <div className={"my-8"} />
        </div>

        <Input
          className={"mx-auto w-[600px]"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            // @ts-ignore
            if (e.key === "Enter") handleSendClick();
          }}
          onClick={handleSendClick}
        />
      </div>

      <InventoryDashboard />
    </div>
  );
};

const Loading = () => (
  // @ts-ignore
  <div className={"w-[100px] h-[100px] mx-auto"}>
    {/* @ts-ignore */}
    <l-quantum size="50" speed="2" color="#BF1C57"></l-quantum>
  </div>
);

function Input(props: {
  className?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: () => void;
}) {
  return (
    <div
      className={twMerge(
        "bg-transparent border border-zinc-300 rounded-[15px] p-4 flex items-center shadow",
        props.className,
      )}
    >
      <input
        type="text"
        placeholder="Continue here..."
        className="flex-grow outline-none px-2 bg-transparent"
        value={props.value}
        onChange={props.onChange}
        // handle enter
        // @ts-ignore
        onKeyDown={props.onKeyDown}
      />
      <IoSend
        size={24}
        className="ml-2 cursor-pointer text-gray-500"
        onClick={props.onClick}
      />
    </div>
  );
}

const Message = (props: {
  content: string;
  role: "user" | "assistant";
}) => {
  const messageClass =
    props.role === "user"
      ? "flex flex-col items-end my-2"
      : "flex flex-col items-start my-2";

  const bgColorClass =
    props.role === "user" ? "text-brand-primary/80" : "text-zinc-300";

  return (
    <div className={messageClass}>
      <div
        className={twMerge(
          "rounded-lg p-5 w-full text-gray-100",
          bgColorClass,
          "text-[17px]",
        )}
      >
        <Markdown>{props.content}</Markdown>
      </div>
    </div>
  );
};
