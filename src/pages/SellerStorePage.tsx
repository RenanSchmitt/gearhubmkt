import { ArrowLeft, Star, MapPin, ShieldCheck } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { sellers } from "@/data/mockData";
import { useStore } from "@/hooks/useStore";
import ProductCard from "@/components/ProductCard";

const SellerStorePage = () => {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const { getSellerProducts } = useStore();
  const seller = sellers.find(s => s.id === sellerId);

  if (!seller) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loja não encontrada.</p>
      </div>
    );
  }

  const sellerProducts = getSellerProducts(seller.id);

  return (
    <div className="min-h-screen pb-28 px-5 pt-4">
      <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-xl surface active:scale-95 mb-4">
        <ArrowLeft size={18} className="text-foreground" />
      </button>

      <div className="rounded-2xl surface p-5 card-shadow mb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 text-primary text-xl font-black">
            {seller.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-[17px] font-bold text-foreground truncate">{seller.name}</h1>
              {seller.isPro && (
                <span className="rounded-md bg-primary/15 px-2 py-0.5 text-[9px] font-extrabold tracking-wider text-primary">PRO</span>
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <MapPin size={11} className="text-muted-foreground" />
              <span className="text-[11px] text-muted-foreground">{seller.location}</span>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <Star size={12} className="fill-primary text-primary" />
              <span className="text-[13px] font-bold text-foreground">{seller.rating}</span>
              <span className="text-[11px] text-muted-foreground">• {seller.sales} vendas</span>
              <ShieldCheck size={12} className="text-primary ml-1" />
            </div>
          </div>
        </div>
        <p className="mt-3 text-[13px] leading-relaxed text-secondary-foreground">{seller.description}</p>
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[15px] font-bold text-foreground">Anúncios da loja</h2>
        <span className="text-[11px] font-medium text-muted-foreground">{sellerProducts.length} itens</span>
      </div>

      {sellerProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {sellerProducts.map((product, i) => (
            <div key={product.id} className="relative">
              <ProductCard product={product} index={i} />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl surface p-6 text-center">
          <p className="text-sm text-muted-foreground">Nenhum anúncio nesta loja</p>
        </div>
      )}
    </div>
  );
};

export default SellerStorePage;
