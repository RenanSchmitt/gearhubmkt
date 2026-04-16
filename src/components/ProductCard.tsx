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
      className="group animate-fade-up flex flex-col overflow-hidden rounded-[28px] bg-zinc-900/50 border border-white/5 hover:border-[#ccff00]/30 transition-all duration-300"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="relative aspect-square w-full overflow-hidden p-2">
        <button 
          onClick={() => navigate(`/produto/${product.id}`)} 
          className="h-full w-full overflow-hidden rounded-[22px] relative"
        >
          <img
            src={product.image || placeholder}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => { (e.target as HTMLImageElement).src = placeholder; }}
          />
          
          {/* Overlay de gradiente para os badges */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>

        {/* Badges Estilizados */}
        {product.isPro && (
          <span className="absolute left-4 top-4 rounded-full bg-[#ccff00] px-3 py-1 text-[9px] font-black italic tracking-tighter text-black shadow-lg">
            PRO
          </span>
        )}
        
        {showBadge === "patrocinado" && (
          <span className="absolute left-4 bottom-4 rounded-lg bg-white/10 backdrop-blur-md px-2 py-1 text-[8px] font-bold uppercase tracking-widest text-white border border-white/10">
            Patrocinado
          </span>
        )}

        {/* Botão de Favorito Flutuante */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 backdrop-blur-xl border border-white/10 transition-all active:scale-90 hover:bg-[#ccff00] hover:text-black group/fav"
        >
          <Heart 
            size={16} 
            className={`transition-all ${fav ? "fill-[#ccff00] text-[#ccff00] group-hover/fav:fill-black group-hover/fav:text-black" : "text-white"}`} 
          />
        </button>
      </div>

      <button onClick={() => navigate(`/produto/${product.id}`)} className="flex flex-col gap-1 p-4 pt-1 text-left">
        <span className="line-clamp-1 text-[12px] font-bold uppercase tracking-tight text-zinc-400 group-hover:text-white transition-colors">
          {product.title}
        </span>
        <div className="flex items-end justify-between">
          <span className="text-[18px] font-black italic uppercase tracking-tighter text-[#ccff00]">
            R$ {product.price.toLocaleString("pt-BR")}
          </span>
          <span className="text-[10px] font-bold text-zinc-600 mb-1 uppercase tracking-widest">
            GearHub
          </span>
        </div>
      </button>
    </div>
  );
};

export default ProductCard;