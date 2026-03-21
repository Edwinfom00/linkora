"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  Send,
  MessageSquare,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/empty-state";
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="max-w-7xl mx-auto h-[calc(100vh-4rem)]">
        <div className="flex h-full">
          {/* Conversations List */}
          <div
            className={cn(
              "w-full md:w-1/3 border-r border-border flex flex-col",
              showChat ? "hidden md:flex" : "flex"
            )}
          >
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-bold font-[family-name:var(--font-display)] text-foreground">
                Messages
              </h2>
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
                        "w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left",
                        isActive && "bg-indigo/5 border-r-2 border-indigo"
                      )}
                    >
                      <Avatar className="w-12 h-12 flex-shrink-0">
                        <AvatarFallback className="bg-gradient-to-br from-indigo/20 to-cyan/20 text-indigo text-sm font-semibold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium text-sm text-foreground truncate">
                            {displayName || "Inconnu"}
                          </p>
                          {conv.lastMessage && (
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                              {new Date(conv.lastMessage.createdAt).toLocaleTimeString("fr-FR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs text-muted-foreground truncate">
                            {conv.lastMessage?.content || "Nouvelle conversation"}
                          </p>
                          {conv.unreadCount > 0 && (
                            <span className="w-5 h-5 rounded-full bg-indigo text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <EmptyState
                  icon="folder"
                  title="Aucune conversation"
                  description="Vos conversations avec les entreprises apparaîtront ici."
                />
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div
            className={cn(
              "flex-1 flex flex-col",
              !showChat ? "hidden md:flex" : "flex"
            )}
          >
            {activeConv && activeConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-border flex items-center gap-3">
                  <button
                    onClick={() => setShowChat(false)}
                    className="md:hidden p-1 rounded-lg hover:bg-muted transition-colors"
                    aria-label="Retour"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gradient-to-br from-indigo/20 to-cyan/20 text-indigo text-xs font-semibold">
                      {(activeConversation.clientId === session?.user?.id
                        ? activeConversation.entrepriseNom
                        : activeConversation.clientName
                      )
                        ?.split(" ")
                        .map((w) => w[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2) || "??"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm text-foreground">
                      {activeConversation.clientId === session?.user?.id
                        ? activeConversation.entrepriseNom
                        : activeConversation.clientName}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {chatMessages.map((msg) => {
                    const isMine = msg.senderId === session?.user?.id;
                    return (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex",
                          isMine ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[75%] px-4 py-2.5",
                            isMine
                              ? "bg-indigo text-white chat-bubble-sent"
                              : "bg-muted text-foreground chat-bubble-received"
                          )}
                        >
                          <p className="text-sm leading-relaxed">
                            {msg.content}
                          </p>
                          <p
                            className={cn(
                              "text-[10px] mt-1",
                              isMine ? "text-white/60" : "text-muted-foreground"
                            )}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString(
                              "fr-FR",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && !e.shiftKey && handleSend()
                      }
                      placeholder="Écrire un message..."
                      className="h-12 rounded-2xl border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-indigo/20 focus:border-indigo transition-all"
                      aria-label="Écrire un message"
                      id="message-input"
                    />
                    <Button
                      onClick={handleSend}
                      disabled={isSending || !newMessage.trim()}
                      className="w-12 h-12 rounded-2xl bg-indigo hover:bg-indigo/90 text-white p-0 shadow-lg shadow-indigo/25"
                      aria-label="Envoyer"
                    >
                      {isSending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            ) : entrepriseId && !activeConv ? (
              /* New conversation starter */
              <div className="flex-1 flex flex-col">
                <div className="p-4 border-b border-border">
                  <button
                    onClick={() => setShowChat(false)}
                    className="md:hidden p-1 rounded-lg hover:bg-muted transition-colors"
                    aria-label="Retour"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <p className="font-semibold text-sm text-foreground">
                    Nouvelle conversation
                  </p>
                </div>
                <div className="flex-1 flex items-center justify-center p-6">
                  <div className="text-center max-w-sm">
                    <MessageSquare className="w-12 h-12 text-indigo/30 mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">
                      Envoyez votre premier message pour démarrer la conversation.
                    </p>
                  </div>
                </div>
                <div className="p-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && !e.shiftKey && handleSend()
                      }
                      placeholder="Écrire un message..."
                      className="h-12 rounded-2xl border-slate-200 dark:border-white/10"
                      aria-label="Écrire un message"
                      id="new-message-input"
                    />
                    <Button
                      onClick={handleSend}
                      disabled={isSending || !newMessage.trim()}
                      className="w-12 h-12 rounded-2xl bg-indigo hover:bg-indigo/90 text-white p-0"
                      aria-label="Envoyer"
                    >
                      {isSending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <EmptyState
                  icon="folder"
                  title="Sélectionnez une conversation"
                  description="Choisissez une conversation dans la liste pour voir les messages."
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
