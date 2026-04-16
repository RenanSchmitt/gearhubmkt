import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { 
  Loader2, Mail, Lock, User, Phone, ArrowRight, 
  MapPin, Home, Hash, Navigation, UserPlus, ShieldCheck, X 
} from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); 
  
  const [isNewUser, setIsNewUser] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    cep: "",
    street: "",
    number: "",
    city: "",
    state: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isNewUser && password !== confirmPassword) {
      return toast.error("As senhas não coincidem!");
    }
    setLoading(true);

    try {
      if (isNewUser) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              nome: formData.fullName,
              telefone: formData.phone,
              cep: formData.cep,
              rua: formData.street,
              numero: formData.number,
              cidade: formData.city,
              estado: formData.state,
              account_status: 'standard'
            }
          }
        });
        if (signUpError) throw signUpError;
        toast.success("Perfil criado! Bem-vindo ao time.");
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (!signInError) navigate("/");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) {
          if (signInError.message.includes("Invalid login credentials")) {
            setIsNewUser(true);
            toast.info("E-mail não encontrado. Complete seu cadastro!");
            setLoading(false);
            return;
          }
          throw signInError;
        }
        toast.success("Bem-vindo de volta!");
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error.message || "Erro na operação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col p-6 font-sans relative">
      
      {/* CONTAINER CENTRALIZADO PARA O CONTEÚDO */}
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-center relative py-12">
        
        {/* BOTÃO FECHAR (X) - Agora posicionado relativo ao conteúdo do app */}
        <button 
          onClick={() => navigate("/")} 
          className="absolute top-0 right-0 h-10 w-10 flex items-center justify-center rounded-full bg-zinc-900 border border-white/5 text-zinc-400 active:scale-90 transition-all z-50"
        >
          <X size={20} />
        </button>

        <div className="mb-8 text-center space-y-2">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-[#ccff00]">GearHub</h1>
          <p className="text-zinc-500 uppercase tracking-[0.3em] text-[10px] font-bold">
            {isNewUser ? "Registro de Piloto" : "Acesso ao Hub"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="w-full space-y-4">
          
          {/* 1. DADOS PESSOAIS (SÓ NO CADASTRO) */}
          {isNewUser && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ccff00]" size={18} />
                <input
                  name="fullName"
                  placeholder="NOME COMPLETO"
                  className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 pl-12 pr-4 font-bold text-[13px] outline-none focus:border-[#ccff00]/30 transition-all"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ccff00]" size={18} />
                <input
                  name="phone"
                  placeholder="WHATSAPP (DDD)"
                  className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 pl-12 pr-4 font-bold text-[13px] outline-none focus:border-[#ccff00]/30 transition-all"
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* 2. BLOCO DE ENDEREÇO */}
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input name="cep" placeholder="CEP" className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 pl-12 pr-4 font-bold text-[13px] outline-none" onChange={handleInputChange} required />
                </div>
                <div className="relative">
                  <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input name="state" placeholder="UF" className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 pl-12 pr-4 font-bold text-[13px] outline-none" onChange={handleInputChange} required />
                </div>
              </div>
              <div className="relative">
                <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input name="street" placeholder="RUA / LOGRADOURO" className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 pl-12 pr-4 font-bold text-[13px] outline-none" onChange={handleInputChange} required />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="relative col-span-1">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input name="number" placeholder="Nº" className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 pl-12 pr-4 font-bold text-[13px] outline-none" onChange={handleInputChange} required />
                </div>
                <div className="relative col-span-2">
                  <input name="city" placeholder="CIDADE" className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 font-bold text-[13px] outline-none" onChange={handleInputChange} required />
                </div>
              </div>
              <div className="h-[1px] bg-zinc-800 w-full my-4"></div>
            </div>
          )}

          {/* 3. BLOCO DE ACESSO (EMAIL E SENHA) */}
          <div className="bg-zinc-900/40 border border-white/5 rounded-[32px] p-2 space-y-1">
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input
                type="email"
                placeholder="EMAIL@EXEMPLO.COM"
                className="w-full bg-transparent border-none rounded-2xl py-5 pl-14 pr-4 font-bold text-[13px] outline-none focus:bg-white/5 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                required
              />
            </div>
            
            <div className="h-[1px] bg-white/5 mx-4"></div>

            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input
                type="password"
                placeholder="SENHA"
                className="w-full bg-transparent border-none rounded-2xl py-5 pl-14 pr-4 font-bold text-[13px] outline-none focus:bg-white/5 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {isNewUser && (
              <>
                <div className="h-[1px] bg-white/5 mx-4"></div>
                <div className="relative animate-in slide-in-from-top-2 duration-300">
                  <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-[#ccff00]" size={18} />
                  <input
                    type="password"
                    placeholder="CONFIRMAR SENHA"
                    className="w-full bg-transparent border-none rounded-2xl py-5 pl-14 pr-4 font-bold text-[13px] outline-none focus:bg-white/5 transition-all"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ccff00] text-black font-black uppercase italic py-5 rounded-[22px] shadow-[0_15px_30px_rgba(204,255,0,0.2)] active:scale-[0.97] transition-all flex items-center justify-center gap-3 mt-6"
          >
            {loading ? <Loader2 className="animate-spin" /> : (
              <>
                <span>{isNewUser ? "Finalizar Cadastro" : "Acessar Hub"}</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>

          <div className="pt-4 text-center">
            {!isNewUser ? (
              <button type="button" onClick={() => setIsNewUser(true)} className="group inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-[#ccff00] transition-colors">
                Novo por aqui? <span className="text-white group-hover:text-[#ccff00] underline underline-offset-4 decoration-[#ccff00]/30">Crie sua conta</span>
                <UserPlus size={14} />
              </button>
            ) : (
              <button type="button" onClick={() => setIsNewUser(false)} className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
                JÁ TEM CONTA? <span className="underline underline-offset-4">VOLTAR PARA O LOGIN</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;