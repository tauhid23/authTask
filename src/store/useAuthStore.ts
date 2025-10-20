import { create } from "zustand";

interface User {
  name?: string;
  email?: string;
  account_type?: string;
  subscription_status?: string;
  subscription_expires_on?: string;
  [key: string]: any; 
}

interface AuthState {
  token: string | null;
  user: User | null;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  user: null,
  setToken: (token: string) => {
    set({ token });
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
  },
  setUser: (user: User) => set({ user }),
  logout: () => {
    set({ token: null, user: null });
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  },
}));
