"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Star, Send, Loader2 } from "lucide-react";
import { StarRating } from "@/components/shared/star-rating";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { createAvis } from "@/modules/avis/server/actions";
import { useSession } from "@/lib/auth-client";

interface AvisSectionProps {
  entrepriseId: string;
  entrepriseSlug: string;
  avis: {
    id: string;
    note: number;
    commentaire: string | null;
    createdAt: Date;
    clientName: string | null;
    clientImage: string | null;
  }[];
  stats: {
    noteMoyenne: number;
    totalAvis: number;
    distribution: Record<1 | 2 | 3 | 4 | 5, number>;
  };
}

function formatRelativeDate(date: Date) {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return "Hier";
  if (days < 7) return `Il y a ${days} jours`;
  if (days < 30) return `Il y a ${Math.floor(days / 7)} semaine${Math.floor(days / 7) > 1 ? "s" : ""}`;
  if (days < 365) return `Il y a ${Math.floor(days / 30)} mois`;
  return `Il y a ${Math.floor(days / 365)} an${Math.floor(days / 365) > 1 ? "s" : ""}`;
}

export function AvisSection({
  entrepriseId,
  entrepriseSlug,
  avis,
  stats,
}: AvisSectionProps) {
  const { data: session } = useSession();
  const [note, setNote] = useState(0);
  const [commentaire, setCommentaire] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (note === 0) {
      toast.error("Veuillez sélectionner une note");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createAvis({
        entrepriseId,
        note,
        commentaire: commentaire || undefined,
      });

      if ("error" in result && result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Avis envoyé avec succès !");
      setNote(0);
      setCommentaire("");
    } catch {
      toast.error("Erreur lors de l'envoi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const maxDistribution = Math.max(...Object.values(stats.distribution), 1);

  return (
    <div>
      <h2 className="text-lg font-semibold font-[family-name:var(--font-display)] text-foreground mb-6">
        Avis clients
      </h2>

      {/* Stats overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        {/* Average score */}
        <div className="flex items-center gap-4 p-5 rounded-xl bg-card border border-border">
          <div className="text-center">
            <p className="text-4xl font-bold font-mono text-foreground">
              {stats.noteMoyenne > 0 ? stats.noteMoyenne.toFixed(1) : "—"}
            </p>
            <StarRating rating={stats.noteMoyenne} size="sm" className="mt-1" />
            <p className="text-xs text-muted-foreground mt-1">
              {stats.totalAvis} avis
            </p>
          </div>
        </div>

        {/* Distribution bars */}
        <div className="p-5 rounded-xl bg-card border border-border space-y-2">
          {[5, 4, 3, 2, 1].map((n) => (
            <div key={n} className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground w-4 text-right">
                {n}
              </span>
              <Star className="w-3 h-3 fill-amber text-amber" />
              <div className="flex-1 h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber rounded-full transition-all duration-500"
                  style={{
                    width: `${(stats.distribution[n as 1 | 2 | 3 | 4 | 5] / maxDistribution) * 100}%`,
                  }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-6">
                {stats.distribution[n as 1 | 2 | 3 | 4 | 5]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Add review form */}
      {session?.user && (
        <div className="p-5 rounded-xl bg-card border border-border mb-8">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Laisser un avis
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-2">
                Votre note
              </p>
              <StarRating
                rating={note}
                interactive
                onRate={setNote}
                size="lg"
              />
            </div>
            <Textarea
              placeholder="Votre commentaire (optionnel)..."
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              className="rounded-xl border-slate-200 dark:border-white/10 resize-none min-h-[80px]"
              aria-label="Commentaire"
            />
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || note === 0}
              className="rounded-xl bg-indigo hover:bg-indigo/90 text-white gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Envoyer
            </Button>
          </div>
        </div>
      )}

      {/* Reviews list */}
      <div className="space-y-4">
        {avis.length > 0 ? (
          avis.map((a) => {
            const initials = a.clientName
              ? a.clientName
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)
              : "??";

            return (
              <div
                key={a.id}
                className="p-5 rounded-xl bg-card border border-border"
              >
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10 flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-indigo/20 to-cyan/20 text-indigo text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-sm text-foreground">
                        {a.clientName || "Anonyme"}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeDate(a.createdAt)}
                      </span>
                    </div>
                    <StarRating
                      rating={a.note}
                      size="sm"
                      className="mt-1"
                    />
                    {a.commentaire && (
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                        {a.commentaire}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <Star className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              Aucun avis pour le moment. Soyez le premier !
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
