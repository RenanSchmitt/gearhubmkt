import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { products as defaultProducts, sellers as defaultSellers, chatThreads as defaultChatThreads, type Product, type Seller, type ChatThread } from "@/data/mockData";

export interface PartRequest {
  id: string;
  name: string;
  description: string;
  car: string;
  userId: string;
  createdAt: string;
  responses: number;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  location: string;
  description: string;
  isPro: boolean;
  rating: number;
  sales: number;
  joinedAt: string;
}

interface StoreState {
  products: Product[];
  sellers: Seller[];
  chatThreads: ChatThread[];
  favorites: Set<string>;
  alerts: string[]; // piece names to follow
  partRequests: PartRequest[];
  user: UserAccount | null;
  isLoggedIn: boolean;
}

interface StoreContextType extends StoreState {
  addProduct: (p: Omit<Product, "id">) => void;
  boostProduct: (id: string) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  addAlert: (name: string) => void;
  removeAlert: (name: string) => void;
  addPartRequest: (req: Omit<PartRequest, "id" | "createdAt" | "responses">) => void;
  login: (name: string, email: string) => void;
  logout: () => void;
  subscribePremium: () => void;
  getSellerProducts: (sellerId: string) => Product[];
}

const StoreContext = createContext<StoreContextType | null>(null);

const STORAGE_KEY = "gearhub_store";

function loadFromStorage(): Partial<StoreState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const data = JSON.parse(raw);
    return {
      products: data.products,
      favorites: new Set(data.favorites || []),
      alerts: data.alerts || [],
      partRequests: data.partRequests || [],
      user: data.user || null,
    };
  } catch { return {}; }
}

function saveToStorage(state: StoreState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      products: state.products,
      favorites: Array.from(state.favorites),
      alerts: state.alerts,
      partRequests: state.partRequests,
      user: state.user,
    }));
  } catch {}
}

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<StoreState>(() => {
    const saved = loadFromStorage();
    return {
      products: saved.products?.length ? saved.products : defaultProducts.map(p => ({ ...p, views: Math.floor(Math.random() * 500) + 50, favCount: Math.floor(Math.random() * 30), clicks: Math.floor(Math.random() * 100) + 10, status: p.isPro ? "patrocinado" as const : "normal" as const })),
      sellers: defaultSellers,
      chatThreads: defaultChatThreads,
      favorites: saved.favorites || new Set(),
      alerts: saved.alerts || [],
      partRequests: saved.partRequests || [],
      user: saved.user || null,
      isLoggedIn: !!saved.user,
    };
  });

  useEffect(() => { saveToStorage(state); }, [state]);

  const addProduct = useCallback((p: Omit<Product, "id">) => {
    setState(prev => ({
      ...prev,
      products: [{ ...p, id: `p_${Date.now()}` }, ...prev.products],
    }));
  }, []);

  const boostProduct = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      products: prev.products.map(p => p.id === id ? { ...p, status: "patrocinado" as any, isPro: true } : p),
    }));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setState(prev => {
      const next = new Set(prev.favorites);
      if (next.has(id)) next.delete(id); else next.add(id);
      return { ...prev, favorites: next };
    });
  }, []);

  const isFavorite = useCallback((id: string) => state.favorites.has(id), [state.favorites]);

  const addAlert = useCallback((name: string) => {
    setState(prev => ({ ...prev, alerts: [...new Set([...prev.alerts, name])] }));
  }, []);

  const removeAlert = useCallback((name: string) => {
    setState(prev => ({ ...prev, alerts: prev.alerts.filter(a => a !== name) }));
  }, []);

  const addPartRequest = useCallback((req: Omit<PartRequest, "id" | "createdAt" | "responses">) => {
    setState(prev => ({
      ...prev,
      partRequests: [{ ...req, id: `req_${Date.now()}`, createdAt: new Date().toLocaleDateString("pt-BR"), responses: 0 }, ...prev.partRequests],
    }));
  }, []);

  const login = useCallback((name: string, email: string) => {
    const user: UserAccount = {
      id: "u1", name, email, location: "RS - Brasil",
      description: "Entusiasta automotivo", isPro: false,
      rating: 4.8, sales: 0, joinedAt: new Date().toLocaleDateString("pt-BR"),
    };
    setState(prev => ({ ...prev, user, isLoggedIn: true }));
  }, []);

  const logout = useCallback(() => {
    setState(prev => ({ ...prev, user: null, isLoggedIn: false }));
  }, []);

  const subscribePremium = useCallback(() => {
    setState(prev => prev.user ? { ...prev, user: { ...prev.user, isPro: true } } : prev);
  }, []);

  const getSellerProducts = useCallback((sellerId: string) => {
    return state.products.filter(p => p.sellerId === sellerId);
  }, [state.products]);

  return (
    <StoreContext.Provider value={{ ...state, addProduct, boostProduct, toggleFavorite, isFavorite, addAlert, removeAlert, addPartRequest, login, logout, subscribePremium, getSellerProducts }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be inside StoreProvider");
  return ctx;
};
