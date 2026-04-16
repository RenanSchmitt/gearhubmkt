import { useState, useEffect } from "react";
import { Camera, ChevronDown, ArrowLeft, Loader2, X, Save } from "lucide-react";
import { carFilters } from "@/data/mockData";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const EditAdvertisePage = () => {
  const { id } = useParams(); // Pega o ID do produto pela URL
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [car, setCar] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);

  // --- 1. CARREGAR DADOS DO ANÚNCIO ---
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data: product, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        if (product) {
          setTitle(product.title);
          setPrice(product.price.toString());
          setDescription(product.description || "");
          setCar(product.compatibility?.[0] || "");
          setImageUrl(product.image);
        }
      } catch (err: any) {
        toast.error("Erro ao carregar anúncio: " + err.message);
        navigate("/perfil");
      } finally {
        setFetching(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  // --- 2. LÓGICA DE UPLOAD (IGUAL À DE ANUNCIAR) ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;

      const file = e.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}-${new Date().getTime()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("pecas")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("pecas").getPublicUrl(filePath);
      setImageUrl(data.publicUrl);
      toast.success("Nova foto carregada!");
    } catch (error: any) {
      toast.error("Erro no upload: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  // --- 3. SALVAR ALTERAÇÕES ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("products")
        .update({
          title,
          price: Number(price),
          description,
          image: imageUrl,
          compatibility: car ? [car] : [],
          car_filter: car ? [car] : ["Universal"],
        })
        .eq("id", id);

      if (error) throw error;

      toast.success("Anúncio atualizado! 🛠️");
      navigate("/perfil", { state: { refresh: true } });
    } catch (err: any) {
      toast.error("Erro ao atualizar: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-2xl bg-zinc-900 border-none py-4 px-4 text-[14px] font-medium text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-[#ccff00]/30 transition-all uppercase italic";

  if (fetching) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 size={32} className="text-[#ccff00] animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-black pb-28 px-5 pt-6 text-white">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 bg-zinc-900 rounded-xl active:scale-90 transition-transform">
          <ArrowLeft size={20} className="text-[#ccff00]" />
        </button>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Gerenciar</p>
          <h1 className="text-[22px] font-black tracking-tight text-[#ccff00] italic uppercase">Editar Peça</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* PREVIEW DA FOTO */}
        <div className="relative">
          {imageUrl ? (
            <div className="relative h-48 w-full overflow-hidden rounded-3xl border-2 border-[#ccff00]/20">
              <img src={imageUrl} alt="Preview" className="h-full w-full object-cover" />
              <label className="absolute bottom-3 right-3 cursor-pointer rounded-full bg-[#ccff00] p-3 text-black shadow-lg active:scale-90 transition-transform">
                <Camera size={20} />
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          ) : (
            <label className="flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-zinc-800 py-10 bg-zinc-900/30">
              <Camera size={24} className="text-[#ccff00]" />
              <p className="text-xs font-bold uppercase tracking-widest text-[#ccff00]">Trocar Foto</p>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 ml-1">Título</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 ml-1">Preço (R$)</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} />
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
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 ml-1">Descrição</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className={`${inputClass} resize-none`} />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading || uploading} 
          className="w-full rounded-2xl bg-[#ccff00] py-4 font-black text-[14px] text-black transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(204,255,0,0.2)] uppercase tracking-widest flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Salvar Alterações</>}
        </button>
      </form>
    </div>
  );
};

export default EditAdvertisePage;