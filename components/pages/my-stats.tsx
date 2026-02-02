"use client";

import React from "react"

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

const achievementColors = {
  pink: "from-primary to-[#FF6B9D]",
  purple: "from-[#7C3AED] to-[#A855F7]",
  mint: "from-[#7C3AED] to-primary",
  coral: "from-[#FF6B9D] to-primary",
};

const achievementIcons: Record<string, React.ReactNode> = {
  mountain: <Mountain className="w-5 h-5" />,
  bus: <Bus className="w-5 h-5" />,
  home: <Home className="w-5 h-5" />,
};

export function MyStats() {
  const { userStats, setSubPage } = useTrip();

  return (
    <div className="h-full flex flex-col bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4 flex items-center gap-4">
        <button
          onClick={() => setSubPage(null)}
          className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-primary font-bold text-sm border border-primary rounded px-1.5">LOCU</span>
          <h1 className="text-xl font-bold">My Stats</h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-2xl p-4 border border-border flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <span className="text-3xl font-bold text-foreground">{userStats.countriesVisited}</span>
            <span className="text-sm text-muted-foreground">Countries Visited</span>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <span className="text-3xl font-bold text-foreground">{userStats.daysTraveled}</span>
            <span className="text-sm text-muted-foreground">Days Traveled</span>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
            <span className="text-3xl font-bold text-foreground">${userStats.totalSpent.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground">Total Spent</span>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <Bus className="w-6 h-6 text-primary" />
            </div>
            <span className="text-3xl font-bold text-foreground">{userStats.journeysTaken}</span>
            <span className="text-sm text-muted-foreground">Journeys Taken</span>
          </div>
        </div>

        {/* Achievements section */}
        <div className="bg-card rounded-2xl border border-border p-4">
          <h2 className="text-lg font-bold text-foreground mb-4">Recent Achievements</h2>
          <div className="space-y-3">
            {userStats.achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={cn(
                  "rounded-xl p-4 bg-gradient-to-r text-white",
                  achievementColors[achievement.color]
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
                    {achievementIcons[achievement.icon] || <Award className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white">{achievement.title}</h3>
                    <p className="text-sm text-white/80">{achievement.description}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                      <span className="text-sm text-white/80">+{achievement.points} points</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Level progress */}
        <div className="bg-card rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-foreground">Explorer Level 8</h3>
            <span className="text-sm text-muted-foreground">{userStats.karmaPoints} / 3,500 pts</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-[#FF6B9D] rounded-full transition-all"
              style={{ width: `${(userStats.karmaPoints / 3500) * 100}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {3500 - userStats.karmaPoints} points until Level 9
          </p>
        </div>
      </div>
    </div>
  );
}
