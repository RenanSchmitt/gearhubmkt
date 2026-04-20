import { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, Camera, Loader2, Check, 
  User, Phone
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const EditProfile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  const [profile, setProfile] = useState({
    nome: "",
    telefone: "",
    cidade: "",
    estado: "",
    bio: "",
    avatar_url: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return navigate("/login");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      
      if (data) {
        setProfile({
          nome: data.nome || "",
          telefone: data.telefone || "",
          cidade: data.cidade || "",
          estado: data.estado || "",
          bio: data.bio || "",
          avatar_url: data.avatar_url || ""
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      const previewUrl = URL.createObjectURL(file);
      setProfile(prev => ({ ...prev, avatar_url: previewUrl }));
      setImageLoadError(false);
      
      setSaving(true);

      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${authUser.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profile_photo')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('profile_photo')
        .getPublicUrl(filePath);

      setProfile(prev => ({ ...prev, avatar_url: data.publicUrl }));
      toast.success("Foto carregada!");

    } catch (error: any) {
      console.error(error);
      toast.error("Erro no upload.");
      fetchProfile(); 
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (saving) return;
    
    try {
      setSaving(true);
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const { error } = await supabase
        .from("profiles")
        .update({
          nome: profile.nome.toUpperCase(),
          telefone: profile.telefone,
          cidade: profile.cidade.toUpperCase(),
          estado: profile.estado.toUpperCase(),
          bio: profile.bio,
          avatar_url: profile.avatar_url,
        })
        .eq("id", authUser.id);

      if (error) throw error;

      toast.success("PERFIL ATUALIZADO! 🏁");
      
      // O segredo para não travar: aguarda um pouco e força a navegação
      setTimeout(() => {
        navigate("/perfil");
      }, 800);

    } catch (error: any) {
      console.error(error);
      toast.error("Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 size={32} className="animate-spin text-[#ccff00]" />
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-20">
      <div className="px-6 pt-10 flex items-center justify-between mb-8">
        <button onClick={() => navigate("/perfil")} className="h-12 w-12 bg-zinc-900 rounded-2xl flex items-center justify-center border border-white/5">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-black italic uppercase tracking-tighter text-[#ccff00]">Editar Perfil</h1>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="h-12 w-12 bg-[#ccff00] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(204,255,0,0.3)] disabled:opacity-50"
        >
          {saving ? <Loader2 size={20} className="animate-spin text-black" /> : <Check size={20} className="text-black" />}
        </button>
      </div>

      <div className="px-6 space-y-8">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="h-32 w-32 rounded-[40px] overflow-hidden border-4 border-zinc-900 bg-zinc-800 flex items-center justify-center shadow-2xl">
              {profile.avatar_url && !imageLoadError ? (
                <img 
                  src={profile.avatar_url} 
                  className="h-full w-full object-cover" 
                  alt="" 
                  onError={() => setImageLoadError(true)}
                />
              ) : (
                <User size={48} className="text-zinc-700" />
              )}
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 h-11 w-11 bg-[#ccff00] rounded-2xl flex items-center justify-center border-4 border-black"
            >
              <Camera size={18} className="text-black" />
            </button>
            <input type="file" ref={fileInputRef} onChange={handleUploadAvatar} className="hidden" accept="image/*" />
          </div>
          <p className="mt-4 text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em]">Toque para alterar foto</p>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-500 ml-2 tracking-widest text-[#ccff00]">Nome do Piloto</label>
            <input 
              type="text" 
              value={profile.nome} 
              onChange={(e) => setProfile({...profile, nome: e.target.value})} 
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-5 px-6 text-sm font-bold outline-none focus:border-[#ccff00]/50 uppercase" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-500 ml-2 tracking-widest text-[#ccff00]">Bio / Descrição</label>
            <textarea 
              rows={3} 
              value={profile.bio} 
              onChange={(e) => setProfile({...profile, bio: e.target.value})} 
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-5 px-6 text-sm font-bold outline-none focus:border-[#ccff00]/50 resize-none" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-zinc-500 ml-2 tracking-widest text-[#ccff00]">Cidade</label>
              <input 
                type="text" 
                value={profile.cidade} 
                onChange={(e) => setProfile({...profile, cidade: e.target.value})} 
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-5 px-6 text-sm font-bold outline-none" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-zinc-500 ml-2 tracking-widest text-[#ccff00]">Estado (UF)</label>
              <input 
                type="text" 
                maxLength={2} 
                value={profile.estado} 
                onChange={(e) => setProfile({...profile, estado: e.target.value.toUpperCase()})} 
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-5 px-6 text-sm font-bold outline-none" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-500 ml-2 tracking-widest text-[#ccff00]">WhatsApp</label>
            <div className="relative">
              <Phone size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input 
                type="text" 
                value={profile.telefone} 
                onChange={(e) => setProfile({...profile, telefone: e.target.value})} 
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-5 pl-14 pr-6 text-sm font-bold outline-none focus:border-[#ccff00]/50" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;