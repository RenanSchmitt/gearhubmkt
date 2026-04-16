import { useEffect, useState } from "react";
import { Star, MapPin, Settings, ChevronRight, LogOut, Crown, Zap, Eye, Heart, MousePointer, User as UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase"; // Importando sua conexão real
import ProductCard from "@/components/ProductCard";

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Mock de produtos (vazio por enquanto até integrarmos os anúncios no banco)
  const products: any[] = []; 

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser) {
        // Aqui simulamos os campos que o seu banco ainda não tem (como location e rating)
        // para não quebrar o seu layout bonito
        setUser({
          id: authUser.id,
          name: authUser.email?.split('@')[0] || "Piloto",
          email: authUser.email,
          location: "Brasil",
          description: "Membro GearHub Performance",
          rating: 5.0,
          sales: 0,
          isPro: false
        });
      }
      setLoading(false);
    };
    getProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // Se não estiver logado e terminou de carregar
  if (!loading && !user) {
    return (
      <div className="min-h-screen bg-black pb-28 px-5 pt-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Minha conta</p>
        <h1 className="text-[22px] font-black tracking-tight text-[#ccff00] mt-1 mb-6 italic">PERFIL</h1>
        <div className="mt-16 flex flex-col items-center text-center">
          <div className="h-20 w-20 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
             <UserIcon size={40} className="text-zinc-700" />
          </div>
          <p className="text-sm font-bold text-white mb-6">Acesse sua conta para ver suas métricas</p>
          <button 
            onClick={() => navigate("/login")} 
            className="rounded-2xl bg-[#ccff00] px-10 py-4 font-black text-black text-xs tracking-widest uppercase active:scale-95 transition-all shadow-[0_0_20px_rgba(204,255,0,0.2)]"
          >
            ENTRAR NO HUB
          </button>
        </div>
      </div>
    );
  }

  if (loading) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-black pb-28">
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Minha conta</p>
            <h1 className="text-[22px] font-black tracking-tight text-[#ccff00] italic mt-1 uppercase">Perfil</h1>
          </div>
          <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 active:scale-95 transition-all">
            <Settings size={18} className="text-white" />
          </button>
        </div>

        {/* Profile Card Estilizado */}
        <div className="rounded-3xl bg-zinc-900 p-6 border border-zinc-800/50">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ccff00] text-black text-xl font-black italic">
              {user.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-[17px] font-black text-white italic uppercase">{user.name}</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <MapPin size={11} className="text-[#ccff00]" />
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">{user.location}</span>
              </div>
            </div>
          </div>
          <p className="mt-4 text-[13px] leading-relaxed text-zinc-400 font-medium">{user.description}</p>
          <div className="mt-5 flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1 bg-black/40 px-3 py-1.5 rounded-full border border-zinc-800">
              <Star size={12} className="fill-[#ccff00] text-[#ccff00]" />
              <span className="text-[12px] font-black text-white">{user.rating.toFixed(1)}</span>
            </div>
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">{user.sales} vendas</span>
          </div>
        </div>
      </div>

      {/* Quick Actions Original com Cores Novas */}
      <div className="px-5 mb-8">
        <div className="rounded-3xl bg-zinc-900 border border-zinc-800/50 divide-y divide-zinc-800 overflow-hidden">
          <button onClick={() => navigate("/favoritos")} className="flex w-full items-center justify-between px-5 py-4 transition-colors active:bg-zinc-800">
            <span className="text-[13px] font-bold text-white uppercase tracking-tight">Meus favoritos</span>
            <ChevronRight size={16} className="text-[#ccff00]" />
          </button>
          <button onClick={() => navigate("/procurar-peca")} className="flex w-full items-center justify-between px-5 py-4 transition-colors active:bg-zinc-800">
            <span className="text-[13px] font-bold text-white uppercase tracking-tight">Procurar peça</span>
            <ChevronRight size={16} className="text-[#ccff00]" />
          </button>
          <button onClick={handleLogout} className="flex w-full items-center justify-between px-5 py-4">
            <span className="text-[13px] font-black text-red-500 uppercase tracking-widest">Sair da conta</span>
            <LogOut size={15} className="text-red-500" />
          </button>
        </div>
      </div>

      {/* User Listings Section */}
      <div className="px-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[16px] font-black text-white italic uppercase tracking-tighter">Meus Anúncios</h2>
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">0 ATIVOS</span>
        </div>
        
        <div className="rounded-3xl bg-zinc-900/50 border-2 border-dashed border-zinc-800 p-8 text-center">
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-tighter">Nenhum anúncio ativo</p>
          <button 
            onClick={() => navigate("/anunciar")} 
            className="mt-4 rounded-xl bg-white px-6 py-2.5 text-[11px] font-black text-black uppercase tracking-widest active:scale-95 transition-all"
          >
            Criar anúncio
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;