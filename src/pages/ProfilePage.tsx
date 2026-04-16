import { useEffect, useState } from "react";
import { Star, MapPin, Settings, ChevronRight, LogOut, Crown, Zap, Eye, Heart, MousePointer, User as UserIcon, Loader2, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import ProductCard from "@/components/ProductCard";

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [userProducts, setUserProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getProfileData = async () => {
      setLoading(true);
      
      // 1. Pega o usuário logado
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser) {
        setUser({
          id: authUser.id,
          name: authUser.email?.split('@')[0].toUpperCase() || "PILOTO",
          email: authUser.email,
          location: "Brasil",
          description: "Membro GearHub Performance",
          rating: 5.0,
          sales: 0,
          isPro: false 
        });

        // 2. BUSCA OS ANÚNCIOS (Filtra pelo seller_id que gravamos no criar anúncio)
        const { data: productsData, error } = await supabase
          .from("products")
          .select("*")
          .eq("seller_id", authUser.id) // Garanta que a coluna no Supabase chama 'seller_id'
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Erro ao buscar produtos:", error);
        } else {
          console.log("Seus anúncios encontrados:", productsData);
          setUserProducts(productsData || []);
        }
      } else {
        navigate("/login");
      }
      setLoading(false);
    };

    getProfileData();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // Métricas baseadas no que veio do banco
  const totalViews = userProducts.reduce((s, p) => s + (p.views || 0), 0);
  const totalFavs = userProducts.reduce((s, p) => s + (p.fav_count || 0), 0);
  const totalClicks = userProducts.reduce((s, p) => s + (p.clicks || 0), 0);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 size={32} className="animate-spin text-[#ccff00]" />
    </div>
  );

  return (
    <div className="min-h-screen bg-black pb-28 text-white font-sans">
      {/* Header */}
      <div className="px-5 pt-8 flex justify-between items-center mb-6">
        <div>
          <p className="text-[10px] font-bold text-zinc-500 tracking-[0.3em] uppercase">Minha conta</p>
          <h1 className="text-2xl font-black italic text-[#ccff00] tracking-tighter uppercase">Perfil</h1>
        </div>
        <button className="h-10 w-10 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800 active:scale-95 transition-all">
          <Settings size={18} />
        </button>
      </div>

      {/* Card de Perfil */}
      <div className="px-5 mb-6">
        <div className="bg-zinc-900 rounded-[32px] p-6 border border-zinc-800/50 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ccff00] text-black text-xl font-black italic shadow-[0_0_20px_rgba(204,255,0,0.3)]">
              {user?.name?.substring(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-[17px] font-black italic uppercase tracking-tight">{user?.name}</h2>
              <div className="flex items-center gap-1.5 mt-0.5 text-zinc-500">
                <MapPin size={11} className="text-[#ccff00]" />
                <span className="text-[11px] font-bold uppercase tracking-wider">{user?.location}</span>
              </div>
            </div>
          </div>
          <p className="mt-4 text-[13px] leading-relaxed text-zinc-400 font-medium">{user?.description}</p>
          
          <div className="mt-5 flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1 bg-black/40 px-3 py-1.5 rounded-xl border border-zinc-800">
              <Star size={12} className="fill-[#ccff00] text-[#ccff00]" />
              <span className="text-[12px] font-black">{user?.rating.toFixed(1)}</span>
            </div>
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">{user?.sales} vendas</span>
          </div>
        </div>
      </div>

      {/* Métricas */}
      {userProducts.length > 0 && (
        <div className="px-5 mb-8">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-3 ml-1 uppercase">📊 Métricas do Hub</h2>
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: Eye, label: "Views", value: totalViews },
              { icon: Heart, label: "Favs", value: totalFavs },
              { icon: MousePointer, label: "Clicks", value: totalClicks },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-2xl bg-zinc-900 p-3 text-center border border-zinc-800/50">
                <Icon size={16} className="text-[#ccff00] mx-auto mb-1" />
                <p className="text-[16px] font-black text-white italic">{value}</p>
                <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lista de Ações */}
      <div className="px-5 mb-8">
        <div className="rounded-[28px] bg-zinc-900 border border-zinc-800/50 divide-y divide-zinc-800/50 overflow-hidden shadow-xl">
          <button onClick={() => navigate("/favoritos")} className="flex w-full items-center justify-between px-5 py-4 active:bg-zinc-800 transition-colors">
            <span className="text-[13px] font-bold text-white uppercase tracking-tight">Meus favoritos</span>
            <ChevronRight size={16} className="text-zinc-700" />
          </button>
          <button onClick={() => navigate("/procurar-peca")} className="flex w-full items-center justify-between px-5 py-4 active:bg-zinc-800 transition-colors">
            <span className="text-[13px] font-bold text-white uppercase tracking-tight">Procurar peça</span>
            <ChevronRight size={16} className="text-zinc-700" />
          </button>
          {!user?.isPro && (
            <button onClick={() => navigate("/premium")} className="flex w-full items-center justify-between px-5 py-4 active:bg-zinc-800 transition-colors">
              <div className="flex items-center gap-3">
                <Crown size={16} className="text-[#ccff00]" />
                <span className="text-[13px] font-bold text-[#ccff00] uppercase italic">Seja Premium</span>
              </div>
              <ChevronRight size={16} className="text-[#ccff00]" />
            </button>
          )}
          <button onClick={handleLogout} className="flex w-full items-center justify-between px-5 py-4 bg-red-500/5 active:bg-red-500/10 transition-colors">
            <span className="text-[13px] font-black text-red-500 uppercase tracking-widest">Sair da conta</span>
            <LogOut size={15} className="text-red-500" />
          </button>
        </div>
      </div>

      {/* Seção de Anúncios */}
      <div className="px-5">
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-[16px] font-black italic uppercase text-white tracking-tighter">Meus Anúncios</h2>
          <span className="text-[10px] font-bold text-[#ccff00] uppercase tracking-widest">{userProducts.length} Peças</span>
        </div>

        {userProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {userProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="rounded-[32px] bg-zinc-900/30 border-2 border-dashed border-zinc-800 p-10 text-center">
            <p className="text-sm font-bold text-zinc-600 uppercase tracking-tighter mb-4">Seu estoque está vazio</p>
            <button 
              onClick={() => navigate("/anunciar")} 
              className="rounded-xl bg-white px-8 py-3 text-[11px] font-black text-black uppercase tracking-widest active:scale-95 transition-all"
            >
              Anunciar Peça
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;