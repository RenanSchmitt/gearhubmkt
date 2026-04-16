import { ArrowLeft, Crown, Zap, Eye, BadgeCheck, Star, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const PremiumPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkStatus = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        setUser(authUser);
        const { data: profile } = await supabase
          .from('profiles')
          .select('account_status')
          .eq('id', authUser.id)
          .single();
        
        setIsPro(profile?.account_status === 'pro');
      }
    };
    checkStatus();
  }, []);

  const benefits = [
    { icon: BadgeCheck, title: "Badge PRO", desc: "Destaque visual em todos os seus anúncios" },
    { icon: Eye, title: "Mais visualizações", desc: "Seus anúncios aparecem primeiro nas buscas" },
    { icon: Zap, title: "Impulsionar grátis", desc: "Impulsione anúncios para o topo sem custo extra" },
    { icon: Star, title: "Selo de confiança", desc: "Compradores confiam mais em vendedores PRO" },
  ];

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ account_status: 'pro' })
        .eq('id', user.id);

      if (error) throw error;

      toast.success("🎉 MODO PRO ATIVADO! ACELERA!");
      setIsPro(true);
      setTimeout(() => navigate("/chat"), 1500);
    } catch (error) {
      toast.error("Erro ao processar assinatura.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pb-28 px-5 pt-8 text-white">
      {/* BOTÃO VOLTAR */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 border border-white/5 active:scale-95 mb-8"
      >
        <ArrowLeft size={20} />
      </button>

      {/* HEADER */}
      <div className="text-center mb-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[30px] bg-[#ccff00]/10 border border-[#ccff00]/20 mb-6 shadow-[0_0_30px_rgba(204,255,0,0.1)]">
          <Crown size={40} className="text-[#ccff00]" />
        </div>
        <h1 className="text-[32px] font-black italic uppercase tracking-tighter leading-none">Seja Premium</h1>
        <p className="text-[13px] font-bold text-zinc-500 uppercase tracking-widest mt-2 italic">Domine o Marketplace</p>
      </div>

      {/* LISTA DE BENEFÍCIOS */}
      <div className="space-y-3 mb-10">
        {benefits.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-start gap-4 rounded-[24px] bg-zinc-900/50 border border-white/5 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ccff00] text-black shadow-[0_0_15px_rgba(204,255,0,0.2)]">
              <Icon size={20} strokeWidth={3} />
            </div>
            <div>
              <p className="text-[15px] font-black italic uppercase tracking-tighter text-[#ccff00]">{title}</p>
              <p className="text-[12px] font-bold text-zinc-400 uppercase tracking-tight leading-tight mt-1">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CARD DE PREÇO */}
      <div className="rounded-[32px] bg-zinc-900 border-2 border-[#ccff00]/20 p-8 text-center mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3">
            <div className="bg-[#ccff00] text-black text-[9px] font-black px-2 py-1 rounded-bl-xl uppercase italic">Melhor Valor</div>
        </div>
        
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 italic">Plano mensal</p>
        <div className="flex items-baseline justify-center gap-1 mt-3">
          <span className="text-[48px] font-black italic text-white tracking-tighter">R$ 19</span>
          <span className="text-[24px] font-black italic text-[#ccff00]">,90</span>
          <span className="text-[14px] font-bold text-zinc-500 italic ml-1">/mês</span>
        </div>
        <p className="text-[11px] font-bold text-zinc-600 uppercase mt-2 italic tracking-widest">Cancele quando quiser</p>
      </div>

      {/* BOTÃO DE AÇÃO */}
      {isPro ? (
        <div className="rounded-2xl border-2 border-[#ccff00] p-5 text-center bg-[#ccff00]/5">
          <p className="text-[16px] font-black italic uppercase text-[#ccff00] tracking-tighter">
            ✅ VOCÊ JÁ É UM MEMBRO PRO
          </p>
        </div>
      ) : (
        <button 
          onClick={handleSubscribe} 
          disabled={loading}
          className="w-full rounded-[24px] bg-[#ccff00] py-5 font-black text-[16px] text-black uppercase italic transition-all active:scale-[0.95] shadow-[0_10px_30px_rgba(204,255,0,0.2)] flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : "ASSINAR PREMIUM AGORA"}
        </button>
      )}
      
      <p className="text-center text-[10px] text-zinc-600 font-bold uppercase mt-6 tracking-widest italic">
        Pagamento Seguro via GearPay
      </p>
    </div>
  );
};

export default PremiumPage;