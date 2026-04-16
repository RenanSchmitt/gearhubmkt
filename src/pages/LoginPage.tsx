import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Caminho corrigido para o seu arquivo existente em src/lib/supabase.js
import { supabase } from "../lib/supabase";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Preencha e-mail e senha.");
      return;
    }

    setLoading(true);
    
    // Tenta logar
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      // Se não encontrar o usuário, tenta cadastrar automaticamente
      if (loginError.message.includes("Invalid login credentials") || loginError.message.includes("Email not confirmed")) {
        toast.info("Tentando criar sua conta nova...");
        
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) {
          toast.error(signUpError.message);
        } else {
          toast.success("Conta criada! Verifique seu e-mail para confirmar.");
        }
      } else {
        toast.error(loginError.message);
      }
    } else {
      toast.success(`Bem-vindo de volta! 🏎️`);
      navigate("/perfil");
    }
    
    setLoading(false);
  };

  // Classe dos inputs: Fundo grafite, texto branco e foco em verde limão
  const inputClass =
    "w-full rounded-2xl py-3.5 px-4 text-[13px] font-medium text-white placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-[#ccff00]/30 transition-shadow bg-zinc-900 border-none";

  return (
    <div className="min-h-screen px-5 pt-4 pb-28 bg-black">
      {/* Botão de Voltar */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex h-10 w-10 items-center justify-center rounded-xl active:scale-95 mb-6 bg-zinc-900"
      >
        <ArrowLeft size={18} className="text-white" />
      </button>

      {/* Header com a Logo Estilizada */}
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4">
           <h1 className="text-[32px] font-black italic tracking-tighter text-[#ccff00]">
             GEARHUB
           </h1>
        </div>
        <p className="text-[13px] text-muted-foreground font-medium uppercase tracking-wider">
          Marketplace Automotivo
        </p>
      </div>

      {/* Formulário */}
      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="seu@email.com" 
            className={inputClass} 
          />
        </div>
        <div>
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Senha</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="••••••••" 
            className={inputClass} 
          />
        </div>
        
        <div className="pt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full rounded-2xl bg-[#ccff00] py-4 font-bold text-[15px] text-black transition-all active:scale-[0.98] shadow-[0_10px_30px_rgba(204,255,0,0.2)] flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              "ENTRAR OU CADASTRAR"
            )}
          </button>
        </div>
      </form>

      {/* Footer legal */}
      <p className="text-center text-[11px] text-muted-foreground mt-12 px-10 leading-relaxed">
        Ao continuar, você concorda com os <span className="text-white underline font-bold">Termos de Uso</span> do marketplace.
      </p>
    </div>
  );
};

export default LoginPage;