import {
  ArrowLeft, Star, MessageCircle, Share2, Heart, ShieldCheck, Zap,
  Truck, Bell, Edit3, Loader2, Package, Eye, Trash2, Crown, ChevronRight
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
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
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // --- LÓGICA DE EXCLUSÃO ---
  const handleDeleteProduct = async () => {
    const confirmDelete = window.confirm(
      "TEM CERTEZA? \n\nIsso apagará o anúncio, a foto e todas as conversas vinculadas permanentemente!"
    );

    if (!confirmDelete) return;

    try {
      setDeleteLoading(true);

      if (product.image && !product.image.includes('unsplash')) {
        const urlParts = product.image.split('/');
        let fileName = urlParts[urlParts.length - 1].split('?')[0];
        
        if (fileName) {
          const { error: storageError } = await supabase.storage
            .from('pecas')
            .remove([fileName]);
          
          if (storageError) console.error("Erro ao limpar imagem do Storage:", storageError);
        }
      }

      const { error: msgError } = await supabase
        .from('messages')
        .delete()
        .like('thread_id', `${id}%`);

      if (msgError) console.error("Aviso: Falha ao limpar mensagens:", msgError);

      const { error: productError } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (productError) throw productError;

      toast.success("ANÚNCIO REMOVIDO! 🗑️");
      navigate("/perfil", { replace: true });
    } catch (err: any) {
      toast.error("Erro ao excluir: " + err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleStartChat = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Acelera! Faça login para negociar.");
        return navigate("/login");
      }
      if (user.id === product.seller_id) {
        toast.error("Você é o dono deste anúncio!");
        return;
      }
      const threadId = `${product.id}_${user.id}`;
      navigate(`/chat/${threadId}`);
    } catch (error) {
      console.error("Erro ao iniciar chat:", error);
      toast.error("Falha ao abrir o chat.");
    }
  };

  useEffect(() => {
    async function getInitialData() {
      try {
        setLoading(true);
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) setCurrentUserId(authUser.id);

        const { data: productData, error: productError } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (productError || !productData) throw new Error("Produto não encontrado");

        let sellerInfo = null;
        if (productData.seller_id) {
          const { data: sellerData } = await supabase
            .from("profiles")
            .select("*") 
            .eq("id", productData.seller_id)
            .maybeSingle();
          sellerInfo = sellerData;
        }

        const isSellerPro = sellerInfo?.account_status?.toLowerCase() === 'pro';

        setProduct({
          ...productData,
          sellerId: String(productData.seller_id),
          sellerName: sellerInfo?.nome || sellerInfo?.name || sellerInfo?.username || "Piloto GearHub",
          sellerRating: sellerInfo?.rating || "5.0",
          sellerSales: sellerInfo?.sales || "0",
          isSellerPro: isSellerPro,
          title: productData.title || "Peça sem título",
          price: Number(productData.price) || 0,
          image: productData.image || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80",
          category: productData.category || "Performance",
          views: productData.views || 0,
          delivery: productData.delivery || "A combinar",
          description: productData.description || "O vendedor não forneceu uma descrição.",
          compatibility: Array.isArray(productData.compatibility)
            ? productData.compatibility
            : productData.compatibility ? [productData.compatibility] : []
        });

      } catch (err) {
        toast.error("Erro ao carregar anúncio.");
      } finally {
        setLoading(false);
      }
    }
    if (id) getInitialData();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 size={32} className="animate-spin text-[#ccff00]" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white font-black italic uppercase p-10 text-center">
      Anúncio não encontrado
    </div>
  );

  const isOwner = currentUserId === product.seller_id;
  const fav = isFavorite(product.id);

  return (
    <div className="min-h-screen bg-black pb-40 text-white font-sans">
      {/* HEADER FIXO */}
      <div className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-4 pt-4">
        <button onClick={() => navigate(-1)} className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 active:scale-95 transition-all">
          <ArrowLeft size={20} />
        </button>

        {product.isSellerPro && (
          <div className="flex items-center gap-1.5 bg-[#ccff00] px-3 py-1.5 rounded-full shadow-[0_0_20px_rgba(204,255,0,0.3)] animate-pulse">
            <Crown size={12} className="text-black fill-black" />
            <span className="text-[10px] font-black text-black uppercase italic tracking-wider">Vendedor Pro</span>
          </div>
        )}

        <button className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 active:scale-95">
          <Share2 size={18} />
        </button>
      </div>

      <div className="aspect-square w-full bg-zinc-900 border-b border-white/5">
        <img src={product.image} alt={product.title} className="h-full w-full object-cover" />
      </div>

      <div className="relative -mt-10 rounded-t-[40px] bg-black px-6 pt-10 space-y-8 border-t border-[#ccff00]/10 shadow-[0_-30px_60px_rgba(0,0,0,0.9)]">
        
        {/* TITULO E PREÇO */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              {product.isSellerPro && (
                <span className="text-[10px] font-black text-[#ccff00] uppercase tracking-[0.2em] italic">Anúncio Verificado</span>
              )}
              <h1 className="text-2xl font-black uppercase italic leading-[1.1] tracking-tighter">
                {product.title}
              </h1>
            </div>
            {product.isSellerPro && (
              <div className="bg-[#ccff00]/10 border border-[#ccff00]/20 p-2 rounded-xl">
                <ShieldCheck size={20} className="text-[#ccff00]" />
              </div>
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-[#ccff00] italic">R$</span>
            <span className="text-[42px] font-black text-[#ccff00] tracking-tighter italic leading-none">
              {product.price.toLocaleString("pt-BR")}
            </span>
          </div>
        </div>

        {/* GRID INFO */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 rounded-[22px] bg-zinc-900/50 border border-white/5 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 text-[#ccff00]"><Package size={20} /></div>
            <div className="overflow-hidden">
              <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Categoria</p>
              <p className="text-[12px] font-black uppercase italic truncate">{product.category}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-[22px] bg-zinc-900/50 border border-white/5 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 text-[#ccff00]"><Eye size={20} /></div>
            <div>
              <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Acessos</p>
              <p className="text-[12px] font-black uppercase italic">{product.views}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-[22px] bg-[#1A1A1A] border border-white/5 p-5">
          <div className="h-12 w-12 rounded-2xl bg-[#ccff00]/10 flex items-center justify-center"><Truck size={24} className="text-[#ccff00]" /></div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Logística</span>
            <span className="text-[14px] font-black text-white italic uppercase">{product.delivery}</span>
          </div>
        </div>

        {/* COMPATIBILIDADE */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Compatibilidade</h2>
            <div className="h-[1px] flex-1 bg-zinc-900 ml-4"></div>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {product.compatibility && product.compatibility.length > 0 && String(product.compatibility[0]).toLowerCase() !== "universal" ? (
              product.compatibility.map((c: string, index: number) => {
                const cleanText = String(c).replace(/[\[\]"']/g, '').trim();
                return cleanText ? (
                  <div key={index} className="flex items-center gap-2.5 rounded-full bg-zinc-900 border border-white/10 px-4 py-2.5">
                    <ShieldCheck size={14} className="text-[#ccff00]" />
                    <span className="text-[11px] font-black text-white uppercase italic tracking-tighter">{cleanText}</span>
                  </div>
                ) : null;
              })
            ) : (
              <div className="flex items-center gap-3 rounded-2xl bg-[#ccff00]/5 border border-[#ccff00]/20 px-5 py-4 w-full">
                <Zap size={20} className="text-[#ccff00] fill-[#ccff00]/20" />
                <span className="text-[13px] font-black text-[#ccff00] uppercase italic tracking-[0.1em]">Fitment Universal</span>
              </div>
            )}
          </div>
        </div>

        {/* DESCRIÇÃO */}
        <div className="space-y-3">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Descrição Técnica</h2>
          <div className="text-[15px] leading-relaxed text-zinc-400 font-medium bg-zinc-900/30 p-4 rounded-2xl border border-white/5 whitespace-pre-wrap">
            {product.description}
          </div>
        </div>

        {/* AÇÕES DO DONO */}
        <div className="space-y-4 pt-4">
          {isOwner && (
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => { boostProduct(product.id); toast.success("⚡ Turbo ativado!"); }} 
                className="flex w-full items-center justify-center gap-3 rounded-[24px] bg-[#ccff00] py-5 shadow-[0_15px_35px_rgba(204,255,0,0.2)] active:scale-[0.98] transition-transform"
              >
                <Zap size={20} className="text-black fill-black" />
                <span className="text-[15px] font-black text-black uppercase tracking-widest italic">Impulsionar Anúncio</span>
              </button>

              <button 
                onClick={() => navigate(`/editar-anuncio/${product.id}`)}
                className="flex w-full items-center justify-center gap-3 rounded-[24px] bg-zinc-900 py-5 border border-zinc-800 text-white text-[14px] font-black uppercase tracking-widest active:scale-[0.98] transition-transform"
              >
                <Edit3 size={18} className="text-[#ccff00]" /> 
                Editar Detalhes
              </button>

              <button 
                onClick={handleDeleteProduct}
                disabled={deleteLoading}
                className="flex w-full items-center justify-center gap-3 rounded-[24px] bg-red-950/20 py-4 border border-red-900/30 text-red-500 text-[12px] font-black uppercase tracking-widest active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {deleteLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <><Trash2 size={16} /> Remover Anúncio</>
                )}
              </button>
            </div>
          )}
        </div>

        {/* CARD DO VENDEDOR (COM LINK PARA PERFIL PÚBLICO) */}
        {!isOwner && (
          <div 
            onClick={() => navigate(`/vendedor/${product.seller_id}`)}
            className={`flex w-full items-center gap-4 rounded-[32px] bg-zinc-900 p-6 border transition-all cursor-pointer active:scale-[0.98] ${
              product.isSellerPro ? 'border-[#ccff00]/30 shadow-[0_0_30px_rgba(204,255,0,0.05)]' : 'border-white/5'
            }`}
          >
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl font-black text-xl italic ${
              product.isSellerPro ? 'bg-[#ccff00] text-black shadow-[0_0_15px_rgba(204,255,0,0.3)]' : 'bg-zinc-800 text-white'
            }`}>
              {product.sellerName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center gap-2">
                <p className="text-[16px] font-black text-white uppercase italic tracking-tight truncate">{product.sellerName}</p>
                {product.isSellerPro && <Crown size={14} className="text-[#ccff00] fill-[#ccff00]" />}
              </div>
              <div className="flex items-center gap-3 mt-1.5">
                <div className="flex items-center gap-1 bg-black/50 px-2.5 py-1 rounded-lg border border-white/5 text-[#ccff00]">
                  <Star size={12} className="fill-[#ccff00]" />
                  <span className="text-[12px] font-black">{product.sellerRating}</span>
                </div>
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter truncate">• {product.sellerSales} vendas</span>
              </div>
            </div>
            <ChevronRight size={20} className="text-zinc-700" />
          </div>
        )}
      </div>

      {/* BARRA DE AÇÃO INFERIOR */}
      {!isOwner && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-2xl border-t border-white/5 px-6 pb-10 pt-5">
          <div className="mx-auto flex max-w-md gap-4">
            <button 
              onClick={() => toggleFavorite(product.id)} 
              className={`flex h-[65px] w-[65px] shrink-0 items-center justify-center rounded-[24px] border transition-all active:scale-90 ${fav ? "border-[#ccff00]/30 bg-[#ccff00]/10" : "border-white/10 bg-zinc-900"}`}
            >
              <Heart size={28} className={fav ? "fill-[#ccff00] text-[#ccff00]" : "text-zinc-500"} />
            </button>
            <button 
              onClick={handleStartChat} 
              className="flex flex-1 items-center justify-center gap-3 rounded-[24px] bg-[#ccff00] py-4 font-black text-[17px] text-black shadow-[0_15px_35px_rgba(204,255,0,0.3)] uppercase tracking-widest italic active:scale-[0.98] transition-all"
            >
              <MessageCircle size={24} /> Falar com vendedor
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;