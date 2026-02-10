"use client";

import React from "react"

import { useTrip } from "@/lib/trip-context";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  MapPin,
  Clock,
  Bookmark,
  Heart,
  BarChart3,
  History,
  Settings,
  Shield,
  Lightbulb,
  LogOut,
  Trophy,
  X,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  divider?: boolean;
}

function MenuItem({ icon, label, onClick, divider }: MenuItemProps) {
  return (
    <>
      <button
        onClick={onClick}
        className="w-full flex items-center gap-4 px-4 py-3.5 hover:bg-muted/50 transition-colors text-left"
      >
        <span className="text-muted-foreground">{icon}</span>
        <span className="flex-1 text-sm font-medium text-foreground">{label}</span>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </button>
      {divider && <div className="h-px bg-border mx-4" />}
    </>
  );
}

export function ProfileMenu() {
  const { userStats, setActiveTab, setSubPage } = useTrip();

  const navigateTo = (page: Parameters<typeof setSubPage>[0]) => {
    setSubPage(page);
    setActiveTab("menu");
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header with user info */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-[#FF6B9D] flex items-center justify-center">
            <span className="text-white text-xl font-bold">AC</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Alex Chen</h2>
            <p className="text-sm text-muted-foreground">alex@example.com</p>
          </div>
        </div>

        {/* Karma points card */}
        <div className="bg-gradient-to-r from-[#FBBF24]/20 to-[#F59E0B]/20 border border-[#FBBF24]/30 rounded-2xl px-4 py-3 flex items-center justify-center gap-3">
          <Trophy className="w-5 h-5 text-[#FBBF24]" />
          <span className="text-2xl font-bold text-foreground">{userStats.karmaPoints.toLocaleString()}</span>
          <span className="text-sm font-medium text-[#B45309]">Points</span>
        </div>
      </div>

      {/* Menu items */}
      <div className="flex-1 overflow-y-auto">
        <MenuItem
          icon={<CreditCard className="w-5 h-5" />}
          label="My Bookings"
          onClick={() => navigateTo("bookings")}
        />
        <MenuItem
          icon={<MapPin className="w-5 h-5" />}
          label="My Journey"
          onClick={() => {
            setSubPage(null);
            setActiveTab("journey");
          }}
        />
        <MenuItem
          icon={<Clock className="w-5 h-5" />}
          label="Travel Timeline"
          onClick={() => navigateTo("timeline")}
        />
        <MenuItem
          icon={<Bookmark className="w-5 h-5" />}
          label="Saved Hostels"
          onClick={() => navigateTo("savedHostels")}
        />
        <MenuItem
          icon={<Heart className="w-5 h-5" />}
          label="Saved Places"
          onClick={() => navigateTo("savedPlaces")}
          divider
        />
        <MenuItem
          icon={<BarChart3 className="w-5 h-5" />}
          label="My Stats"
          onClick={() => navigateTo("stats")}
        />
        <MenuItem
          icon={<History className="w-5 h-5" />}
          label="Trip History"
          onClick={() => navigateTo("tripHistory")}
          divider
        />
        <MenuItem
          icon={<Settings className="w-5 h-5" />}
          label="My Preferences"
          onClick={() => navigateTo("preferences")}
        />
        <MenuItem
          icon={<Shield className="w-5 h-5" />}
          label="Safety Toolkit"
          onClick={() => navigateTo("safety")}
        />
        <MenuItem
          icon={<Lightbulb className="w-5 h-5" />}
          label="Intel Hub"
          onClick={() => navigateTo("intelHub")}
          divider
        />
        <button
          onClick={() => {}}
          className="w-full flex items-center gap-4 px-4 py-3.5 hover:bg-muted/50 transition-colors text-left"
        >
          <LogOut className="w-5 h-5 text-destructive" />
          <span className="flex-1 text-sm font-medium text-destructive">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
