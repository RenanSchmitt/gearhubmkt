import { ArrowLeft, Star, MessageCircle, Share2, Heart, ShieldCheck, Zap, Truck, Bell } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { sellers } from "@/data/mockData";
import { useStore } from "@/hooks/useStore";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, isFavorite, toggleFavorite, boostProduct, addAlert, user } = useStore();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Produto não encontrado.</p>
      </div>
    );
  }

  const seller = sellers.find((s) => s.id === product.sellerId);
  const fav = isFavorite(product.id);
  const isOwner = user?.id === product.sellerId;
  const placeholder = "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&q=80";

  return (
    <div className="min-h-screen pb-28">
      <div className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-4 pt-4">
        <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-xl glass active:scale-95 transition-all">
          <ArrowLeft size={18} className="text-foreground" />
        </button>
        <div className="flex gap-2">
          <button className="flex h-10 w-10 items-center justify-center rounded-xl glass active:scale-95 transition-all">
            <Share2 size={16} className="text-foreground" />
          </button>
          <button onClick={() => toggleFavorite(product.id)} className="flex h-10 w-10 items-center justify-center rounded-xl glass active:scale-95 transition-all">
            <Heart size={16} className={fav ? "fill-primary text-primary" : "text-foreground"} />
          </button>
        </div>
      </div>

      <div className="aspect-[4/3] w-full overflow-hidden">
        <img src={product.image || placeholder} alt={product.title} className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = placeholder; }} />
      </div>

      <div className="relative -mt-6 rounded-t-[28px] bg-background px-5 pt-6 space-y-5">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-xl font-bold tracking-tight text-foreground leading-snug">{product.title}</h1>
            {product.isPro && (
              <span className="mt-0.5 shrink-0 rounded-lg bg-primary/15 px-2.5 py-1 text-[10px] font-extrabold tracking-widest text-primary">PRO</span>
            )}
          </div>
          <p className="mt-2 text-[26px] font-black text-primary leading-none">
            R$ {product.price.toLocaleString("pt-BR")}
          </p>
          <p className="mt-1.5 text-[11px] font-medium text-muted-foreground">
            ou 12x de R$ {(product.price / 12).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        {/* Delivery */}
        {product.delivery && (
          <div className="flex items-center gap-2 rounded-2xl surface p-3">
            <Truck size={16} className="text-primary shrink-0" />
            <span className="text-[12px] font-medium text-foreground">{product.delivery}</span>
          </div>
        )}

        <div className="h-px bg-border/40" />

        {/* Compatibility */}
        <div>
          <h2 className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Compatibilidade</h2>
          <div className="flex flex-wrap gap-2">
            {product.compatibility.map((c) => (
              <span key={c} className="flex items-center gap-1 rounded-lg surface px-3 py-1.5 text-[11px] font-semibold text-foreground">
                <ShieldCheck size={12} className="text-primary" />
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className="h-px bg-border/40" />

        <div>
          <h2 className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Descrição</h2>
          <p className="text-[13px] leading-relaxed text-secondary-foreground">{product.description}</p>
        </div>

        {/* Alert */}
        <button
          onClick={() => { addAlert(product.title); toast.success("🔔 Você será avisado sobre peças similares!"); }}
          className="flex w-full items-center justify-center gap-2 rounded-2xl surface py-3 active:scale-[0.98] transition-all"
        >
          <Bell size={15} className="text-primary" />
          <span className="text-[13px] font-semibold text-foreground">Criar alerta para peça similar</span>
        </button>

        <div className="h-px bg-border/40" />

        {/* Seller */}
        {seller && (
          <button onClick={() => navigate(`/loja/${seller.id}`)} className="flex w-full items-center gap-3.5 rounded-2xl surface p-4 text-left active:scale-[0.98] transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary font-black text-sm">
              {seller.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-foreground truncate">{seller.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Star size={11} className="fill-primary text-primary" />
                <span className="text-xs font-bold text-foreground">{seller.rating}</span>
                <span className="text-[11px] text-muted-foreground">• {seller.sales} vendas</span>
              </div>
            </div>
            {seller.isPro && (
              <span className="rounded-lg bg-primary/10 px-2 py-1 text-[9px] font-extrabold tracking-wider text-primary">PRO</span>
            )}
          </button>
        )}

        {/* Boost */}
        {isOwner && product.status !== "patrocinado" && (
          <button
            onClick={() => { boostProduct(product.id); toast.success("⚡ Anúncio impulsionado!"); }}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 active:scale-[0.98] transition-all"
          >
            <Zap size={16} className="text-primary-foreground" />
            <span className="text-[13px] font-bold text-primary-foreground">Impulsionar Anúncio</span>
          </button>
        )}
      </div>

      {/* Fixed CTA */}
      {!isOwner && (
        <div className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-border/30 px-5 pb-5 pt-3 safe-bottom">
          <div className="mx-auto flex max-w-md gap-3">
            <button
              onClick={() => toggleFavorite(product.id)}
              className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl border transition-all active:scale-95 ${
                fav ? "border-primary/30 bg-primary/10" : "border-border surface"
              }`}
            >
              <Heart size={20} className={fav ? "fill-primary text-primary" : "text-muted-foreground"} />
            </button>
            <button
              onClick={() => { toast.success("Abrindo chat com vendedor..."); navigate("/chat"); }}
              className="flex flex-1 items-center justify-center gap-2.5 rounded-2xl bg-primary py-3.5 font-bold text-[15px] text-primary-foreground transition-all active:scale-[0.98]"
            >
              <MessageCircle size={18} />
              Falar com vendedor
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
