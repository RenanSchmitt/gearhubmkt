import { Home, Heart, PlusCircle, MessageSquare, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStore } from "@/hooks/useStore";

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { favorites } = useStore();

  const tabs = [
    { path: "/", icon: Home, label: "Início" },
    { path: "/favoritos", icon: Heart, label: "Favoritos", badge: favorites.size || undefined },
    { path: "/anunciar", icon: PlusCircle, label: "Anunciar", special: true },
    { path: "/chat", icon: MessageSquare, label: "Chat" },
    { path: "/perfil", icon: User, label: "Perfil" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  // Hide bottom nav on certain pages
  const hiddenPaths = ["/login", "/premium", "/procurar-peca", "/loja"];
  const shouldHide = hiddenPaths.some(p => location.pathname.startsWith(p)) || location.pathname.startsWith("/produto/");
  if (shouldHide) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-border/40 safe-bottom">
      <div className="mx-auto flex max-w-md items-center justify-around px-1 pt-1.5 pb-0.5">
        {tabs.map(({ path, icon: Icon, label, badge, special }) => {
          const active = isActive(path);
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="relative flex flex-col items-center gap-0.5 px-3 py-1 transition-all duration-200"
            >
              {special ? (
                <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${active ? "bg-primary glow-primary" : "bg-primary/20"} transition-all`}>
                  <Icon size={20} strokeWidth={2} className={active ? "text-primary-foreground" : "text-primary"} />
                </div>
              ) : (
                <>
                  {active && <span className="absolute -top-0.5 h-[2px] w-5 rounded-full bg-primary" />}
                  <div className="relative">
                    <Icon
                      size={20}
                      strokeWidth={active ? 2.5 : 1.5}
                      className={`transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}
                      fill={active && path === "/favoritos" ? "currentColor" : "none"}
                    />
                    {badge && badge > 0 && (
                      <span className="absolute -right-2 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                        {badge}
                      </span>
                    )}
                  </div>
                </>
              )}
              <span className={`text-[10px] font-semibold tracking-wide transition-colors ${active ? "text-primary" : "text-muted-foreground"} ${special ? "mt-0" : ""}`}>
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
