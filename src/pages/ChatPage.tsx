import { ArrowLeft, Send } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { chatThreads, sellers, products } from "@/data/mockData";

const ChatView = ({ threadId }: { threadId: string }) => {
  const navigate = useNavigate();
  const thread = chatThreads.find((t) => t.id === threadId);
  const seller = thread ? sellers.find((s) => s.id === thread.sellerId) : null;
  const product = thread ? products.find((p) => p.id === thread.productId) : null;

  if (!thread || !seller) return null;

  return (
    <div className="flex min-h-screen flex-col pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 glass-strong border-b border-border/30 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate("/chat")} className="flex h-9 w-9 items-center justify-center rounded-xl surface active:scale-95">
          <ArrowLeft size={18} className="text-foreground" />
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary font-bold text-xs shrink-0">
          {seller.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-bold text-foreground truncate">{seller.name}</p>
          <p className="text-[10px] text-muted-foreground">Online agora</p>
        </div>
      </div>

      {/* Product reference */}
      {product && (
        <div className="mx-4 mt-3 flex items-center gap-3 rounded-2xl surface p-3">
          <img src={product.image} alt={product.title} className="h-11 w-11 rounded-xl object-cover" />
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-semibold text-foreground truncate">{product.title}</p>
            <p className="text-[12px] font-bold text-primary">R$ {product.price.toLocaleString("pt-BR")}</p>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 px-4 py-4 space-y-3">
        {thread.messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[78%] rounded-2xl px-4 py-2.5 ${
                msg.sender === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "surface text-foreground rounded-bl-md"
              }`}
            >
              <p className="text-[13px] leading-relaxed">{msg.text}</p>
              <p className={`mt-1 text-[10px] text-right ${msg.sender === "user" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-border/30 px-4 py-3 safe-bottom">
        <div className="mx-auto flex max-w-md items-center gap-2">
          <input
            type="text"
            placeholder="Digite uma mensagem..."
            className="flex-1 rounded-2xl surface py-3 px-4 text-[13px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary active:scale-95 transition-all">
            <Send size={16} className="text-primary-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

const ChatList = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-28 px-5 pt-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Mensagens</p>
      <h1 className="text-[22px] font-black tracking-tight text-foreground mt-1 mb-5">Chat</h1>

      <div className="space-y-2">
        {chatThreads.map((thread) => {
          const seller = sellers.find((s) => s.id === thread.sellerId);
          const product = products.find((p) => p.id === thread.productId);
          if (!seller) return null;

          return (
            <button
              key={thread.id}
              onClick={() => navigate(`/chat/${thread.id}`)}
              className="flex w-full items-center gap-3.5 rounded-2xl surface p-3.5 text-left transition-all active:scale-[0.98]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary font-bold text-sm shrink-0">
                {seller.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[13px] font-bold text-foreground truncate">{seller.name}</p>
                  <span className="text-[10px] font-medium text-muted-foreground shrink-0">{thread.lastTime}</span>
                </div>
                <p className="text-[12px] text-muted-foreground truncate mt-0.5">
                  {product && <span className="font-semibold text-foreground/60">{product.title} · </span>}
                  {thread.lastMessage}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const ChatPage = () => {
  const { threadId } = useParams();

  if (threadId) return <ChatView threadId={threadId} />;
  return <ChatList />;
};

export default ChatPage;
