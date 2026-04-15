import { Heart } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import ProductCard from "@/components/ProductCard";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const FavoritesPage = () => {
  const { favorites } = useStore();
  const [favProducts, setFavProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFavorites() {
      // 1. Pegamos os IDs do seu Store (Zustand)
      const allIds = Array.from(favorites);

      // 2. Filtramos para enviar ao Supabase APENAS o que for UUID válido
      // Isso evita o erro "invalid input syntax for type uuid" causado pelo seu "p1"
      const validUuidIds = allIds.filter(id => 
        typeof id === 'string' && 
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
      );

      console.log("IDs filtrados (apenas UUIDs válidos):", validUuidIds);

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
  }, [favorites]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#00FF85]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 px-5 pt-6 bg-[#0B0B0B]">
      <header className="mb-6">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00FF85]/60 text-center sm:text-left">Sua Garagem</p>
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
            <Heart size={32} className="text-gray-800" />
          </div>
          <p className="text-[16px] font-black text-white uppercase italic">Vazio por aqui</p>
          <p className="text-xs text-gray-500 mt-2 max-w-[220px] leading-relaxed">
            Sua lista de desejos está pedindo peças novas. Favorite anúncios reais para vê-los aqui.
          </p>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;