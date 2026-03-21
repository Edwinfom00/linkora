"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Send,
  MessageSquare,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import {
  getMyConversations,
  getMessages,
  sendMessage,
  markAsRead,
} from "@/modules/messages/server/actions";
import { cn } from "@/lib/utils";

type Conversation = Awaited<ReturnType<typeof getMyConversations>>[number];
type Message = Awaited<ReturnType<typeof getMessages>>[number];

export function MessagesView() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const entrepriseId = searchParams.get("entreprise");

  useEffect(() => {
    async function loadConversations() {
      try {
        const convos = await getMyConversations();
        setConversations(convos);

        // If opening from an entreprise page, start new conversation
        if (entrepriseId) {
          const existing = convos.find(
            (c) => c.entrepriseId === entrepriseId
          );
          if (existing) {
            setActiveConv(existing.id);
            setShowChat(true);
          }
        }
      } catch {
        toast.error("Erreur lors du chargement des conversations");
      } finally {
        setIsLoading(false);
      }
    }
    loadConversations();
  }, [entrepriseId]);

  useEffect(() => {
    async function loadMessages() {
      if (!activeConv) return;
      try {
        const msgs = await getMessages(activeConv);
        setChatMessages(msgs);
        await markAsRead(activeConv);
      } catch {
        toast.error("Erreur lors du chargement des messages");
      }
    }
    loadMessages();
  }, [activeConv]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    setIsSending(true);
    try {
      const result = await sendMessage({
        content: newMessage.trim(),
        conversationId: activeConv || undefined,
        entrepriseId: !activeConv ? entrepriseId || undefined : undefined,
      });

      if ("error" in result && result.error) {
        toast.error(result.error);
        return;
      }

      setNewMessage("");
      // Reload messages and conversation list
      if (activeConv) {
        const msgs = await getMessages(activeConv);
        setChatMessages(msgs);
      } else if (result.data) {
        // New conversation was created
        const convos = await getMyConversations();
        setConversations(convos);
        // Deduct the conversation from the newly created message
        const msg = result.data;
        setActiveConv(msg.conversationId);
        setShowChat(true);
      }
    } catch {
      toast.error("Erreur lors de l'envoi");
    } finally {
      setIsSending(false);
    }
  };

  const activeConversation = conversations.find((c) => c.id === activeConv);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="h-screen flex md:flex-row bg-white overflow-hidden">
      
      {/* Colonne gauche (Conversations) */}
      <div
        className={cn(
          "w-full md:w-80 border-r border-gray-200 bg-white flex flex-col shrink-0",
          showChat ? "hidden md:flex" : "flex"
        )}
      >
        <div className="flex h-14 items-center justify-between px-4 border-b border-gray-200 bg-gray-50 shrink-0">
          <h2 className="text-sm font-semibold text-gray-900">
            Messages
          </h2>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900"
          >
            Quitter
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length > 0 ? (
            conversations.map((conv) => {
              const isActive = conv.id === activeConv;
              const displayName =
                conv.clientId === session?.user?.id
                  ? conv.entrepriseNom
                  : conv.clientName;
              const initials = displayName
                ? displayName
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                : "??";

              return (
                <button
                  key={conv.id}
                  onClick={() => {
                    setActiveConv(conv.id);
                    setShowChat(true);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors text-left",
                    isActive ? "bg-blue-50 border-l-2 border-l-blue-600 pr-4 pl-[14px]" : "border-l-2 border-l-transparent"
                  )}
                >
                  <div className="w-9 h-9 rounded-md bg-gray-200 flex items-center justify-center font-semibold text-xs text-gray-600 flex-shrink-0">
                    {initials}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {displayName || "Inconnu"}
                      </p>
                      {conv.lastMessage && (
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          {new Date(conv.lastMessage.createdAt).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <p className={cn(
                        "text-xs truncate",
                        conv.unreadCount > 0 ? "text-gray-900 font-medium" : "text-gray-500"
                      )}>
                        {conv.lastMessage?.content || "Nouvelle conversation"}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="w-4 h-4 bg-blue-600 text-white text-[10px] rounded flex items-center justify-center flex-shrink-0 font-medium">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="p-6 text-center">
              <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">
                Vos conversations apparaîtront ici.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Colonne droite (Chat window) */}
      <div
        className={cn(
          "flex-1 flex flex-col bg-white overflow-hidden",
          !showChat ? "hidden md:flex" : "flex"
        )}
      >
        {activeConv && activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="h-14 px-4 border-b border-gray-200 flex items-center gap-3 bg-white shrink-0">
              <button
                onClick={() => setShowChat(false)}
                className="md:hidden p-1.5 -ml-1 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
                aria-label="Retour"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <div className="w-8 h-8 rounded-md bg-gray-200 flex items-center justify-center font-semibold text-xs text-gray-600 flex-shrink-0">
                {(activeConversation.clientId === session?.user?.id
                  ? activeConversation.entrepriseNom
                  : activeConversation.clientName
                )
                  ?.split(" ")
                  .map((w) => w[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2) || "??"}
              </div>
              
              <p className="text-sm font-semibold text-gray-900 truncate">
                {activeConversation.clientId === session?.user?.id
                  ? activeConversation.entrepriseNom
                  : activeConversation.clientName}
              </p>
            </div>

            {/* Messages zone */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
              {chatMessages.map((msg, index) => {
                const isMine = msg.senderId === session?.user?.id;
                
                return (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex",
                      isMine ? "justify-end" : "justify-start"
                    )}
                  >
                    <div className={cn("flex flex-col", isMine ? "items-end" : "items-start")}>
                      <div
                        className={cn(
                          "px-3 py-2 text-sm max-w-sm sm:max-w-md lg:max-w-lg shadow-sm border",
                          isMine
                            ? "bg-blue-600 text-white rounded-md rounded-tr-sm border-blue-600"
                            : "bg-white text-gray-800 rounded-md rounded-tl-sm border-gray-200"
                        )}
                        style={{ wordBreak: 'break-word' }}
                      >
                        {msg.content}
                      </div>
                      <span className={cn(
                        "text-[10px] mt-1 text-gray-400",
                      )}>
                        {new Date(msg.createdAt).toLocaleTimeString(
                          "fr-FR",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Input zone */}
            <div className="border-t border-gray-200 bg-white px-4 py-3 shrink-0">
              <div className="flex items-center gap-2">
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && !e.shiftKey && handleSend()
                  }
                  placeholder="Écrire un message..."
                  className="flex-1 px-3 py-2 h-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  aria-label="Écrire un message"
                  id="message-input"
                />
                <button
                  onClick={handleSend}
                  disabled={isSending || !newMessage.trim()}
                  className="h-10 px-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center flex-shrink-0"
                  aria-label="Envoyer"
                >
                  {isSending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </>
        ) : entrepriseId && !activeConv ? (
          /* New conversation starter */
          <>
            <div className="h-14 px-4 border-b border-gray-200 flex items-center gap-3 bg-white shrink-0">
              <button
                onClick={() => setShowChat(false)}
                className="md:hidden p-1.5 -ml-1 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
                aria-label="Retour"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <p className="text-sm font-semibold text-gray-900">
                Nouvelle conversation
              </p>
            </div>
            
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col items-center justify-center bg-gray-50">
              <MessageSquare className="w-10 h-10 text-gray-300 mb-3" />
              <p className="text-sm text-gray-500 text-center max-w-xs">
                Envoyez votre premier message pour démarrer la conversation.
              </p>
            </div>
            
            <div className="border-t border-gray-200 bg-white px-4 py-3 shrink-0">
              <div className="flex items-center gap-2">
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && !e.shiftKey && handleSend()
                  }
                  placeholder="Écrire un message..."
                  className="flex-1 px-3 py-2 h-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  aria-label="Écrire un message"
                  id="new-message-input"
                />
                <button
                  onClick={handleSend}
                  disabled={isSending || !newMessage.trim()}
                  className="h-10 px-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center flex-shrink-0"
                  aria-label="Envoyer"
                >
                  {isSending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-6">
            <MessageSquare className="w-10 h-10 text-gray-300 mb-3" />
            <h3 className="text-sm font-medium text-gray-900 mb-1">Sélectionnez une conversation</h3>
            <p className="text-sm text-gray-500 text-center max-w-xs">
              Choisissez une conversation dans la liste de gauche pour voir les messages.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
