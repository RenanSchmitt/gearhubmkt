import {
  ArrowLeft,
  Star,
  MessageCircle,
  Share2,
  Heart,
  ShieldCheck,
  Zap,
  Truck,
  Bell,
  Edit3,
  Loader2,
  Package,
  Eye,
  Settings2
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { sellers } from "@/data/mockData";
import { useStore } from "@/hooks/useStore";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite, boostProduct } = useStore();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    async function getInitialData() {
      setLoading(true);

      // 1. Pega o usuário logado para controle de dono
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) setCurrentUserId(authUser.id);

      // 2. Busca os dados do produto no banco
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        toast.error("Erro ao carregar dados do anúncio.");
        setLoading(false);
        return;
      }

      // 3. Formata os dados vindos do banco
      setProduct({
        ...data,
        sellerId: String(data.seller_id),
        title: data.title || "Peça sem título",
        price: Number(data.price) || 0,
        image: data.image || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80",
        category: data.category || "Performance",
        views: data.views || 0,
        delivery: data.delivery || "A combinar com vendedor",
        description: data.description || "O vendedor não forneceu uma descrição detalhada.",
        // Lógica para transformar string ou array do banco em array funcional
        compatibility: Array.isArray(data.compatibility)
          ? data.compatibility
          : data.compatibility
            ? [data.compatibility]
            : []
      });

      setLoading(false);
    }

    if (id) getInitialData();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 size={32} className="animate-spin text-[#ccff00]" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white font-black italic uppercase">
      Anúncio não encontrado
    </div>
  );

  const isOwner = currentUserId === product.sellerId;
  const fav = isFavorite(product.id);
  const seller = sellers.find((s) => s.id === product.sellerId);
  console.log(seller);
  return (
    <div className="min-h-screen bg-black pb-40 text-white font-sans">
      {/* HEADER */}
      <div className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-4 pt-4">
        <button onClick={() => navigate(-1)} className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 active:scale-95 transition-all">
          <ArrowLeft size={20} className="text-white" />
        </button>
        <button className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 active:scale-95">
          <Share2 size={18} className="text-white" />
        </button>
      </div>

      {/* GALERIA */}
      <div className="aspect-square w-full bg-zinc-900 border-b border-white/5">
        <img src={product.image} alt={product.title} className="h-full w-full object-cover" />
      </div>

      {/* CONTEÚDO */}
      <div className="relative -mt-10 rounded-t-[40px] bg-black px-6 pt-10 space-y-8 border-t border-[#ccff00]/10 shadow-[0_-30px_60px_rgba(0,0,0,0.9)]">

        {/* CABEÇALHO DE PREÇO */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-black uppercase italic leading-[1.1] tracking-tighter text-white">
              {product.title}
            </h1>
            {product.is_pro && (
              <span className="shrink-0 rounded-lg bg-[#ccff00]/10 border border-[#ccff00]/20 px-2.5 py-1 text-[10px] font-black text-[#ccff00] shadow-[0_0_15px_rgba(204,255,0,0.1)]">PRO</span>
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-[#ccff00] italic">R$</span>
            <span className="text-[42px] font-black text-[#ccff00] tracking-tighter italic leading-none">
              {product.price.toLocaleString("pt-BR")}
            </span>
          </div>
        </div>

        {/* INFO GRID DINÂMICO */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 rounded-[22px] bg-zinc-900/50 border border-white/5 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 text-[#ccff00]">
              <Package size={20} />
            </div>
            <div className="overflow-hidden">
              <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Categoria</p>
              <p className="text-[12px] font-black uppercase italic truncate">{product.category}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-[22px] bg-zinc-900/50 border border-white/5 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 text-[#ccff00]">
              <Eye size={20} />
            </div>
            <div>
              <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Acessos</p>
              <p className="text-[12px] font-black uppercase italic">{product.views}</p>
            </div>
          </div>
        </div>

        {/* LOGÍSTICA */}
        <div className="flex items-center gap-4 rounded-[22px] bg-[#1A1A1A] border border-white/5 p-5">
          <div className="h-12 w-12 rounded-2xl bg-[#ccff00]/10 flex items-center justify-center">
            <Truck size={24} className="text-[#ccff00]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Envio e Retirada</span>
            <span className="text-[14px] font-black text-white italic uppercase">{product.delivery}</span>
          </div>
        </div>

        {/* COMPATIBILIDADE DINÂMICA LIMPA */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Compatibilidade</h2>
            <div className="h-[1px] flex-1 bg-zinc-900 ml-4"></div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {product.compatibility && product.compatibility.length > 0 && product.compatibility[0].toLowerCase() !== "universal" ? (
              product.compatibility.map((c: string, index: number) => {
                // Limpeza extra para garantir que não restem aspas na renderização
                const cleanText = c.replace(/[\[\]"']/g, '').trim();
                if (!cleanText) return null;

                return (
                  <div key={index} className="flex items-center gap-2.5 rounded-full bg-zinc-900 border border-white/10 px-4 py-2.5">
                    <ShieldCheck size={14} className="text-[#ccff00]" />
                    <span className="text-[11px] font-black text-white uppercase italic tracking-tighter">
                      {cleanText}
                    </span>
                  </div>
                );
              })
            ) : (
              /* ESTILO UNIVERSAL */
              <div className="flex items-center gap-3 rounded-2xl bg-[#ccff00]/5 border border-[#ccff00]/20 px-5 py-4 w-full">
                <Zap size={20} className="text-[#ccff00] fill-[#ccff00]/20" />
                <span className="text-[13px] font-black text-[#ccff00] uppercase italic tracking-[0.1em]">
                  Fitment Universal
                </span>
              </div>
            )}
          </div>
        </div>

        {/* DESCRIÇÃO */}
        <div className="space-y-3">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Descrição Técnica</h2>
          <p className="text-[15px] leading-relaxed text-zinc-400 font-medium bg-zinc-900/30 p-4 rounded-2xl border border-white/5">
            {product.description}
          </p>
        </div>

        {/* BOTÕES DE AÇÃO (DONO VS COMPRADOR) */}
        <div className="space-y-4 pt-4">
          {isOwner ? (
            <div className="flex flex-col gap-3">
              <button
                onClick={() => { boostProduct(product.id); toast.success("⚡ Turbo ativado!"); }}
                className="flex w-full items-center justify-center gap-3 rounded-[24px] bg-[#ccff00] py-5 shadow-[0_15px_35px_rgba(204,255,0,0.2)] active:scale-[0.98] transition-all"
              >
                <Zap size={20} className="text-black fill-black" />
                <span className="text-[15px] font-black text-black uppercase tracking-widest italic">Impulsionar Anúncio</span>
              </button>
              <button className="flex w-full items-center justify-center gap-3 rounded-[24px] bg-zinc-900 py-5 border border-zinc-800 text-white text-[14px] font-black uppercase tracking-widest active:bg-zinc-800 transition-all">
                <Edit3 size={18} className="text-[#ccff00]" />
                Editar Detalhes
              </button>
            </div>
          ) : (
            <button
              className="flex w-full items-center justify-center gap-3 rounded-[24px] bg-zinc-900 py-5 border border-white/5 active:scale-[0.98] transition-all"
            >
              <Bell size={18} className="text-[#ccff00]" />
              <span className="text-[14px] font-black text-white uppercase tracking-widest">Criar alerta similar</span>
            </button>
          )}
        </div>

        {/* CARD DO VENDEDOR */}
        {!isOwner && (
          <div className="flex w-full items-center gap-4 rounded-[32px] bg-zinc-900 p-6 border border-white/5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ccff00] text-black font-black text-xl italic shadow-[0_0_20px_rgba(204,255,0,0.15)]">
              {seller?.name.charAt(0) || "U"}
            </div>
            <div className="flex-1">
              <p className="text-[16px] font-black text-white uppercase italic tracking-tight">{seller?.name || "Piloto GearHub"}</p>
              <div className="flex items-center gap-3 mt-1.5">
                <div className="flex items-center gap-1 bg-black/50 px-2.5 py-1 rounded-lg border border-white/5 text-[#ccff00]">
                  <Star size={12} className="fill-[#ccff00]" />
                  <span className="text-[12px] font-black">{seller?.rating || "5.0"}</span>
                </div>
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">• {seller?.sales || "0"} vendas</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER FIXO (SÓ PARA COMPRADORES) */}
      {!isOwner && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-2xl border-t border-white/5 px-6 pb-10 pt-5">
          <div className="mx-auto flex max-w-md gap-4">
            <button
              onClick={() => toggleFavorite(product.id)}
              className={`flex h-[65px] w-[65px] shrink-0 items-center justify-center rounded-[24px] border transition-all active:scale-90 ${fav ? "border-[#ccff00]/30 bg-[#ccff00]/10" : "border-white/10 bg-zinc-900"
                }`}
            >
              <Heart size={28} className={fav ? "fill-[#ccff00] text-[#ccff00]" : "text-zinc-500"} />
            </button>
            <button
              onClick={() => navigate("/chat")}
              className="flex flex-1 items-center justify-center gap-3 rounded-[24px] bg-[#ccff00] py-4 font-black text-[17px] text-black shadow-[0_15px_35px_rgba(204,255,0,0.3)] uppercase tracking-widest italic"
            >
              <MessageCircle size={24} />
              Falar com vendedor
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;