import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send, CheckCheck, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

// Nota: Mantivemos o acesso aos sellers/products para pegar as infos estéticas (foto/nome)
// mas as mensagens agora vêm do banco.
import { sellers, products } from "@/data/mockData";

const ChatView = () => {
  const { threadId } = useParams();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Identificar o usuário e buscar histórico
  useEffect(() => {
    const initChat = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (threadId) {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .eq("thread_id", threadId)
          .order("created_at", { ascending: true });

        if (error) toast.error("Erro ao carregar histórico");
        else setMessages(data || []);
      }
      setLoading(false);
    };

    initChat();
  }, [threadId]);

  // 2. Configurar o Realtime (Escutar novas mensagens)
  useEffect(() => {
    if (!threadId) return;

    const channel = supabase
      .channel(`chat_thread_${threadId}`)
      .on(
        "postgres_changes",
        { 
          event: "INSERT", 
          schema: "public", 
          table: "messages", 
          filter: `thread_id=eq.${threadId}` 
        },
        (payload) => {
          setMessages((prev) => {
            // Evita duplicados caso o insert retorne para quem enviou
            if (prev.find(m => m.id === payload.new.id)) return prev;
            return [...prev, payload.new];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [threadId]);

  // 3. Scroll automático para a última mensagem
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 4. Enviar mensagem para o Supabase
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !threadId) return;

    const tempText = newMessage;
    setNewMessage(""); // Limpa o input (Optimistic UI)

    const { error } = await supabase.from("messages").insert({
      text: tempText,
      sender_id: user.id,
      thread_id: threadId,
    });

    if (error) {
      toast.error("Erro ao enviar");
      setNewMessage(tempText); // Devolve o texto em caso de erro
    }
  };

  // Mock-up das infos do vendedor para o Header (Ajustar conforme seu banco)
  const seller = sellers[0]; 
  const product = products[0];

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 className="animate-spin text-[#ccff00]" size={32} />
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col bg-black text-white pb-24">
      
      {/* HEADER COCKPIT */}
      <div className="sticky top-0 z-40 bg-zinc-900/80 backdrop-blur-xl border-b border-white/5 px-4 py-4 flex items-center gap-3">
        <button onClick={() => navigate("/chat")} className="h-10 w-10 flex items-center justify-center rounded-full bg-zinc-800 border border-white/5 active:scale-90">
          <ArrowLeft size={18} />
        </button>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ccff00] text-black font-black italic text-sm">
          {seller.name.charAt(0)}
        </div>
        <div>
          <p className="text-[13px] font-black italic uppercase tracking-tighter">{seller.name}</p>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-[#ccff00] animate-pulse" />
            <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Online agora</p>
          </div>
        </div>
      </div>

      {/* REFERÊNCIA DO PRODUTO */}
      {product && (
        <div className="mx-4 mt-4 flex items-center gap-3 rounded-[24px] bg-zinc-900/50 border border-white/5 p-3">
          <img src={product.image} alt={product.title} className="h-12 w-12 rounded-[16px] object-cover border border-white/10" />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold text-zinc-400 truncate uppercase">{product.title}</p>
            <p className="text-[14px] font-black italic text-[#ccff00]">R$ {product.price.toLocaleString("pt-BR")}</p>
          </div>
        </div>
      )}

      {/* LISTA DE MENSAGENS REALTIME */}
      <div className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
        {messages.map((msg) => {
          const isMe = msg.sender_id === user?.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] px-4 py-3 ${
                  isMe
                    ? "bg-[#ccff00] text-black rounded-[20px] rounded-br-[4px] font-bold shadow-[0_4px_15px_rgba(204,255,0,0.1)]"
                    : "bg-zinc-900 text-zinc-200 rounded-[20px] rounded-bl-[4px] border border-white/5 font-medium"
                }`}
              >
                <p className="text-[13px] leading-relaxed tracking-tight">{msg.text}</p>
                <div className={`mt-1 flex items-center justify-end gap-1 text-[9px] font-black uppercase ${isMe ? "text-black/50" : "text-zinc-600"}`}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {isMe && <CheckCheck size={12} />}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* INPUT FIXO */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-t border-white/5 px-4 py-4 safe-bottom">
        <form onSubmit={handleSendMessage} className="mx-auto flex max-w-md items-center gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="MENSAGEM..."
            className="flex-1 rounded-[20px] bg-zinc-900 border border-white/5 py-4 px-6 text-[12px] font-bold uppercase tracking-widest text-white placeholder:text-zinc-600 outline-none focus:border-[#ccff00]/30 transition-all"
          />
          <button 
            type="submit"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] bg-[#ccff00] text-black active:scale-90 transition-all shadow-[0_0_20px_rgba(204,255,0,0.2)] disabled:opacity-50"
            disabled={!newMessage.trim()}
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatView;