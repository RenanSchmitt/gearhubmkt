import { useEffect, useState } from "react";
import { 
  Star, MapPin, ChevronLeft, Crown, 
  ShieldCheck, Loader2, ShoppingBag 
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import ProductCard from "@/components/ProductCard";

const PublicProfile = () => {
  const { vendedorId } = useParams(); 
  const [vendedor, setVendedor] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVendedorData = async () => {
      if (!vendedorId) return;
      
      try {
        setLoading(true);
        
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", vendedorId)
          .single();

        if (profileError) throw profileError;

        const isProUser = profileData?.account_status?.toLowerCase() === 'pro';

        setVendedor({
          name: profileData?.nome || profileData?.name || "Membro GearHub",
          location: profileData?.cidade ? `${profileData.cidade}, ${profileData.estado}` : "Brasil",
          description: profileData?.bio || "Entusiasta da cultura automotiva.",
          rating: profileData?.rating || 5.0,
          sales: profileData?.sales || 0,
          isPro: isProUser 
        });

        const { data: productsData } = await supabase
          .from("products")
          .select("*")
          .eq("seller_id", vendedorId)
          .order('created_at', { ascending: false });

        setProducts(productsData || []);
        
      } catch (err) {
        console.error("Erro ao carregar perfil público:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendedorData();
  }, [vendedorId]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 size={32} className="animate-spin text-[#ccff00]" />
    </div>
  );

  return (
    <div className="min-h-screen bg-black pb-28 text-white font-sans">
      
      {/* Header de Navegação */}
      <div className="px-5 pt-8 flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="h-10 w-10 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800 active:scale-95 transition-all"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-xl font-black italic text-[#ccff00] tracking-tighter uppercase leading-none">Perfil do Vendedor</h1>
      </div>

      {/* Card do Vendedor */}
      <div className="px-5 mb-8">
        <div className="bg-zinc-900 rounded-[32px] p-6 border border-zinc-800/50 shadow-2xl relative overflow-hidden">
          {vendedor?.isPro && (
            <div className="absolute -right-4 -top-4 opacity-[0.05] pointer-events-none">
              <Crown size={140} className="rotate-12 text-[#ccff00]" />
            </div>
          )}

          <div className="flex items-center gap-4">
            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl text-black text-xl font-black italic shadow-2xl ${vendedor?.isPro ? 'bg-[#ccff00] shadow-[#ccff00]/20' : 'bg-white'}`}>
              {vendedor?.name?.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center gap-2">
                <h2 className="text-[17px] font-black italic uppercase tracking-tight truncate">{vendedor?.name}</h2>
                {vendedor?.isPro && <ShieldCheck size={16} className="text-[#ccff00]" />}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5 text-zinc-500">
                <MapPin size={11} className="text-[#ccff00]" />
                <span className="text-[11px] font-bold uppercase tracking-wider">{vendedor?.location}</span>
              </div>
            </div>
          </div>

          <p className="mt-4 text-[13px] leading-relaxed text-zinc-400 font-medium italic">"{vendedor?.description}"</p>
          
          <div className="mt-5 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-black/40 px-3 py-1.5 rounded-xl border border-zinc-800">
                  <Star size={12} className="fill-[#ccff00] text-[#ccff00]" />
                  <span className="text-[12px] font-black">{Number(vendedor?.rating).toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1 text-zinc-500 font-bold text-[11px] uppercase tracking-widest">
                  <ShoppingBag size={12} />
                  <span>{vendedor?.sales} vendas</span>
                </div>
             </div>
             
             {vendedor?.isPro && (
                <div className="flex items-center gap-1 bg-[#ccff00]/10 px-2 py-1 rounded-lg border border-[#ccff00]/20">
                   <Crown size={10} className="text-[#ccff00] fill-[#ccff00]" />
                   <span className="text-[8px] font-black text-[#ccff00] uppercase italic">VERIFIED PRO</span>
                </div>
             )}
          </div>
        </div>
      </div>

      {/* Banner de Direcionamento (Substitui o botão de Chat) */}
      <div className="px-5 mb-10">
        <div className="bg-[#ccff00]/5 border border-[#ccff00]/20 rounded-2xl p-5 flex items-center gap-4">
          <div className="h-12 w-12 bg-[#ccff00] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(204,255,0,0.3)] shrink-0">
            <ShoppingBag size={24} className="text-black" />
          </div>
          <div>
            <p className="text-[14px] font-black text-[#ccff00] uppercase italic leading-none">Catálogo de Peças</p>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1">Toque em um item para negociar via chat</p>
          </div>
        </div>
      </div>

      {/* Listagem de Anúncios */}
      <div className="px-5">
        <div className="flex items-center justify-between mb-6 px-1">
          <div className="flex flex-col">
            <h2 className="text-[18px] font-black italic uppercase text-white tracking-tighter leading-none">Estoque Disponível</h2>
            <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.3em] mt-1">Direct from Garage</span>
          </div>
          <div className="bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800">
            <span className="text-[10px] font-black text-[#ccff00] uppercase italic">{products.length} Itens</span>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-zinc-900 rounded-[40px] flex flex-col items-center gap-3">
            <ShoppingBag size={32} className="text-zinc-800" />
            <p className="text-zinc-600 font-bold uppercase text-[10px] tracking-[0.2em]">Nenhum anúncio ativo</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicProfile;