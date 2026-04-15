import { 
  ArrowLeft, 
  Star, 
  MessageCircle, 
  Share2, 
  Heart, 
  ShieldCheck, 
  Zap, 
  Truck, 
  Bell 
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
  const { isFavorite, toggleFavorite, addAlert, boostProduct, user } = useStore(); 
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setProduct(null);
        setLoading(false);
        return;
      }

      setProduct({
        id: data.id,
        title: data.title ?? "",
        price: Number(data.price) ?? 0,
        description: data.description ?? "",
        image: data.image && data.image !== "" ? data.image : "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80",
        sellerId: String(data.seller_id), // Forçamos string para comparação segura
        isPro: data.is_pro ?? false,
        status: data.status ?? "normal",
        delivery: data.delivery ?? "Retirada local",
        compatibility: Array.isArray(data.compatibility) 
          ? data.compatibility 
          : typeof data.compatibility === 'string' 
            ? JSON.parse(data.compatibility) 
            : []
      });
      setLoading(false);
    }

    if (id) fetchProduct();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#00FF85]" /></div>;
  if (!product) return <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center text-white font-bold">Produto não encontrado</div>;

  // Lógica de verificação de dono rigorosa
  const isOwner = user && String(user.id) === String(product.sellerId);
  const fav = isFavorite(product.id); 
  const seller = sellers.find((s) => s.id === product.sellerId);

  return ( 
    <div className="min-h-screen bg-[#0B0B0B] pb-40"> 
      {/* HEADER ACTIONS */}
      <div className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-4 pt-4"> 
        <button onClick={() => navigate(-1)} className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 active:scale-95 transition-all"> 
          <ArrowLeft size={20} className="text-white" /> 
        </button> 
        <div className="flex gap-2"> 
          <button className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 active:scale-95 transition-all"> 
            <Share2 size={18} className="text-white" /> 
          </button> 
        </div> 
      </div> 

      {/* GALERIA/IMAGEM */}
      <div className="aspect-square w-full overflow-hidden bg-[#1A1A1A]"> 
        <img src={product.image} alt={product.title} className="h-full w-full object-cover" /> 
      </div> 

      {/* CONTEÚDO PRINCIPAL */}
      <div className="relative -mt-8 rounded-t-[32px] bg-[#0B0B0B] px-6 pt-8 space-y-7"> 
        <div className="space-y-3"> 
          <div className="flex items-start justify-between gap-4"> 
            <h1 className="text-2xl font-black text-white uppercase italic leading-[1.1]">{product.title}</h1> 
            {product.isPro && ( 
              <span className="shrink-0 rounded-full border border-[#00FF85]/30 bg-[#1A1A1A] px-3 py-1 text-[10px] font-black text-[#00FF85]">PRO</span> 
            )} 
          </div> 
          <p className="text-[34px] font-black text-[#00FF85] tracking-tighter italic leading-none">R$ {product.price.toLocaleString("pt-BR")}</p> 
        </div> 

        {/* LOGÍSTICA */}
        <div className="flex items-center gap-3 rounded-[20px] bg-[#1A1A1A] border border-white/5 p-4"> 
          <Truck size={20} className="text-[#00FF85]" /> 
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">Logística</span>
            <span className="text-[13px] font-bold text-white italic">{product.delivery}</span> 
          </div>
        </div> 

        {/* COMPATIBILIDADE */}
        <div className="space-y-3"> 
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Compatibilidade</h2> 
          <div className="flex flex-wrap gap-2"> 
            {product.compatibility && product.compatibility.length > 0 ? (
              product.compatibility.map((c: string, index: number) => ( 
                <span key={index} className="flex items-center gap-2 rounded-full bg-[#1A1A1A] border border-white/10 px-4 py-2.5 text-[11px] font-black text-white uppercase italic"> 
                  <ShieldCheck size={14} className="text-[#00FF85]" /> {c}
                </span> 
              ))
            ) : (
              <span className="text-[11px] text-gray-600 italic">Não especificada</span>
            )}
          </div> 
        </div> 

        {/* DESCRIÇÃO */}
        <div className="space-y-3"> 
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Descrição</h2> 
          <p className="text-[14px] leading-relaxed text-gray-300 font-medium">{product.description}</p> 
        </div> 

        {/* ÁREA DE AÇÕES DINÂMICAS (CONTROLE DE DONO) */}
        <div className="space-y-4">
          {isOwner ? (
            /* VISÃO DO VENDEDOR (DONO) */
            <>
              {product.status !== "patrocinado" && (
                <button 
                  onClick={() => { boostProduct(product.id); toast.success("⚡ Anúncio impulsionado!"); }} 
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#00FF85] py-4 shadow-[0_8px_20px_rgba(0,255,133,0.3)] active:scale-[0.98] transition-all"
                > 
                  <Zap size={18} className="text-black fill-black" /> 
                  <span className="text-[13px] font-black text-black uppercase tracking-wider">Impulsionar Anúncio</span> 
                </button>
              )}
              <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1A1A1A] py-4 border border-white/5 text-gray-300 text-[13px] font-bold uppercase tracking-wider">
                Editar Peça
              </button>
            </>
          ) : (
            /* VISÃO DO COMPRADOR */
            <button 
              onClick={() => { addAlert(product.title); toast.success("Alerta criado!"); }} 
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1A1A1A] py-4 border border-white/5 active:scale-[0.98] transition-all"
            > 
              <Bell size={18} className="text-[#00FF85]" /> 
              <span className="text-[13px] font-bold text-white uppercase tracking-wider">Criar alerta para peça similar</span> 
            </button>
          )}
        </div>

        {/* VENDEDOR */}
        {seller && (
          <div className="flex w-full items-center gap-4 rounded-[24px] bg-[#1A1A1A] p-5 border border-white/5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00FF85] text-black font-black text-lg">{seller.name.charAt(0)}</div>
            <div className="flex-1">
              <p className="text-[15px] font-black text-white uppercase italic tracking-tight">{seller.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-md">
                  <Star size={10} className="fill-[#00FF85] text-[#00FF85]" /> 
                  <span className="text-[11px] font-black text-white">{seller.rating}</span>
                </div>
                <span className="text-[11px] font-bold text-gray-500 uppercase">• {seller.sales} vendas</span>
              </div>
            </div>
          </div>
        )}
      </div> 

      {/* FOOTER CTA FIXO (APENAS COMPRADORES) */} 
      {!isOwner && ( 
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0B0B0B]/90 backdrop-blur-xl border-t border-white/5 px-6 pb-8 pt-4"> 
          <div className="mx-auto flex max-w-md gap-4"> 
            <button 
              onClick={() => toggleFavorite(product.id)} 
              className={`flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-[22px] border transition-all active:scale-90 ${
                fav ? "border-[#00FF85]/30 bg-[#00FF85]/10" : "border-white/10 bg-[#1A1A1A]"
              }`}
            > 
              <Heart size={26} className={fav ? "fill-[#00FF85] text-[#00FF85]" : "text-gray-400"} /> 
            </button> 

            <button 
              onClick={() => { toast.success("Abrindo chat..."); navigate("/chat"); }} 
              className="flex flex-1 items-center justify-center gap-3 rounded-full bg-[#00FF85] py-4 font-black text-[16px] text-black shadow-[0_10px_30px_rgba(0,255,133,0.3)] transition-all active:scale-[0.98]" 
            > 
              <MessageCircle size={22} /> 
              Falar com vendedor 
            </button> 
          </div> 
        </div> 
      )} 
    </div> 
  ); 
}; 

export default ProductDetail;