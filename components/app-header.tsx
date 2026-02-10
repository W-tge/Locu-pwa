"use client";

import { useState } from "react";
import Image from "next/image";
import { useTrip } from "@/lib/trip-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Send,
  Sparkles,
  ChevronDown,
  User,
  Settings,
  Trophy,
  BookMarked,
  Heart,
  Clock,
  Shield,
  Lightbulb,
  LogOut,
} from "lucide-react";

export function AppHeader() {
  const { user, setSubPage, setActiveTab } = useTrip();
  const [command, setCommand] = useState("");

  const handleCommand = () => {
    if (command.trim()) {
      // Simulate NLP command processing
      alert(`Processing: "${command}"`);
      setCommand("");
    }
  };

  const menuItems = [
    { icon: BookMarked, label: "My Bookings", action: () => setSubPage("bookings") },
    { icon: Clock, label: "Travel Timeline", action: () => setSubPage("timeline") },
    { icon: Heart, label: "Saved Hostels", action: () => setSubPage("savedHostels") },
    { icon: Heart, label: "Saved Places", action: () => setSubPage("savedPlaces") },
    { divider: true },
    { icon: Trophy, label: "My Stats", action: () => setSubPage("stats") },
    { icon: Clock, label: "Trip History", action: () => setSubPage("tripHistory") },
    { icon: Settings, label: "My Preferences", action: () => setSubPage("preferences") },
    { icon: Shield, label: "Safety Toolkit", action: () => setSubPage("safety") },
    { icon: Lightbulb, label: "Intel Hub", action: () => setSubPage("intelHub") },
    { divider: true },
    { icon: LogOut, label: "Sign Out", action: () => {} },
  ];

  return (
    <header className="shrink-0 h-16 border-b border-border bg-card px-4 flex items-center gap-4">
      {/* Logo */}
      <button 
        onClick={() => { setSubPage(null); setActiveTab("journey"); }}
        className="shrink-0 h-8 w-auto"
      >
        <Image
          src="/locu-logo.png"
          alt="Locu"
          width={80}
          height={32}
          className="h-8 w-auto object-contain"
          priority
        />
      </button>

      {/* NLP Command Bar */}
      <div className="flex-1 max-w-2xl">
        <div className="flex items-center gap-2 bg-muted rounded-full px-4 py-2">
          <Sparkles className="w-4 h-4 text-primary shrink-0" />
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCommand()}
            placeholder="Describe changes to your itinerary..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <Button
            size="sm"
            onClick={handleCommand}
            className="rounded-full h-8 w-8 p-0 bg-primary hover:bg-primary/90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* User Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 shrink-0 hover:bg-muted rounded-lg px-2 py-1.5 transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground hidden sm:block">
              {user.name.split(" ")[0]}
            </span>
            <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {/* User Info */}
          <div className="px-3 py-2">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          
          {/* Karma Points */}
          <div className="px-3 py-2 mx-2 mb-2 rounded-lg bg-gradient-to-r from-warning/10 to-primary/10 border border-warning/20">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-warning" />
              <span className="text-lg font-bold text-warning">{user.karmaPoints.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground">Points</span>
            </div>
          </div>

          <DropdownMenuSeparator />

          {menuItems.map((item, i) => 
            item.divider ? (
              <DropdownMenuSeparator key={i} />
            ) : (
              <DropdownMenuItem key={i} onClick={item.action} className="cursor-pointer">
                {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                {item.label}
              </DropdownMenuItem>
            )
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
