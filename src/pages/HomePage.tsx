import { Search, Zap, Package, Loader2, SlidersHorizontal } from "lucide-react";
import { useState, useEffect } from "react";
import { carFilters } from "@/data/mockData";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/lib/supabase";
import { useLocation } from "react-router-dom";

const HomePage = () => {
  const [search, setSearch] = useState("");
  const [activeCar, setActiveCar] = useState("Todos");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      console.log("🛠️ Buscando produtos e checando status PRO...");

      try {
        // 1. Busca os produtos
        const { data: productsData, error: prodError } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (prodError) throw prodError;

        // 2. Busca todos os perfis que são PRO para comparar
        const { data: proProfiles, error: profileError } = await supabase
          .from("profiles")
          .select("id")
          .eq("account_status", "pro");

        if (profileError) throw profileError;

        // Criamos um Set com os IDs dos vendedores PRO para busca rápida
        const proSellerIds = new Set(proProfiles?.map(p => p.id));

        const formatted = (productsData || []).map((item: any) => ({
          ...item,
          title: item.title || item.titulo || "Sem Título",
          price: Number(item.price || item.preco || 0),
          category: item.category || item.categoria,
          image: item.image || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80",
          carFilter: Array.isArray(item.compatibility) 
            ? item.compatibility 
            : item.compatibility 
              ? [item.compatibility.replace(/[\[\]"']/g, '')] 
              : ["Universal"],
          // Checa se o seller_id do produto está na nossa lista de PROs
          status: proSellerIds.has(item.seller_id) ? "patrocinado" : "normal",
        }));

        setProducts(formatted);
      } catch (err) {
        console.error("❌ Erro ao carregar Home:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [location.state?.refresh]);

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      p.title?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q);

    const matchCar =
      activeCar === "Todos" || p.carFilter.some((c: string) => c.includes(activeCar));

    return matchSearch && matchCar;
  });

  const sponsored = filtered.filter((p) => p.status === "patrocinado");
  const recent = filtered.filter((p) => p.status !== "patrocinado");

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#ccff00]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-28 text-white">
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5 px-5 pb-4 pt-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">Performance Marketplace</p>
            <h1 className="text-[28px] font-black tracking-tighter text-white italic leading-tight">
              GEAR<span className="text-[#ccff00]">HUB</span>
            </h1>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-900 border border-white/10 shadow-[0_0_15px_rgba(204,255,0,0.05)]">
            <SlidersHorizontal size={18} className="text-[#ccff00]" />
          </div>
        </div>

        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar peças, marcas, modelos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl bg-zinc-900/80 border border-white/5 py-4 pl-12 pr-4 text-[14px] font-bold text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#ccff00]/50 transition-all"
          />
        </div>
      </header>

      <div className="px-5 pt-4">
        {/* FILTROS */}
        <div className="flex gap-2.5 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-none">
          {carFilters.map((car) => (
            <button
              key={car}
              onClick={() => setActiveCar(car)}
              className={`shrink-0 rounded-xl px-5 py-2.5 text-[11px] font-black uppercase italic transition-all border ${
                activeCar === car
                  ? "bg-[#ccff00] text-black border-[#ccff00] shadow-[0_5px_15px_rgba(204,255,0,0.2)]"
                  : "bg-zinc-900 text-zinc-500 border-white/5"
              }`}
            >
              {car}
            </button>
          ))}
        </div>

        {/* ANÚNCIOS TURBO */}
        {sponsored.length > 0 && (
          <div className="mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={16} className="text-[#ccff00] fill-[#ccff00]" />
              <h2 className="text-[11px] font-black text-white uppercase tracking-[0.2em] italic">Anúncios Turbo</h2>
              <div className="h-[1px] flex-1 bg-zinc-800/50 ml-2"></div>
            </div>
            <div className="grid grid-cols-2 gap-3.5 mb-8">
              {sponsored.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} showBadge="patrocinado" />
              ))}
            </div>
          </div>
        )}

        {/* FEED RECENTE */}
        <div className="mt-2">
          <div className="flex items-center gap-2 mb-4">
            <Package size={16} className="text-zinc-500" />
            <h2 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] italic">Feed Recente</h2>
            <div className="h-[1px] flex-1 bg-zinc-800/50 ml-2"></div>
          </div>
          <div className="grid grid-cols-2 gap-3.5">
            {recent.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="mt-24 flex flex-col items-center text-center px-10">
            <Search size={32} className="text-zinc-800 mb-4" />
            <p className="text-lg font-black text-white uppercase italic">Nada no radar</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;