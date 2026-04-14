import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/hooks/useStore";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const LoginPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { login } = useStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) { toast.error("Preencha todos os campos."); return; }
    login(name, email);
    toast.success(`Bem-vindo, ${name}! 🎉`);
    navigate("/perfil");
  };

  const inputClass =
    "w-full rounded-2xl surface py-3.5 px-4 text-[13px] font-medium text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow";

  return (
    <div className="min-h-screen px-5 pt-4 pb-28">
      <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-xl surface active:scale-95 mb-6">
        <ArrowLeft size={18} className="text-foreground" />
      </button>

      <div className="text-center mb-8">
        <h1 className="text-[24px] font-black text-gradient">GearHub</h1>
        <p className="text-[13px] text-muted-foreground mt-2">Entre para comprar e vender peças</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Nome</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" className={inputClass} />
        </div>
        <div>
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" className={inputClass} />
        </div>
        <div className="pt-2">
          <button type="submit" className="w-full rounded-2xl bg-primary py-4 font-bold text-[15px] text-primary-foreground transition-all active:scale-[0.98] glow-primary">
            Entrar / Cadastrar
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
