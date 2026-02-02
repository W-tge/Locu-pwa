"use client";

import React from "react";

import { useTrip, type MenuPage } from "@/lib/trip-context";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  CreditCard,
  Map,
  Clock,
  Building,
  Heart,
  BarChart3,
  History,
  Settings,
  Shield,
  Lightbulb,
  LogOut,
  Trophy,
  User,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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

export function TripMenuPage() {
  const { menuPage, setMenuPage, user } = useTrip();

  if (menuPage === "none") return null;

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => setMenuPage("none")}
            className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-primary font-bold text-lg tracking-tight border border-primary px-1.5 py-0.5 rounded">
              LOCU
            </span>
          </div>
        </div>
      </header>

      {/* User Profile Section */}
      <div className="px-4 py-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-[#FF6B9D]/20 flex items-center justify-center border-2 border-primary/30">
            <User className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-foreground">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        {/* Karma Points Badge */}
        <div className="bg-gradient-to-r from-[#FF9F43]/10 to-[#00D4AA]/10 border border-[#00D4AA]/30 rounded-2xl px-4 py-3 flex items-center justify-center gap-3">
          <Trophy className="w-5 h-5 text-[#FF9F43]" />
          <span className="text-2xl font-bold bg-gradient-to-r from-[#FF9F43] to-[#00D4AA] bg-clip-text text-transparent">
            {user.karmaPoints.toLocaleString()}
          </span>
          <span className="text-sm font-medium text-[#00D4AA]">Points</span>
        </div>
      </div>

      {/* Menu Items */}
      <div className="bg-card border-y border-border">
        <MenuItem
          icon={<CreditCard className="w-5 h-5" />}
          label="My Bookings"
          onClick={() => setMenuPage("my-bookings")}
        />
        <MenuItem
          icon={<Map className="w-5 h-5" />}
          label="My Journey"
          onClick={() => setMenuPage("none")}
        />
        <MenuItem
          icon={<Clock className="w-5 h-5" />}
          label="Travel Timeline"
          onClick={() => setMenuPage("travel-timeline")}
        />
        <MenuItem
          icon={<Building className="w-5 h-5" />}
          label="Saved Hostels"
          onClick={() => setMenuPage("saved-hostels")}
        />
        <MenuItem
          icon={<Heart className="w-5 h-5" />}
          label="Saved Places"
          onClick={() => setMenuPage("saved-places")}
          divider
        />
        <MenuItem
          icon={<BarChart3 className="w-5 h-5" />}
          label="My Stats"
          onClick={() => setMenuPage("my-stats")}
        />
        <MenuItem
          icon={<History className="w-5 h-5" />}
          label="Trip History"
          onClick={() => setMenuPage("trip-history")}
          divider
        />
        <MenuItem
          icon={<Settings className="w-5 h-5" />}
          label="My Preferences"
          onClick={() => setMenuPage("my-preferences")}
        />
        <MenuItem
          icon={<Shield className="w-5 h-5" />}
          label="Safety Toolkit"
          onClick={() => setMenuPage("safety-toolkit")}
        />
        <MenuItem
          icon={<Lightbulb className="w-5 h-5" />}
          label="Intel Hub"
          onClick={() => setMenuPage("intel-hub")}
          divider
        />
      </div>

      {/* Sign Out */}
      <div className="px-4 py-4">
        <button className="w-full flex items-center gap-4 px-4 py-3.5 text-left text-muted-foreground hover:text-foreground transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
