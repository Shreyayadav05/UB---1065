import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Bot, User, Loader2, ShieldCheck, Sparkles, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { Message } from "../types";
import { getChatResponse } from "../services/geminiService";
import Markdown from "react-markdown";

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", sender: "ai", text: "Hello! I'm your CareFusion AI assistant. How can I help you with your health today?", timestamp: Date.now() }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    socketRef.current = io();
    socketRef.current.on("message", (msg: Message) => {
      if (msg.sender !== "user") {
        setMessages(prev => [...prev, msg]);
      }
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await getChatResponse(input, "User is seeking general health guidance.");
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: response,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, aiMsg]);
      socketRef.current?.emit("message", aiMsg);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto h-[calc(100vh-8rem)] flex flex-col bg-white rounded-[2.5rem] shadow-xl border border-zinc-100 overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-zinc-200 rounded-xl transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="font-bold text-zinc-900">CareFusion AI Assistant</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Online & Secure</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-zinc-100 shadow-sm">
          <ShieldCheck className="text-emerald-500" size={16} />
          <span className="text-xs font-bold text-zinc-600">HIPAA Compliant</span>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={clsx(
                "flex gap-4 max-w-[85%]",
                msg.sender === "user" ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={clsx(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                msg.sender === "user" ? "bg-zinc-900 text-white" : "bg-emerald-100 text-emerald-600"
              )}>
                {msg.sender === "user" ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={clsx(
                "p-5 rounded-[1.5rem] text-sm leading-relaxed shadow-sm",
                msg.sender === "user" 
                  ? "bg-zinc-900 text-white rounded-tr-none" 
                  : "bg-zinc-50 text-zinc-800 rounded-tl-none border border-zinc-100"
              )}>
                <div className="markdown-body">
                  <Markdown>{msg.text}</Markdown>
                </div>
                <p className={clsx(
                  "text-[10px] mt-2 font-medium opacity-40",
                  msg.sender === "user" ? "text-right" : "text-left"
                )}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Bot size={20} />
            </div>
            <div className="bg-zinc-50 p-5 rounded-[1.5rem] rounded-tl-none border border-zinc-100">
              <Loader2 className="animate-spin text-emerald-500" size={20} />
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 bg-zinc-50/50 border-t border-zinc-100">
        <div className="relative flex items-center gap-4 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your health concern here..."
              className="w-full py-4 pl-6 pr-14 bg-white border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 opacity-50">
              <Sparkles size={20} />
            </div>
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="p-4 bg-emerald-500 text-zinc-900 rounded-2xl hover:bg-emerald-400 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-center text-[10px] text-zinc-400 mt-4 font-medium uppercase tracking-widest">
          AI-powered guidance. In case of emergency, call 911 immediately.
        </p>
      </div>
    </motion.div>
  );
}

function clsx(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
