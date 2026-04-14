import { Search } from "lucide-react";
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
        .from("products") // ✅ PADRONIZADO
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar produtos:", error);
        setLoading(false);
        return;
      }

      const formatted = (data || []).map((item) => ({
        id: item.id,
        title: item.title ?? item.titulo,
        price: item.price ?? item.preco,
        category: item.category ?? item.categoria,
        carFilter: item.car_filter
          ? item.car_filter
          : [item.modelo_veiculo || "Geral"],
        status: item.is_pro || item.destaque ? "patrocinado" : "normal",
      }));

      setProducts(formatted);
      setLoading(false);
    }

    fetchProducts();
  }, [location.state?.refresh]); // ✅ refresh funcionando

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();

    const matchSearch =
      p.title?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.carFilter?.some((c: string) => c.toLowerCase().includes(q));

    const matchCar =
      activeCar === "Todos" || p.carFilter.includes(activeCar);

    return matchSearch && matchCar;
  });

  const sponsored = filtered.filter((p) => p.status === "patrocinado");
  const recent = filtered.filter((p) => p.status !== "patrocinado");

  if (loading) {
    return <p className="p-5">Carregando...</p>;
  }

  return (
    <div className="min-h-screen pb-28">
      <header className="sticky top-0 z-40 glass-strong border-b border-border/30 px-5 pb-3 pt-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Marketplace
            </p>
            <h1 className="text-[24px] font-black tracking-tight text-gradient leading-tight">
              GearHub
            </h1>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-xl surface text-xs font-black text-primary">
            ⚙️
          </div>
        </div>

        <div className="relative">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Buscar peças, marcas, modelos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl surface py-3 pl-10 pr-4 text-[13px] font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
          />
        </div>
      </header>

      <div className="px-5 pt-3">
        <div className="flex gap-2 overflow-x-auto pb-3 -mx-5 px-5 scrollbar-none">
          {carFilters.map((car) => (
            <button
              key={car}
              onClick={() => setActiveCar(car)}
              className={`shrink-0 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 active:scale-95 ${
                activeCar === car
                  ? "bg-primary text-primary-foreground glow-primary"
                  : "surface text-muted-foreground hover:text-foreground"
              }`}
            >
              {car}
            </button>
          ))}
        </div>

        {/* Patrocinados */}
        {sponsored.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-3 mt-2">
              <h2 className="text-[15px] font-bold text-foreground">
                🔥 Patrocinados
              </h2>
              <span className="text-[11px] font-medium text-muted-foreground">
                {sponsored.length} itens
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              {sponsored.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={i}
                  showBadge="patrocinado"
                />
              ))}
            </div>
          </>
        )}

        {/* Recentes */}
        <div className="flex items-center justify-between mb-3 mt-2">
          <h2 className="text-[15px] font-bold text-foreground">
            📦 Recentes
          </h2>
          <span className="text-[11px] font-medium text-muted-foreground">
            {recent.length} itens
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {recent.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-16 flex flex-col items-center text-center">
            <Search size={44} className="text-muted-foreground/20 mb-3" />
            <p className="text-sm font-semibold text-muted-foreground">
              Nenhuma peça encontrada
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Tente outro filtro ou termo de busca
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;