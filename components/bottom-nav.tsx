"use client";

import { useTrip } from "@/lib/trip-context";
import { cn } from "@/lib/utils";
import { Map, MessageCircle, Users, Wallet } from "lucide-react";

const navItems = [
  { id: "journey" as const, label: "Journey", icon: Map },
  { id: "guide" as const, label: "Guide", icon: MessageCircle },
  { id: "social" as const, label: "Pod", icon: Users },
  { id: "wallet" as const, label: "Wallet", icon: Wallet },
];

export function BottomNav() {
  const { activeTab, setActiveTab } = useTrip();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur-lg border-t border-border safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex flex-col items-center justify-center w-16 h-full gap-0.5 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <div className={cn(
                "relative flex items-center justify-center",
                isActive && "after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-primary"
              )}>
                <Icon className={cn(
                  "w-5 h-5 transition-transform",
                  isActive && "scale-110"
                )} />
              </div>
              <span className={cn(
                "text-[10px] font-medium",
                isActive && "font-semibold"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
