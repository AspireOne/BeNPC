import axios from "axios";

export const apiBase = "http://localhost:3001";
export const apiRoutes = {
  messages: {
    get: "/chat/messages",
    post: "/chat/messages",
  },

  createChat: {
    post: "/chat/create",
  },

  gameState: {
    get: "/chat/gameState",
  },
};

// custom axios client.
export const apiAxios = axios.create({
  baseURL: apiBase,
  headers: {
    "Content-Type": "application/json",
  },
});
