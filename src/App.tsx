import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
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

// Esta constante resolve o problema do localhost e do deploy ao mesmo tempo
const basename = import.meta.env.DEV ? "/" : "/gearhubmkt";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <StoreProvider>
        <Sonner />
        {/* O basename dinâmico permite que funcione no seu PC e no site oficial */}
        <Router basename={basename}>
          <div className="mx-auto max-w-md min-h-screen relative">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/produto/:id" element={<ProductDetail />} />
              <Route path="/favoritos" element={<FavoritesPage />} />
              <Route path="/anunciar" element={<AdvertisePage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/chat/:threadId" element={<ChatPage />} />
              <Route path="/perfil" element={<ProfilePage />} />
              <Route path="/premium" element={<PremiumPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/procurar-peca" element={<PartRequestPage />} />
              <Route path="/loja/:sellerId" element={<SellerStorePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNav />
          </div>
        </Router>
      </StoreProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;