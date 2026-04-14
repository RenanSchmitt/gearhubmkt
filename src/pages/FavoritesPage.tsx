import { Heart } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import ProductCard from "@/components/ProductCard";

const FavoritesPage = () => {
  const { favorites, products } = useStore();
  const favProducts = products.filter((p) => favorites.has(p.id));

  return (
    <div className="min-h-screen pb-28 px-5 pt-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Salvos</p>
      <h1 className="text-[22px] font-black tracking-tight text-foreground mt-1 mb-5">Favoritos</h1>

      {favProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {favProducts.map((product, i) => (
            <div key={product.id} className="relative">
              <ProductCard product={product} index={i} />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-20 flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl surface mb-4">
            <Heart size={28} className="text-muted-foreground/30" />
          </div>
          <p className="text-sm font-bold text-foreground">Nenhum favorito ainda</p>
          <p className="text-xs text-muted-foreground mt-1.5 max-w-[200px]">
            Toque no ❤️ nos anúncios para salvar suas peças favoritas aqui
          </p>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
