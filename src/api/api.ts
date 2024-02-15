import { GameState } from "@/types/backend";
import { apiAxios, apiRoutes } from "./api.definitions";

type GetMessagesResponse = {
  messages: {
    role: "assistant" | "user";
    content: string;
  }[];
};
export const getMessages = async (
  session: string,
): Promise<GetMessagesResponse> => {
  const { data } = await apiAxios.get<GetMessagesResponse>(
    apiRoutes.messages.get,
    {
      params: {
        session,
      },
    },
  );

  return data;
};

type PostMessageResponse = { message: string; state: GameState };
export const postChatMessage = async (
  session: string,
  message: string,
): Promise<PostMessageResponse> => {
  const { data } = await apiAxios.post<PostMessageResponse>(
    apiRoutes.messages.post,
    {
      session,
      message,
    },
  );
  return data;
};

type CreateChatResponse = { session: string; message: string };
export const createChat = async (): Promise<CreateChatResponse> => {
  const { data } = await apiAxios.post<CreateChatResponse>(
    apiRoutes.createChat.post,
  );
  return data;
};

export const getGameState = async (
  session: string,
): Promise<{ state: GameState }> => {
  const { data } = await apiAxios.get<{ state: GameState }>(
    apiRoutes.gameState.get,
    {
      params: {
        session,
      },
    },
  );
  return data;
};
