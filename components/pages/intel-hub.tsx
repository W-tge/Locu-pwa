"use client";

import { useState } from "react";
import { useTrip } from "@/lib/trip-context";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useLocuToast } from "@/components/locu-toast";
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  ExternalLink,
  Gift,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function IntelHub() {
  const { alerts, communityQuests, addKarmaPoints, setSubPage } = useTrip();
  const { showToast } = useLocuToast();
  const [answeredQuests, setAnsweredQuests] = useState<string[]>([]);
  const [karmaToast, setKarmaToast] = useState<{ points: number } | null>(null);

  const handleAnswerQuest = (questId: string, points: number) => {
    addKarmaPoints(points);
    setAnsweredQuests(prev => [...prev, questId]);
    setKarmaToast({ points });
    setTimeout(() => setKarmaToast(null), 2000);
  };

  const urgentAlerts = alerts.filter(a => a.type === "urgent");
  const tripAssists = alerts.filter(a => a.type === "assist" || a.type === "info");

  return (
    <div className="h-full flex flex-col bg-muted/30 relative">
      {/* Karma toast */}
      {karmaToast && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-[#00D4AA] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg shadow-[#00D4AA]/40 animate-in fade-in slide-in-from-top-2">
          +{karmaToast.points} Karma Points
        </div>
      )}

      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4 flex items-center gap-4">
        <button
          onClick={() => setSubPage(null)}
          className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Image src="/locu-logo.png" alt="Locu" width={60} height={24} className="h-6 w-auto" />
          <Lightbulb className="w-5 h-5 text-[#FBBF24]" />
          <h1 className="text-xl font-bold">Intel Hub</h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Urgent Alerts */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-[#FF6B9D]" />
            <h2 className="font-bold text-foreground">Urgent Alerts</h2>
          </div>
          <div className="space-y-3">
            {urgentAlerts.map((alert) => (
              <div key={alert.id} className="bg-card rounded-xl border-l-4 border-l-[#FF6B9D] border border-border p-4">
                <h3 className="font-bold text-foreground">{alert.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                {alert.action && (
                  <Button size="sm" className="mt-3 bg-primary hover:bg-primary/90 text-white text-xs h-8 gap-1" onClick={() => showToast(`Opening ${alert.action}...`, "info")}>
                    {alert.action}
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Trip Assists */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-[#00D4AA]" />
            <h2 className="font-bold text-foreground">Trip Assists</h2>
          </div>
          <div className="space-y-3">
            {tripAssists.map((alert) => (
              <div 
                key={alert.id} 
                className={cn(
                  "bg-card rounded-xl border-l-4 border border-border p-4",
                  alert.type === "assist" ? "border-l-[#00D4AA]" : "border-l-[#10B981]"
                )}
              >
                <h3 className="font-bold text-foreground">{alert.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Community Quests */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Gift className="w-4 h-4 text-[#FBBF24]" />
            <h2 className="font-bold text-foreground">Community Quests</h2>
          </div>
          <div className="space-y-3">
            {communityQuests.map((quest) => {
              const isAnswered = answeredQuests.includes(quest.id);
              return (
                <div key={quest.id} className="bg-card rounded-xl border border-border p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-primary">{quest.question}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{quest.description}</p>
                    </div>
                    <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ml-3">
                      +{quest.points} pts
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => !isAnswered && handleAnswerQuest(quest.id, quest.points)}
                    disabled={isAnswered}
                    className={cn(
                      "mt-3 text-xs h-8",
                      isAnswered 
                        ? "bg-[#00D4AA] hover:bg-[#00D4AA] text-white" 
                        : "bg-primary hover:bg-primary/90 text-white"
                    )}
                  >
                    {isAnswered ? "Answered!" : "Answer & Earn"}
                  </Button>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
