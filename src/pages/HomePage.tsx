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

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar produtos:", error);
        setLoading(false);
        return;
      }

      const formatted = (data || []).map((item) => ({
        ...item,
        id: item.id,
        title: item.title ?? item.titulo,
        price: Number(item.price ?? item.preco),
        category: item.category ?? item.categoria,
        image: item.image || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80",
        carFilter: Array.isArray(item.compatibility) 
          ? item.compatibility 
          : item.compatibility 
            ? [item.compatibility.replace(/[\[\]"']/g, '')] 
            : ["Universal"],
        status: item.is_pro ? "patrocinado" : "normal",
      }));

      setProducts(formatted);
      setLoading(false);
    }

    fetchProducts();
  }, [location.state?.refresh]);

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      p.title?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.carFilter?.some((c: string) => c.toLowerCase().includes(q));

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
      {/* HEADER ESTILIZADO */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5 px-5 pb-4 pt-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">
              Performance Marketplace
            </p>
            <h1 className="text-[28px] font-black tracking-tighter text-white italic leading-tight">
              GEAR<span className="text-[#ccff00]">HUB</span>
            </h1>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-900 border border-white/10 shadow-[0_0_15px_rgba(204,255,0,0.05)]">
            <SlidersHorizontal size={18} className="text-[#ccff00]" />
          </div>
        </div>

        {/* BUSCA ESTILO DASHBOARD */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
          />
          <input
            type="text"
            placeholder="Buscar peças, marcas, modelos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl bg-zinc-900/80 border border-white/5 py-4 pl-12 pr-4 text-[14px] font-bold text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#ccff00]/50 focus:ring-1 focus:ring-[#ccff00]/20 transition-all shadow-inner"
          />
        </div>
      </header>

      <div className="px-5 pt-4">
        {/* FILTROS DE CATEGORIA/CARRO */}
        <div className="flex gap-2.5 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-none">
          {carFilters.map((car) => (
            <button
              key={car}
              onClick={() => setActiveCar(car)}
              className={`shrink-0 rounded-xl px-5 py-2.5 text-[11px] font-black uppercase italic transition-all duration-200 active:scale-95 border ${
                activeCar === car
                  ? "bg-[#ccff00] text-black border-[#ccff00] shadow-[0_5px_15px_rgba(204,255,0,0.2)]"
                  : "bg-zinc-900 text-zinc-500 border-white/5 hover:border-white/10"
              }`}
            >
              {car}
            </button>
          ))}
        </div>

        {/* SEÇÃO PATROCINADOS (TURBO) */}
        {sponsored.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={16} className="text-[#ccff00] fill-[#ccff00]" />
              <h2 className="text-[11px] font-black text-white uppercase tracking-[0.2em] italic">
                Anúncios Turbo
              </h2>
              <div className="h-[1px] flex-1 bg-zinc-800/50 ml-2"></div>
            </div>

            <div className="grid grid-cols-2 gap-3.5 mb-8">
              {sponsored.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={i}
                  showBadge="patrocinado"
                />
              ))}
            </div>
          </div>
        )}

        {/* SEÇÃO RECENTES */}
        <div className="mt-2">
          <div className="flex items-center gap-2 mb-4">
            <Package size={16} className="text-zinc-500" />
            <h2 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] italic">
              Feed Recente
            </h2>
            <div className="h-[1px] flex-1 bg-zinc-800/50 ml-2"></div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            {recent.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>

        {/* EMPTY STATE */}
        {filtered.length === 0 && (
          <div className="mt-24 flex flex-col items-center text-center px-10">
            <div className="h-20 w-20 rounded-full bg-zinc-900 flex items-center justify-center mb-6 border border-white/5">
              <Search size={32} className="text-zinc-700" />
            </div>
            <p className="text-lg font-black text-white uppercase italic italic">
              Nada no radar
            </p>
            <p className="text-xs text-zinc-500 mt-2 font-medium leading-relaxed">
              Não encontramos peças para "{search}". <br />
              Tente simplificar os termos ou mudar o filtro.
            </p>
            <button 
              onClick={() => {setSearch(""); setActiveCar("Todos")}}
              className="mt-6 text-[10px] font-black text-[#ccff00] uppercase tracking-widest border border-[#ccff00]/20 px-4 py-2 rounded-lg"
            >
              Resetar Filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;