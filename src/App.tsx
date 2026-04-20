import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { StoreProvider } from "@/hooks/useStore";
import BottomNav from "@/components/BottomNav";

// Imports das Páginas
import HomePage from "./pages/HomePage";
import ProductDetail from "./pages/ProductDetail";
import FavoritesPage from "./pages/FavoritesPage";
import AdvertisePage from "./pages/AdvertisePage";
import EditAdvertisePage from "./pages/EditAdvertisePage"; 
import ChatPage from "./pages/ChatPage";
import ProfilePage from "./pages/ProfilePage";
import EditProfile from "./pages/EditProfile"; // Import da nova página
import PublicProfile from "./pages/PublicProfile";
import PremiumPage from "./pages/PremiumPage";
import LoginPage from "./pages/LoginPage";
import PartRequestPage from "./pages/PartRequestPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <StoreProvider>
        <Sonner position="top-center" expand={false} richColors />
        
        <Router>
          <div className="mx-auto max-w-md min-h-screen relative bg-black">
            <Routes>
              {/* Rotas Principais */}
              <Route path="/" element={<HomePage />} />
              <Route path="/produto/:id" element={<ProductDetail />} />
              <Route path="/favoritos" element={<FavoritesPage />} />
              <Route path="/anunciar" element={<AdvertisePage />} />
              
              {/* Rota de Edição de Anúncio */}
              <Route path="/editar-anuncio/:id" element={<EditAdvertisePage />} />
              
              {/* Rotas de Chat */}
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/chat/:threadId" element={<ChatPage />} />
              
              {/* Perfil e Negócios */}
              <Route path="/perfil" element={<ProfilePage />} />
              <Route path="/editar-perfil" element={<EditProfile />} /> {/* Nova Rota de Edição de Perfil */}
              <Route path="/vendedor/:vendedorId" element={<PublicProfile />} />
              <Route path="/premium" element={<PremiumPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/procurar-peca" element={<PartRequestPage />} />
              
              {/* Fallback 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>

            {/* Navegação Inferior Fixa */}
            <BottomNav />
          </div>
        </Router>
      </StoreProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;