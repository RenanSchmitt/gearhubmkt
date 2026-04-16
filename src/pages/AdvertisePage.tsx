import { useState, useEffect } from "react";
import { Camera, ChevronDown, ArrowLeft, Loader2 } from "lucide-react";
import { carFilters } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const AdvertisePage = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [car, setCar] = useState("");
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true); // Trava de segurança

  const navigate = useNavigate();

  // --- 1. PROTEÇÃO DE ROTA ---
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Acesso restrito. Faça login para anunciar.");
        navigate("/login", { replace: true });
      } else {
        setAuthLoading(false);
      }
    };
    checkUser();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Sessão expirada. Faça login novamente.");
      navigate("/login");
      return;
    }

    if (!title || !price) {
      toast.error("Preencha o título e o preço.");
      return;
    }

    setLoading(true);

    const payload = {
      title,
      price: Number(price),
      description,
      image: "https://images.unsplash.com/photo-1503376660353-7e6692767b70?auto=format&fit=crop&q=80&w=800",
      seller_id: user.id,
      is_pro: false,
      category: "Geral",
      compatibility: car ? [car] : [],
      car_filter: car ? [car] : ["Universal"],
      status: "normal",
      views: 0,
      fav_count: 0,
      clicks: 0,
      delivery: "Retirada local",
    };

    try {
      const { error } = await supabase
        .from("products")
        .insert([payload]);

      if (error) throw error;

      toast.success("Anúncio publicado no Hub! 🏎️");
      // Limpa o estado para evitar loops de refresh na home
      navigate("/perfil", { state: { refresh: true } });
    } catch (err: any) {
      toast.error("Erro ao publicar: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-2xl bg-zinc-900 border-none py-4 px-4 text-[14px] font-medium text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-[#ccff00]/30 transition-all";

  // Enquanto checa o login, tela preta
  if (authLoading) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-black pb-28 px-5 pt-6 text-white">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 bg-zinc-900 rounded-xl active:scale-90 transition-transform">
          <ArrowLeft size={20} className="text-[#ccff00]" />
        </button>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Novo anúncio</p>
          <h1 className="text-[22px] font-black tracking-tight text-[#ccff00] italic uppercase">Anunciar</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <button type="button" className="flex w-full flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-zinc-800 py-10 bg-zinc-900/30 transition-all active:scale-[0.98]">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ccff00]/10">
            <Camera size={24} className="text-[#ccff00]" />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#ccff00]">Adicionar Fotos</p>
        </button>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 ml-1">Título da Peça</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Turbina T3 roletada" className={inputClass} />
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 ml-1">Preço (R$)</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" className={inputClass} />
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 ml-1">Compatibilidade</label>
            <div className="relative">
              <select value={car} onChange={(e) => setCar(e.target.value)} className={`${inputClass} appearance-none pr-10`}>
                <option value="">Selecione o veículo</option>
                {carFilters.filter(c => c !== "Todos").map(c => (
                  <option key={c} value={c} className="bg-zinc-900 text-white">{c}</option>
                ))}
              </select>
              <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#ccff00] pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 ml-1">Descrição Técnica</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detalhes sobre o estado da peça..." rows={4} className={`${inputClass} resize-none`} />
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full rounded-2xl bg-[#ccff00] py-4 font-black text-[14px] text-black transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(204,255,0,0.2)] uppercase tracking-widest flex items-center justify-center gap-2">
          {loading ? <Loader2 size={18} className="animate-spin" /> : "Publicar no Hub"}
        </button>
      </form>
    </div>
  );
};

export default AdvertisePage;