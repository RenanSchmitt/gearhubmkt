import { useState } from "react";
import { ArrowLeft, Search, ChevronDown, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { carFilters } from "@/data/mockData";
import { useStore } from "@/hooks/useStore";
import { toast } from "sonner";

const PartRequestPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [car, setCar] = useState("");
  const { addPartRequest, partRequests, user } = useStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error("Informe o nome da peça.");
      return;
    }
    addPartRequest({ name, description, car, userId: user?.id || "u1" });
    toast.success("Pedido publicado! 🔍");
    setName("");
    setDescription("");
    setCar("");
  };

  const inputClass =
    "w-full rounded-2xl surface py-3.5 px-4 text-[13px] font-medium text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow";

  return (
    <div className="min-h-screen pb-28 px-5 pt-4">
      <button
        onClick={() => navigate(-1)}
        className="flex h-10 w-10 items-center justify-center rounded-xl surface active:scale-95 mb-4"
      >
        <ArrowLeft size={18} className="text-foreground" />
      </button>

      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Peça sob demanda
      </p>
      <h1 className="text-[22px] font-black tracking-tight text-foreground mt-1 mb-2">
        Procurar Peça
      </h1>
      <p className="text-[12px] text-muted-foreground mb-6">
        Não encontrou o que procura? Publique um pedido e receba ofertas.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
            Nome da peça
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Coletor de escape 4-2-1"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
            Carro
          </label>
          <div className="relative">
            <select
              value={car}
              onChange={(e) => setCar(e.target.value)}
              className={`${inputClass} appearance-none pr-10`}
            >
              <option value="">Selecionar</option>
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
            Detalhes
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva o que precisa..."
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-2xl bg-primary py-4 font-bold text-[15px] text-primary-foreground active:scale-[0.98] glow-primary"
        >
          Publicar Pedido
        </button>
      </form>

      {/* Existing requests */}
      {partRequests.length > 0 && (
        <>
          <h2 className="text-[15px] font-bold text-foreground mb-3">
            📋 Pedidos recentes
          </h2>
          <div className="space-y-2">
            {partRequests.map((req) => (
              <div key={req.id} className="rounded-2xl surface p-4 card-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[14px] font-bold text-foreground">
                      {req.name}
                    </p>
                    {req.car && (
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        🚗 {req.car}
                      </p>
                    )}
                    {req.description && (
                      <p className="text-[12px] text-secondary-foreground mt-1">
                        {req.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MessageSquare size={12} />
                    <span className="text-[11px]">{req.responses}</span>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">
                  {req.createdAt}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PartRequestPage;
