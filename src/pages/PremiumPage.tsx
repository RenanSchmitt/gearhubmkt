import { ArrowLeft, Crown, Zap, Eye, BadgeCheck, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/hooks/useStore";
import { toast } from "sonner";

const PremiumPage = () => {
  const navigate = useNavigate();
  const { user, subscribePremium } = useStore();

  const benefits = [
    { icon: BadgeCheck, title: "Badge PRO", desc: "Destaque visual em todos os seus anúncios" },
    { icon: Eye, title: "Mais visualizações", desc: "Seus anúncios aparecem primeiro nas buscas" },
    { icon: Zap, title: "Impulsionar grátis", desc: "Impulsione anúncios para o topo sem custo extra" },
    { icon: Star, title: "Selo de confiança", desc: "Compradores confiam mais em vendedores PRO" },
  ];

  const handleSubscribe = () => {
    subscribePremium();
    toast.success("🎉 Parabéns! Agora você é Premium!");
    navigate("/perfil");
  };

  return (
    <div className="min-h-screen pb-28 px-5 pt-4">
      <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-xl surface active:scale-95 mb-4">
        <ArrowLeft size={18} className="text-foreground" />
      </button>

      <div className="text-center mb-8">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/15 mb-4">
          <Crown size={36} className="text-primary" />
        </div>
        <h1 className="text-[24px] font-black text-foreground">Seja Premium</h1>
        <p className="text-[13px] text-muted-foreground mt-2">Venda mais rápido e com mais destaque</p>
      </div>

      <div className="space-y-3 mb-8">
        {benefits.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-start gap-4 rounded-2xl surface p-4 card-shadow">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15">
              <Icon size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-[14px] font-bold text-foreground">{title}</p>
              <p className="text-[12px] text-muted-foreground mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl surface p-5 card-shadow text-center mb-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Plano mensal</p>
        <div className="flex items-baseline justify-center gap-1 mt-2">
          <span className="text-[36px] font-black text-primary">R$ 19</span>
          <span className="text-[18px] font-bold text-primary">,90</span>
          <span className="text-[13px] text-muted-foreground">/mês</span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1">Cancele quando quiser</p>
      </div>

      {user?.isPro ? (
        <div className="rounded-2xl bg-primary/10 p-4 text-center">
          <p className="text-[14px] font-bold text-primary">✅ Você já é Premium!</p>
        </div>
      ) : (
        <button onClick={handleSubscribe} className="w-full rounded-2xl bg-primary py-4 font-bold text-[15px] text-primary-foreground transition-all active:scale-[0.98] glow-primary">
          Assinar Premium
        </button>
      )}
    </div>
  );
};

export default PremiumPage;
