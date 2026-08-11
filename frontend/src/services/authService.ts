import { api } from "./api";
import { User } from "@/types";

const API_URL = import.meta.env.VITE_API_URL;

export const authService = {
  async getMe(): Promise<User | null> {
    const { data } = await api.get<{ user: User | null }>("/auth/me");
    return data.user;
  },

  loginWithGoogle() {
    window.location.href = `${API_URL}/api/auth/google`;
  },

  async logout() {
    await api.post("/auth/logout");
  },
};
