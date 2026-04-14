import { Star, MapPin, Settings, ChevronRight, LogOut, Crown, Zap, Eye, Heart, MousePointer } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { useNavigate } from "react-router-dom";
import ProductCard from "@/components/ProductCard";

const ProfilePage = () => {
  const { user, isLoggedIn, logout, products } = useStore();
  const navigate = useNavigate();

  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen pb-28 px-5 pt-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Minha conta</p>
        <h1 className="text-[22px] font-black tracking-tight text-foreground mt-1 mb-6">Perfil</h1>
        <div className="mt-16 flex flex-col items-center text-center">
          <p className="text-sm font-bold text-foreground mb-2">Faça login para acessar</p>
          <button onClick={() => navigate("/login")} className="rounded-2xl bg-primary px-8 py-3 font-bold text-primary-foreground active:scale-95 transition-all">
            Entrar
          </button>
        </div>
      </div>
    );
  }

  const userProducts = products.filter(p => p.sellerId === user.id);
  const totalViews = userProducts.reduce((s, p) => s + (p.views || 0), 0);
  const totalFavs = userProducts.reduce((s, p) => s + (p.favCount || 0), 0);
  const totalClicks = userProducts.reduce((s, p) => s + (p.clicks || 0), 0);

  return (
    <div className="min-h-screen pb-28">
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Minha conta</p>
            <h1 className="text-[22px] font-black tracking-tight text-foreground mt-1">Perfil</h1>
          </div>
          <button className="flex h-10 w-10 items-center justify-center rounded-xl surface active:scale-95 transition-all">
            <Settings size={18} className="text-muted-foreground" />
          </button>
        </div>

        {/* Profile Card */}
        <div className="rounded-2xl surface p-5 card-shadow">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 text-primary text-xl font-black">
              {user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-[15px] font-bold text-foreground">{user.name}</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <MapPin size={11} className="text-muted-foreground" />
                <span className="text-[11px] font-medium text-muted-foreground">{user.location}</span>
              </div>
            </div>
          </div>
          <p className="mt-3 text-[13px] leading-relaxed text-secondary-foreground">{user.description}</p>
          <div className="mt-4 flex items-center gap-3 flex-wrap">
            {user.isPro && (
              <span className="rounded-lg bg-primary/15 px-2.5 py-1 text-[9px] font-extrabold tracking-[0.15em] text-primary">
                VENDEDOR PRO
              </span>
            )}
            <div className="flex items-center gap-1">
              <Star size={12} className="fill-primary text-primary" />
              <span className="text-[13px] font-bold text-foreground">{user.rating}</span>
            </div>
            <span className="text-[11px] text-muted-foreground">{user.sales} vendas</span>
          </div>
        </div>
      </div>

      {/* Metrics */}
      {userProducts.length > 0 && (
        <div className="px-5 mb-5">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-3">📊 Métricas</h2>
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: Eye, label: "Visualizações", value: totalViews },
              { icon: Heart, label: "Favoritos", value: totalFavs },
              { icon: MousePointer, label: "Cliques", value: totalClicks },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-2xl surface p-3 text-center card-shadow">
                <Icon size={16} className="text-primary mx-auto mb-1" />
                <p className="text-[15px] font-black text-foreground">{value}</p>
                <p className="text-[10px] text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="px-5 mb-5">
        <div className="rounded-2xl surface card-shadow divide-y divide-border/40 overflow-hidden">
          {!user.isPro && (
            <button onClick={() => navigate("/premium")} className="flex w-full items-center justify-between px-4 py-3.5 transition-colors active:surface-hover">
              <div className="flex items-center gap-2">
                <Crown size={15} className="text-primary" />
                <span className="text-[13px] font-semibold text-primary">Seja Premium</span>
              </div>
              <ChevronRight size={16} className="text-primary" />
            </button>
          )}
          <button onClick={() => navigate("/favoritos")} className="flex w-full items-center justify-between px-4 py-3.5 transition-colors active:surface-hover">
            <span className="text-[13px] font-semibold text-foreground">Meus favoritos</span>
            <ChevronRight size={16} className="text-muted-foreground" />
          </button>
          <button onClick={() => navigate("/procurar-peca")} className="flex w-full items-center justify-between px-4 py-3.5 transition-colors active:surface-hover">
            <span className="text-[13px] font-semibold text-foreground">Procurar peça</span>
            <ChevronRight size={16} className="text-muted-foreground" />
          </button>
          <button onClick={() => { logout(); navigate("/"); }} className="flex w-full items-center justify-between px-4 py-3.5">
            <span className="text-[13px] font-semibold text-destructive">Sair da conta</span>
            <LogOut size={15} className="text-destructive" />
          </button>
        </div>
      </div>

      {/* User Listings */}
      <div className="px-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-bold text-foreground">Meus Anúncios</h2>
          <span className="text-[11px] font-medium text-muted-foreground">{userProducts.length} ativos</span>
        </div>
        {userProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {userProducts.map((product, i) => (
              <div key={product.id} className="relative">
                <ProductCard product={product} index={i} />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl surface p-6 text-center">
            <p className="text-sm text-muted-foreground">Nenhum anúncio ainda</p>
            <button onClick={() => navigate("/anunciar")} className="mt-3 rounded-xl bg-primary px-6 py-2 text-sm font-bold text-primary-foreground active:scale-95">
              Criar anúncio
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
