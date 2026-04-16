import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, Send, CheckCheck, Loader2, MessageSquare } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

// --- COMPONENTE DA CONVERSA ---
const ChatView = ({ threadId }: { threadId: string }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initChat = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser);

      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("thread_id", threadId)
        .order("created_at", { ascending: true });

      setMessages(data || []);
      setLoading(false);
    };
    initChat();
  }, [threadId]);

  useEffect(() => {
    const channel = supabase.channel(`chat_${threadId}`)
      .on("postgres_changes", { 
        event: "INSERT", 
        schema: "public", 
        table: "messages", 
        filter: `thread_id=eq.${threadId}` 
      }, (payload) => {
        setMessages((prev) => {
          if (prev.find(m => m.id === payload.new.id)) return prev;
          return [...prev, payload.new];
        });
      }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [threadId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    // 1. Identificar quem é o Comprador (sempre o final da thread)
    const threadParts = threadId.split('_');
    const productId = threadParts[0];
    const buyerId = threadParts[threadParts.length - 1];

    let targetId = "";

    if (user.id === buyerId) {
      // EU SOU O COMPRADOR -> O alvo é o Vendedor
      targetId = location.state?.sellerId; // Tenta pegar do clique no produto

      if (!targetId) {
        // Se não veio do state, tenta pegar de alguma mensagem que eu recebi
        const receivedMsg = messages.find(m => m.sender_id !== user.id);
        targetId = receivedMsg?.sender_id;
      }

      if (!targetId) {
        // Último recurso: Busca no banco quem é o dono do produto
        const { data: prod } = await supabase
          .from('products')
          .select('seller_id')
          .eq('id', productId)
          .single();
        targetId = prod?.seller_id;
      }
    } else {
      // EU SOU O VENDEDOR -> O alvo é o Comprador
      targetId = buyerId;
    }

    if (!targetId) {
      return toast.error("Não foi possível identificar o destinatário.");
    }

    const { error } = await supabase.from("messages").insert({
      text: newMessage,
      sender_id: user.id,
      receiver_id: targetId,
      thread_id: threadId,
    });

    if (error) {
      console.error("❌ Erro ao enviar:", error);
      toast.error("Erro ao enviar: " + error.message);
    } else {
      setNewMessage("");
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-black">
      <Loader2 className="animate-spin text-[#ccff00]" />
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col bg-black text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-zinc-900/80 backdrop-blur-xl border-b border-white/5 px-4 py-4 flex items-center gap-3">
        <button onClick={() => navigate("/chat")} className="h-10 w-10 flex items-center justify-center rounded-full bg-zinc-800 border border-white/5">
          <ArrowLeft size={18} />
        </button>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ccff00] text-black font-black italic">
          <MessageSquare size={18} />
        </div>
        <div>
          <p className="text-[13px] font-black italic uppercase tracking-tighter">Negociação</p>
          <p className="text-[9px] font-bold text-[#ccff00] uppercase tracking-widest">GearHub Chat</p>
        </div>
      </div>

      {/* Mensagens */}
      <div className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
        {messages.length === 0 && (
          <div className="text-center py-10">
            <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest italic">Inicie a conversa abaixo</p>
          </div>
        )}
        {messages.map((msg) => {
          const isMe = msg.sender_id === user?.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] px-4 py-3 ${isMe ? "bg-[#ccff00] text-black rounded-[20px] rounded-br-[4px] font-bold" : "bg-zinc-900 text-zinc-200 rounded-[20px] rounded-bl-[4px] border border-white/5"}`}>
                <p className="text-[13px] leading-relaxed italic tracking-tighter uppercase">{msg.text}</p>
                <div className={`mt-1 flex items-center justify-end gap-1 text-[8px] font-black uppercase ${isMe ? "text-black/40" : "text-zinc-600"}`}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {isMe && <CheckCheck size={10} />}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="fixed bottom-[72px] left-0 right-0 z-50 bg-black/90 backdrop-blur-md px-4 py-4 border-t border-white/5">
        <form onSubmit={handleSendMessage} className="mx-auto flex max-w-md items-center gap-3">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="MENSAGEM..."
            className="flex-1 rounded-[20px] bg-zinc-900 border border-white/5 py-4 px-6 text-[12px] font-bold text-white outline-none focus:border-[#ccff00]/30 transition-all uppercase italic"
          />
          <button type="submit" disabled={!newMessage.trim()} className="h-14 w-14 flex items-center justify-center rounded-[20px] bg-[#ccff00] text-black shadow-[0_0_20px_rgba(204,255,0,0.2)] disabled:opacity-50">
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

// --- COMPONENTE DA LISTA ---
const ChatList = () => {
  const navigate = useNavigate();
  const [threads, setThreads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const fetchThreads = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUserId(user.id);

    // Busca mensagens onde você é o remetente OU destinatário
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const unique = data.reduce((acc: any[], current) => {
        if (!acc.find(item => item.thread_id === current.thread_id)) acc.push(current);
        return acc;
      }, []);
      setThreads(unique);
    }
    setLoading(false);
  };

  useEffect(() => { fetchThreads(); }, []);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-black">
      <Loader2 className="animate-spin text-[#ccff00]" />
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      <header className="p-6 pt-12">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ccff00] mb-2">Central de Negócios</p>
        <h1 className="text-3xl font-black italic uppercase text-white mb-6 tracking-tighter">Mensagens</h1>
      </header>

      <div className="px-6 space-y-3">
        {threads.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-[32px]">
            <p className="text-zinc-600 font-bold uppercase text-[10px] italic tracking-widest">Nenhuma negociação ativa</p>
          </div>
        ) : (
          threads.map((thread) => (
            <button
              key={thread.id}
              onClick={() => navigate(`/chat/${thread.thread_id}`)}
              className="flex w-full items-center gap-4 rounded-[28px] bg-zinc-900/40 border border-white/5 p-4 text-left active:scale-[0.98] transition-all"
            >
              <div className="h-14 w-14 rounded-[20px] bg-zinc-800 flex items-center justify-center text-[#ccff00] font-black italic text-lg shadow-[inset_0_0_10px_rgba(204,255,0,0.1)]">
                {thread.sender_id === userId ? "EU" : "RX"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="text-[13px] font-black italic uppercase text-white">Negociação</p>
                  <span className="text-[9px] font-bold text-zinc-600">
                    {new Date(thread.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[12px] text-zinc-500 truncate mt-1 font-medium italic uppercase tracking-tighter">
                  {thread.text}
                </p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

// --- EXPORT PRINCIPAL ---
const ChatPage = () => {
  const { threadId } = useParams();
  return threadId ? <ChatView threadId={threadId} /> : <ChatList />;
};

export default ChatPage;