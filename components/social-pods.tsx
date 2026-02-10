"use client";

import { useState } from "react";
import { useTrip } from "@/lib/trip-context";
import { useLocuToast } from "@/components/locu-toast";
import { cn } from "@/lib/utils";
import { 
  Users, 
  MapPin, 
  Calendar, 
  AlertTriangle, 
  Check, 
  Plus,
  MessageCircle,
  Share2,
  UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PodMember {
  id: string;
  name: string;
  avatar: string;
  status: "synced" | "diverging" | "offline";
  currentLocation?: string;
  divergeDate?: string;
  divergeLocation?: string;
}

const mockPodMembers: PodMember[] = [
  {
    id: "1",
    name: "You",
    avatar: "Y",
    status: "synced",
    currentLocation: "Mexico City"
  },
  {
    id: "2",
    name: "Chloe",
    avatar: "C",
    status: "diverging",
    currentLocation: "Mexico City",
    divergeDate: "Mar 14",
    divergeLocation: "San Cristobal"
  },
  {
    id: "3",
    name: "Marcus",
    avatar: "M",
    status: "synced",
    currentLocation: "Mexico City"
  },
];

const sharedStops = [
  { city: "Mexico City", dates: "Mar 1-5", members: ["You", "Chloe", "Marcus"] },
  { city: "Oaxaca", dates: "Mar 6-10", members: ["You", "Chloe", "Marcus"] },
  { city: "San Cristobal", dates: "Mar 11-14", members: ["You", "Marcus"] },
  { city: "Antigua", dates: "Mar 19-24", members: ["You", "Chloe", "Marcus"] },
];

export function SocialPods() {
  const { trip, setSubPage } = useTrip();
  const { showToast } = useLocuToast();
  const [activeTab, setActiveTab] = useState<"pod" | "nearby">("pod");

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="shrink-0 px-4 py-3 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-foreground text-lg">My Pod</h2>
            <p className="text-xs text-muted-foreground">Travel together, stay connected</p>
          </div>
          <Button size="sm" variant="outline" className="gap-1 bg-transparent" onClick={() => showToast("Invite link copied to clipboard!", "success")}>
            <UserPlus className="w-4 h-4" />
            Invite
          </Button>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setActiveTab("pod")}
            className={cn(
              "flex-1 py-2 text-sm font-medium rounded-lg transition-colors",
              activeTab === "pod" 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-muted-foreground"
            )}
          >
            My Pod
          </button>
          <button
            onClick={() => setActiveTab("nearby")}
            className={cn(
              "flex-1 py-2 text-sm font-medium rounded-lg transition-colors",
              activeTab === "nearby" 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-muted-foreground"
            )}
          >
            Nearby Travelers
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-4 pb-24">
        {activeTab === "pod" ? (
          <>
            {/* Pod Members */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Pod Members</h3>
              <div className="space-y-2">
                {mockPodMembers.map((member) => (
                  <div 
                    key={member.id}
                    className={cn(
                      "rounded-xl border p-3 transition-colors",
                      member.status === "diverging" 
                        ? "border-[#FF9F43]/30 bg-[#FF9F43]/5" 
                        : "border-border bg-card"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold",
                        member.status === "synced" ? "bg-[#4ECDC4]" :
                        member.status === "diverging" ? "bg-[#FF9F43]" : "bg-muted-foreground"
                      )}>
                        {member.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground">{member.name}</p>
                          {member.status === "synced" && (
                            <Badge variant="outline" className="text-[10px] bg-[#4ECDC4]/10 border-[#4ECDC4] text-[#4ECDC4]">
                              <Check className="w-3 h-3 mr-0.5" />
                              Synced
                            </Badge>
                          )}
                          {member.status === "diverging" && (
                            <Badge variant="outline" className="text-[10px] bg-[#FF9F43]/10 border-[#FF9F43] text-[#FF9F43]">
                              <AlertTriangle className="w-3 h-3 mr-0.5" />
                              Diverging
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {member.currentLocation}
                        </p>
                      </div>
                      <Button size="icon" variant="ghost" className="shrink-0" onClick={() => showToast(`Opening chat with ${member.name}`, "info")}>
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {member.status === "diverging" && member.divergeDate && (
                      <div className="mt-2 pt-2 border-t border-[#FF9F43]/20">
                        <p className="text-xs text-[#FF9F43]">
                          Diverges on {member.divergeDate} at {member.divergeLocation}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline" className="text-xs flex-1 border-[#FF9F43] text-[#FF9F43] bg-transparent" onClick={() => showToast("Sync request sent to Chloe", "success")}>
                            Sync Itinerary
                          </Button>
                          <Button size="sm" variant="ghost" className="text-xs" onClick={() => showToast("Opening Chloe's itinerary...", "info")}>
                            View Plan
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Shared Stops */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Shared Journey</h3>
              <div className="space-y-2">
                {sharedStops.map((stop, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card">
                    <div className="w-8 h-8 rounded-full bg-[#4ECDC4]/20 flex items-center justify-center text-[#4ECDC4] text-sm font-bold">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">{stop.city}</p>
                      <p className="text-xs text-muted-foreground">{stop.dates}</p>
                    </div>
                    <div className="flex -space-x-2">
                      {stop.members.map((m, j) => (
                        <div 
                          key={j}
                          className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center border-2 border-card"
                        >
                          {m[0]}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Group Booking CTA */}
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Book 5 days ahead to secure 3 beds for your Pod</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Group dorms fill up fast in Guatemala during March!
                  </p>
                  <Button size="sm" className="mt-3 bg-primary hover:bg-primary/90 text-white" onClick={() => setSubPage("hostelDetails")}>
                    Book Group Dorm
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Discover Nearby Travelers</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Connect with other backpackers on similar routes to share tips, split transport costs, or grab a drink.
              </p>
              <Button className="mt-4 gradient-primary text-white">
                Enable Location Sharing
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
