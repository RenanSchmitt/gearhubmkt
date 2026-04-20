import { useEffect, useState } from "react";
import { 
  Star, MapPin, Settings, ChevronRight, LogOut, Crown, 
  Eye, Heart, MousePointer, Loader2, ShieldCheck, UserCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import ProductCard from "@/components/ProductCard";

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [userProducts, setUserProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false); // Fallback para foto
  const navigate = useNavigate();

  useEffect(() => {
    const getProfileData = async () => {
      try {
        setLoading(true);
        
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (authUser) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", authUser.id)
            .single();

          const isProUser = profileData?.account_status?.toLowerCase() === 'pro';

          // Evita cache de imagem antiga ao atualizar
          const avatarWithCacheBuster = profileData?.avatar_url 
            ? `${profileData.avatar_url}?t=${new Date().getTime()}` 
            : null;

          setUser({
            id: authUser.id,
            name: profileData?.nome || authUser.email?.split('@')[0].toUpperCase(),
            email: authUser.email,
            location: profileData?.cidade ? `${profileData.cidade}, ${profileData.estado}` : "Brasil",
            description: profileData?.bio || "Membro GearHub Performance",
            avatar_url: avatarWithCacheBuster,
            rating: profileData?.rating || 5.0,
            sales: profileData?.sales || 0,
            isPro: isProUser 
          });

          const { data: productsData, error } = await supabase
            .from("products")
            .select("*")
            .eq("seller_id", authUser.id)
            .order('created_at', { ascending: false });

          if (!error) setUserProducts(productsData || []);
          
        } else {
          navigate("/login");
        }
      } catch (err) {
        console.error("Erro ao carregar perfil:", err);
      } finally {
        setLoading(false);
      }
    };

    getProfileData();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

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
          <p className="text-[10px] font-bold text-zinc-500 tracking-[0.3em] uppercase leading-none mb-1">Minha conta</p>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black italic text-[#ccff00] tracking-tighter uppercase">Perfil</h1>
            
            {user?.isPro ? (
              <div className="flex items-center gap-1 bg-[#ccff00]/10 border border-[#ccff00]/20 px-2 py-0.5 rounded-lg">
                <Crown size={10} className="text-[#ccff00] fill-[#ccff00]" />
                <span className="text-[9px] font-black text-[#ccff00] uppercase italic tracking-widest">PRO</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 bg-zinc-800/50 border border-zinc-700/50 px-2 py-0.5 rounded-lg">
                <span className="text-[9px] font-bold text-zinc-500 uppercase italic tracking-widest">Standard</span>
              </div>
            )}
          </div>
        </div>
        
        <button 
          onClick={() => navigate("/editar-perfil")}
          className="h-10 w-10 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800 active:scale-95 transition-all shadow-lg"
        >
          <Settings size={18} className="text-[#ccff00]" />
        </button>
      </div>

      {/* Card de Perfil */}
      <div className="px-5 mb-6">
        <div className="bg-zinc-900 rounded-[32px] p-6 border border-zinc-800/50 shadow-2xl relative overflow-hidden">
          {/* AQUELA COROA GIGANTE DE FUNDO QUE VOCÊ CURTE */}
          {user?.isPro && (
            <div className="absolute -right-4 -top-4 opacity-[0.03] pointer-events-none">
              <Crown size={140} className="rotate-12 text-[#ccff00]" />
            </div>
          )}

          <div className="flex items-center gap-4">
            {/* Espaço para Foto ou Iniciais */}
            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl overflow-hidden text-black text-xl font-black italic shadow-2xl transition-all ${user?.isPro ? 'bg-[#ccff00]' : 'bg-white'}`}>
              {user?.avatar_url && !imageError ? (
                <img 
                  src={user.avatar_url} 
                  alt="Profile" 
                  className="h-full w-full object-cover" 
                  onError={() => setImageError(true)}
                />
              ) : (
                user?.name?.substring(0, 2).toUpperCase()
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-[17px] font-black italic uppercase tracking-tight truncate">{user?.name}</h2>
                {user?.isPro && <ShieldCheck size={16} className="text-[#ccff00]" />}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5 text-zinc-500">
                <MapPin size={11} className="text-[#ccff00]" />
                <span className="text-[11px] font-bold uppercase tracking-wider">{user?.location}</span>
              </div>
            </div>
          </div>
          <p className="mt-4 text-[13px] leading-relaxed text-zinc-400 font-medium italic">"{user?.description}"</p>
          
          <div className="mt-5 flex items-center gap-3">
            <div className="flex items-center gap-1 bg-black/40 px-3 py-1.5 rounded-xl border border-zinc-800">
              <Star size={12} className="fill-[#ccff00] text-[#ccff00]" />
              <span className="text-[12px] font-black">{Number(user?.rating).toFixed(1)}</span>
            </div>
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">{user?.sales} vendas</span>
          </div>
        </div>
      </div>

      {/* Seção de Métricas */}
      {userProducts.length > 0 && (
        <div className="px-5 mb-8">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-3 ml-1">📊 Desempenho no Hub</h2>
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

      {/* Menu de Opções */}
      <div className="px-5 mb-8">
        <div className="rounded-[28px] bg-zinc-900 border border-zinc-800/50 divide-y divide-zinc-800/50 overflow-hidden shadow-xl">
          <button onClick={() => navigate("/editar-perfil")} className="flex w-full items-center justify-between px-5 py-4 active:bg-zinc-800 transition-colors">
            <div className="flex items-center gap-3">
              <UserCircle size={18} className="text-[#ccff00]" />
              <span className="text-[13px] font-bold text-white uppercase tracking-tight">Editar meu Perfil</span>
            </div>
            <ChevronRight size={16} className="text-zinc-700" />
          </button>

          <button onClick={() => navigate("/favoritos")} className="flex w-full items-center justify-between px-5 py-4 active:bg-zinc-800 transition-colors">
            <span className="text-[13px] font-bold text-white uppercase tracking-tight ml-[30px]">Meus favoritos</span>
            <ChevronRight size={16} className="text-zinc-700" />
          </button>
          
          {!user?.isPro && (
            <button onClick={() => navigate("/premium")} className="flex w-full items-center justify-between px-5 py-4 bg-[#ccff00]/5 active:bg-[#ccff00]/10 transition-colors">
              <div className="flex items-center gap-3">
                <Crown size={16} className="text-[#ccff00]" />
                <span className="text-[13px] font-black text-[#ccff00] uppercase italic tracking-wider">Upgrade para Pro</span>
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

      {/* Listagem de Anúncios */}
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
              className="rounded-xl bg-[#ccff00] px-8 py-3 text-[11px] font-black text-black uppercase tracking-widest active:scale-95 transition-all shadow-[0_5px_15px_rgba(204,255,0,0.2)]"
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