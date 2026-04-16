import { Home, Heart, PlusCircle, MessageSquare, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStore } from "@/hooks/useStore";

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { favorites } = useStore();

  const tabs = [
    { path: "/", icon: Home, label: "INÍCIO" },
    { path: "/favoritos", icon: Heart, label: "FAVORITOS", badge: favorites.size || undefined },
    { path: "/anunciar", icon: PlusCircle, label: "ANUNCIAR", special: true },
    { path: "/chat", icon: MessageSquare, label: "CHAT" },
    { path: "/perfil", icon: User, label: "PERFIL" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const hiddenPaths = ["/login", "/premium", "/procurar-peca", "/loja"];
  const shouldHide = hiddenPaths.some(p => location.pathname.startsWith(p)) || location.pathname.startsWith("/produto/");
  if (shouldHide) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-white/5 safe-bottom">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 pt-2 pb-1">
        {tabs.map(({ path, icon: Icon, label, badge, special }) => {
          const active = isActive(path);
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="relative flex flex-col items-center gap-1 px-2 py-1 transition-all duration-300 group"
            >
              {special ? (
                /* BOTÃO CENTRAL TIPO 'START ENGINE' */
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 -mt-6 shadow-2xl ${
                  active 
                  ? "bg-[#ccff00] scale-110 rotate-0" 
                  : "bg-zinc-800 rotate-45 border border-white/10 group-active:scale-95"
                }`}>
                  <Icon 
                    size={24} 
                    strokeWidth={active ? 3 : 2} 
                    className={`${active ? "text-black" : "text-[#ccff00] -rotate-45"}`} 
                  />
                </div>
              ) : (
                <>
                  {/* INDICADOR DE ABA ATIVA NO TOPO */}
                  <div className={`absolute -top-2 h-[3px] w-4 rounded-full bg-[#ccff00] transition-all duration-500 shadow-[0_0_10px_#ccff00] ${
                    active ? "opacity-100 scale-100" : "opacity-0 scale-0"
                  }`} />
                  
                  <div className="relative">
                    <Icon
                      size={20}
                      strokeWidth={active ? 2.5 : 1.5}
                      className={`transition-all duration-300 ${active ? "text-[#ccff00]" : "text-zinc-500 group-hover:text-zinc-300"}`}
                      fill={active && path === "/favoritos" ? "currentColor" : "none"}
                    />
                    
                    {badge && badge > 0 && (
                      <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#ccff00] px-1 text-[8px] font-black text-black">
                        {badge}
                      </span>
                    )}
                  </div>
                </>
              )}
              
              <span className={`text-[9px] font-black italic tracking-tighter transition-colors uppercase ${
                active ? "text-[#ccff00]" : "text-zinc-600"
              } ${special ? "mt-2" : ""}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;