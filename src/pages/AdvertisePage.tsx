import { useState } from "react";
import { Camera, ChevronDown } from "lucide-react";
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

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("🚀 SUBMIT CLICADO");

    if (!title || !price) {
      console.log("❌ Validação falhou", { title, price });
      toast.error("Preencha título e preço.");
      return;
    }

    setLoading(true);

    const payload = {
      title,
      price: Number(price),
      description,
      image: "",
      seller_id: "u1",
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

    console.log("📦 Payload enviado:", payload);

    try {
      const { data, error } = await supabase
        .from("products")
        .insert([payload])
        .select();

      console.log("📡 RESPOSTA SUPABASE:", { data, error });

      if (error) {
        console.error("🔥 ERRO DO SUPABASE:", error);
        throw error;
      }

      console.log("✅ SUCESSO AO INSERIR:", data);

      toast.success("Anúncio criado com sucesso! 🎉");

      setTitle("");
      setPrice("");
      setDescription("");
      setCar("");

      navigate("/", { state: { refresh: Date.now() } });
    } catch (err) {
      console.error("💥 ERRO NO TRY/CATCH:", err);
      toast.error("Erro ao criar anúncio");
    }

    setLoading(false);
  };

  const inputClass =
    "w-full rounded-2xl surface py-3.5 px-4 text-[13px] font-medium text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow";

  return (
    <div className="min-h-screen pb-28 px-5 pt-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Novo anúncio
      </p>
      <h1 className="text-[22px] font-black tracking-tight text-foreground mt-1 mb-6">
        Anunciar
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <button
          type="button"
          className="flex w-full flex-col items-center justify-center gap-2.5 rounded-2xl border-2 border-dashed border-border/50 py-10 surface transition-all active:scale-[0.99]"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15">
            <Camera size={24} className="text-primary" />
          </div>
          <p className="text-[13px] font-bold text-foreground">
            Adicionar fotos
          </p>
          <p className="text-[11px] text-muted-foreground">
            Até 10 fotos • JPG ou PNG
          </p>
        </button>

        <div>
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
            Título
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Kit Turbo T3/T4"
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
            Preço (R$)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="3500"
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
            Carro compatível
          </label>
          <div className="relative">
            <select
              value={car}
              onChange={(e) => {
                console.log("🚗 Car selecionado:", e.target.value);
                setCar(e.target.value);
              }}
              className={`${inputClass} appearance-none pr-10`}
            >
              <option value="">Selecionar carro</option>
              {carFilters
                .filter((c) => c !== "Todos")
                .map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
            Descrição
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva a peça com detalhes..."
            rows={4}
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-primary py-4 font-bold text-[15px] text-primary-foreground transition-all active:scale-[0.98] glow-primary"
          >
            {loading ? "Publicando..." : "Publicar Anúncio"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdvertisePage;