import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { StoreProvider } from "@/hooks/useStore";
import BottomNav from "@/components/BottomNav";
import HomePage from "./pages/HomePage";
import ProductDetail from "./pages/ProductDetail";
import FavoritesPage from "./pages/FavoritesPage";
import AdvertisePage from "./pages/AdvertisePage";
import ChatPage from "./pages/ChatPage";
import ProfilePage from "./pages/ProfilePage";
import PremiumPage from "./pages/PremiumPage";
import LoginPage from "./pages/LoginPage";
import PartRequestPage from "./pages/PartRequestPage";
import SellerStorePage from "./pages/SellerStorePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <StoreProvider>
        <Sonner position="top-center" expand={false} richColors />
        
        {/* Configuração do Router com o basename solicitado */}
        <BrowserRouter basename="/gearhubmkt">
          <div className="mx-auto max-w-md min-h-screen relative bg-black">
            <Routes>
              {/* Rotas Principais */}
              <Route path="/" element={<HomePage />} />
              <Route path="/produto/:id" element={<ProductDetail />} />
              <Route path="/favoritos" element={<FavoritesPage />} />
              <Route path="/anunciar" element={<AdvertisePage />} />
              
              {/* Rotas de Chat (O ChatPage gerencia a troca de lista para conversa) */}
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/chat/:threadId" element={<ChatPage />} />
              
              {/* Perfil e Negócios */}
              <Route path="/perfil" element={<ProfilePage />} />
              <Route path="/premium" element={<PremiumPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/procurar-peca" element={<PartRequestPage />} />
              <Route path="/loja/:sellerId" element={<SellerStorePage />} />
              
              {/* Fallback 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>

            {/* Navegação Inferior Fixa */}
            <BottomNav />
          </div>
        </BrowserRouter>
      </StoreProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;