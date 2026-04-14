import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Product } from "@/data/mockData";
import { useStore } from "@/hooks/useStore";

const ProductCard = ({ product, index = 0, showBadge }: { product: Product; index?: number; showBadge?: string }) => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useStore();
  const fav = isFavorite(product.id);
  const placeholder = "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&q=80";

  return (
    <div
      className="animate-fade-up flex flex-col overflow-hidden rounded-2xl bg-card card-shadow"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <button onClick={() => navigate(`/produto/${product.id}`)} className="relative aspect-square w-full overflow-hidden">
        <img
          src={product.image || placeholder}
          alt={product.title}
          loading="lazy"
          width={512}
          height={512}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => { (e.target as HTMLImageElement).src = placeholder; }}
        />
        {product.isPro && (
          <span className="absolute left-2 top-2 rounded-md bg-primary px-2 py-0.5 text-[9px] font-extrabold tracking-widest text-primary-foreground">
            PRO
          </span>
        )}
        {showBadge === "patrocinado" && (
          <span className="absolute left-2 bottom-2 rounded-md bg-accent/90 px-2 py-0.5 text-[9px] font-bold text-accent-foreground">
            Patrocinado
          </span>
        )}
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-xl glass transition-all active:scale-90"
      >
        <Heart size={15} className={`transition-all ${fav ? "fill-primary text-primary animate-heart-pop" : "text-foreground/70"}`} />
      </button>

      <button onClick={() => navigate(`/produto/${product.id}`)} className="flex flex-col gap-1 p-3 text-left">
        <span className="line-clamp-1 text-[13px] font-semibold text-foreground">{product.title}</span>
        <span className="text-[15px] font-extrabold text-primary">
          R$ {product.price.toLocaleString("pt-BR")}
        </span>
      </button>
    </div>
  );
};

export default ProductCard;
