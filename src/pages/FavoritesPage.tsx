import { Heart } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import ProductCard from "@/components/ProductCard";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom"; // Importante para o redirecionamento

const FavoritesPage = () => {
  const { favorites } = useStore();
  const [favProducts, setFavProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true); // Trava inicial de segurança
  const navigate = useNavigate();

  // --- 1. BLOQUEIO DE ACESSO ---
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Se não encontrar usuário, joga pro login e substitui o histórico
        navigate("/login", { replace: true });
      } else {
        // Usuário OK, libera para carregar o conteúdo
        setAuthLoading(false);
      }
    };
    checkUser();
  }, [navigate]);

  // --- 2. BUSCA DE FAVORITOS (Só roda se authLoading for false) ---
  useEffect(() => {
    if (authLoading) return;

    async function fetchFavorites() {
      const allIds = Array.from(favorites);
      const validUuidIds = allIds.filter(id => 
        typeof id === 'string' && 
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
      );

      if (validUuidIds.length === 0) {
        setFavProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .in("id", validUuidIds);

        if (error) throw error;
        setFavProducts(data || []);
      } catch (err) {
        console.error("Erro ao buscar favoritos:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, [favorites, authLoading]); // Agora depende também do authLoading

  // Enquanto estiver checando o login, renderiza vazio para não dar "flash" de conteúdo
  if (authLoading) {
    return <div className="min-h-screen bg-[#0B0B0B]" />;
  }

  // Loader de carregamento dos dados (após estar logado)
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#ccff00]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 px-5 pt-6 bg-[#0B0B0B]">
      <header className="mb-6">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ccff00]/60 text-center sm:text-left">Sua Garagem</p>
        <h1 className="text-2xl font-black tracking-tight text-white italic uppercase text-center sm:text-left">Favoritos</h1>
      </header>

      {favProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {favProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      ) : (
        <div className="mt-24 flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-[#1A1A1A] border border-white/5 mb-5 shadow-inner">
            <Heart size={32} className="text-zinc-800" />
          </div>
          <p className="text-[16px] font-black text-white uppercase italic">Vazio por aqui</p>
          <p className="text-xs text-zinc-500 mt-2 max-w-[220px] leading-relaxed uppercase font-bold italic">
            Sua lista de desejos está pedindo peças novas.
          </p>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;