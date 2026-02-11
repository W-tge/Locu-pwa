"use client";

import React from "react";
import Image from "next/image";
import { useTrip } from "@/lib/trip-context";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  DollarSign,
  Bus,
  Mountain,
  Home,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* Ink stamp colours */
const stampInkColors: Record<string, { text: string; border: string }> = {
  pink:   { text: "text-[#8B1A2B]", border: "border-[#8B1A2B]" },   /* Deep Red */
  purple: { text: "text-[#0D3B52]", border: "border-[#0D3B52]" },   /* Navy Blue */
  mint:   { text: "text-[#1B5E3B]", border: "border-[#1B5E3B]" },   /* Forest Green */
  coral:  { text: "text-[#8B1A2B]", border: "border-[#8B1A2B]" },   /* Deep Red */
};

/* Deterministic rotation per achievement for that "imperfect stamp" look */
const stampRotations = [-2, 1.5, -1, 2.5, -1.5, 0.8];

const achievementIcons: Record<string, React.ReactNode> = {
  mountain: <Mountain className="w-6 h-6" />,
  bus:      <Bus className="w-6 h-6" />,
  home:     <Home className="w-6 h-6" />,
};

export function MyStats() {
  const { userStats, setSubPage } = useTrip();

  return (
    <div className="h-full flex flex-col bg-background paper-texture">
      {/* Header */}
      <header className="glass-panel border-b border-black/5 px-4 py-4 flex items-center gap-4">
        <button
          onClick={() => setSubPage(null)}
          className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Image src="/locu-logo.png" alt="Locu" width={60} height={24} className="h-6 w-auto" />
          <h1 className="text-xl font-serif">My Stats</h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Stats grid -- paper cards with monospace data */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: MapPin, value: userStats.countriesVisited, label: "COUNTRIES" },
            { icon: Calendar, value: userStats.daysTraveled, label: "DAYS ON ROAD" },
            { icon: DollarSign, value: `$${userStats.totalSpent.toLocaleString()}`, label: "TOTAL SPENT" },
            { icon: Bus, value: userStats.journeysTaken, label: "JOURNEYS" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card rounded-xl p-4 paper-shadow flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-2">
                <stat.icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="text-2xl font-mono font-bold text-foreground">{stat.value}</span>
              <span className="micro-label mt-1">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Passport Stamps (Achievements) */}
        <div className="bg-card rounded-xl paper-shadow p-5">
          <h2 className="micro-label text-sm mb-5">PASSPORT STAMPS</h2>

          <div className="grid grid-cols-2 gap-4">
            {userStats.achievements.map((achievement, i) => {
              const ink = stampInkColors[achievement.color] || stampInkColors.pink;
              const rotation = stampRotations[i % stampRotations.length];

              return (
                <div
                  key={achievement.id}
                  className={cn(
                    "stamp rounded-lg p-4 flex flex-col items-center text-center",
                    ink.text, ink.border,
                  )}
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    mixBlendMode: "multiply",
                  }}
                >
                  <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center mb-2 opacity-80">
                    {achievementIcons[achievement.icon] || <Award className="w-6 h-6" />}
                  </div>
                  <h3 className="font-bold text-sm leading-tight">{achievement.title}</h3>
                  <p className="text-[10px] opacity-70 mt-1 leading-tight">{achievement.description}</p>
                  <span className="micro-label mt-2 text-current opacity-60">+{achievement.points} PTS</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Level progress */}
        <div className="bg-card rounded-xl paper-shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-serif text-lg text-foreground">Explorer Level 8</h3>
            <span className="font-mono text-sm text-muted-foreground">{userStats.karmaPoints} / 3,500</span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${(userStats.karmaPoints / 3500) * 100}%` }}
            />
          </div>
          <p className="micro-label mt-2">
            {3500 - userStats.karmaPoints} points until Level 9
          </p>
        </div>
      </div>
    </div>
  );
}
