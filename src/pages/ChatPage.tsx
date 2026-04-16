import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, Send, CheckCheck, Loader2, MessageSquare } from "lucide-react";
import { supabase } from "@/lib/supabase";

// --- COMPONENTE DA CONVERSA (CHAT ABERTO) ---
const ChatView = ({ threadId }: { threadId: string }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const chatTitle = location.state?.chatTitle || "NEGOCIAÇÃO";

  useEffect(() => {
    const initChat = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser);
      const { data } = await supabase.from("messages").select("*").eq("thread_id", threadId).order("created_at", { ascending: true });
      setMessages(data || []);
      setLoading(false);
    };
    initChat();
  }, [threadId]);

  useEffect(() => {
    const channel = supabase.channel(`chat_${threadId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `thread_id=eq.${threadId}` }, 
      (payload) => {
        setMessages((prev) => prev.find(m => m.id === payload.new.id) ? prev : [...prev, payload.new]);
      }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [threadId]);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;
    
    const threadParts = threadId.split('_');
    const buyerId = threadParts[threadParts.length - 1];
    let targetId = user.id === buyerId ? location.state?.sellerId : buyerId;

    if (!targetId) {
      const otherMsg = messages.find(m => m.sender_id !== user.id);
      targetId = otherMsg?.sender_id;
    }

    const { error } = await supabase.from("messages").insert({
      text: newMessage, sender_id: user.id, receiver_id: targetId, thread_id: threadId,
    });
    if (!error) setNewMessage("");
  };

  return (
    <div className="flex min-h-screen flex-col bg-black text-white pb-24">
      {/* HEADER DO CHAT */}
      <div className="sticky top-0 z-40 bg-zinc-900/80 backdrop-blur-xl border-b border-white/5 px-4 py-4 flex items-center gap-3">
        <button onClick={() => navigate("/chat")} className="h-10 w-10 flex items-center justify-center rounded-full bg-zinc-800 border border-white/5 active:scale-90 transition-transform">
          <ArrowLeft size={18} />
        </button>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ccff00] text-black font-black italic shadow-[0_0_15px_rgba(204,255,0,0.2)]">
          <MessageSquare size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-black italic uppercase tracking-tighter leading-tight text-[#ccff00] truncate">{chatTitle}</p>
          <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">GearHub Messenger</p>
        </div>
      </div>
      
      {/* MENSAGENS */}
      <div className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
        {messages.map((msg) => {
          const isMe = msg.sender_id === user?.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] px-4 py-3 ${isMe ? "bg-[#ccff00] text-black rounded-[20px] rounded-br-[4px]" : "bg-zinc-900 text-zinc-200 rounded-[20px] rounded-bl-[4px] border border-white/5"}`}>
                <p className="text-[13px] font-bold italic uppercase tracking-tighter leading-tight">{msg.text}</p>
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

      {/* INPUT FIXO */}
      <div className="fixed bottom-[72px] left-0 right-0 z-50 bg-black/90 backdrop-blur-md px-4 py-4 border-t border-white/5">
        <form onSubmit={handleSendMessage} className="mx-auto flex max-w-md items-center gap-3">
          <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="MENSAGEM..." className="flex-1 rounded-[20px] bg-zinc-900 border border-white/5 py-4 px-6 text-[12px] font-bold text-white outline-none focus:border-[#ccff00]/30 transition-all uppercase italic" />
          <button type="submit" className="h-14 w-14 flex items-center justify-center rounded-[20px] bg-[#ccff00] text-black active:scale-95 transition-transform">
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

// --- LISTA DE CHATS (INBOX) ---
const ChatList = () => {
  const navigate = useNavigate();
  const [threads, setThreads] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchThreads = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return;
    setCurrentUser(authUser);

    const { data: msgs } = await supabase.from("messages")
      .select("*")
      .or(`sender_id.eq.${authUser.id},receiver_id.eq.${authUser.id}`)
      .order('created_at', { ascending: false });

    if (msgs) {
      const uniqueThreads = msgs.reduce((acc: any[], current) => {
        if (!acc.find(item => item.thread_id === current.thread_id)) acc.push(current);
        return acc;
      }, []);

      const updatedThreads = await Promise.all(uniqueThreads.map(async (t) => {
        // Lógica fundamental: O nome exibido é sempre da "OUTRA" pessoa
        const otherId = t.sender_id === authUser.id ? t.receiver_id : t.sender_id;
        const productId = t.thread_id.split('_')[0];

        // Busca o nome na coluna 'nome'
        const { data: profile } = await supabase
          .from('profiles')
          .select('nome')
          .eq('id', otherId)
          .single();
        
        // Busca o título do produto
        const { data: product } = await supabase
          .from('products')
          .select('title') 
          .eq('id', productId)
          .single();
        
        const finalName = (profile?.nome || "USUÁRIO").toUpperCase();
        const finalProduct = (product?.title || "PRODUTO").toUpperCase();
        
        return { 
          ...t, 
          chatDisplayName: `${finalName} - ${finalProduct}` 
        };
      }));

      setThreads(updatedThreads);
    }
    setLoading(false);
  };

  useEffect(() => { fetchThreads(); }, []);

  if (loading) return <div className="flex h-screen items-center justify-center bg-black"><Loader2 className="animate-spin text-[#ccff00]" /></div>;

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      <header className="p-6 pt-12">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter">Inbox</h1>
      </header>
      <div className="px-6 space-y-3">
        {threads.length > 0 ? threads.map((thread) => (
          <button 
            key={thread.id} 
            onClick={() => navigate(`/chat/${thread.thread_id}`, { state: { chatTitle: thread.chatDisplayName } })} 
            className="flex w-full items-center gap-4 rounded-[28px] bg-zinc-900/40 border border-white/5 p-4 text-left active:scale-[0.98] transition-all hover:bg-zinc-800/40"
          >
            <div className="h-12 w-12 rounded-[16px] bg-zinc-800 flex items-center justify-center text-[#ccff00] font-black italic">
               {thread.sender_id === currentUser?.id ? "OUT" : "IN"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-0.5">
                <p className="text-[13px] font-black italic uppercase text-[#ccff00] truncate">{thread.chatDisplayName}</p>
                <span className="text-[9px] font-black text-zinc-600">
                  {new Date(thread.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-[11px] text-zinc-300 truncate font-bold italic uppercase tracking-tighter">{thread.text}</p>
            </div>
          </button>
        )) : (
          <div className="flex flex-col items-center justify-center py-20 opacity-20">
            <MessageSquare size={48} />
            <p className="mt-4 font-black italic uppercase tracking-tighter">Sem mensagens</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ChatPage = () => {
  const { threadId } = useParams();
  return threadId ? <ChatView threadId={threadId} /> : <ChatList />;
};

export default ChatPage;