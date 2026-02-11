"use client";

import { useState } from "react";
import { useTrip } from "@/lib/trip-context";
import { useLocuToast } from "@/components/locu-toast";
import { cn } from "@/lib/utils";
import {
  Users,
  MapPin,
  Calendar,
  ChevronRight,
  AlertTriangle,
  Check,
  MessageCircle,
  UserPlus,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PodMember {
  id: string;
  name: string;
  avatar: string;
  status: "synced" | "diverging" | "offline";
  currentLocation?: string;
  nextStop?: string;
  divergeDate?: string;
  divergeLocation?: string;
}

const members: PodMember[] = [
  {
    id: "1",
    name: "You",
    avatar: "YO",
    status: "synced",
    currentLocation: "Mexico City",
    nextStop: "Oaxaca",
  },
  {
    id: "2",
    name: "Chloe",
    avatar: "CK",
    status: "diverging",
    currentLocation: "Mexico City",
    nextStop: "San Cristobal",
    divergeDate: "Mar 14",
    divergeLocation: "San Cristobal",
  },
  {
    id: "3",
    name: "Marcus",
    avatar: "MJ",
    status: "synced",
    currentLocation: "Mexico City",
    nextStop: "Oaxaca",
  },
  {
    id: "4",
    name: "Priya",
    avatar: "PS",
    status: "offline",
    currentLocation: "Oaxaca",
  },
];

export function SocialPods() {
  const { trip, setSubPage } = useTrip();
  const { showToast } = useLocuToast();
  const [activeTab, setActiveTab] = useState<"pod" | "nearby">("pod");

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="shrink-0 p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-bold text-foreground text-lg">Travel Pod</h2>
            <p className="text-xs text-muted-foreground">
              {members.filter((m) => m.status === "synced").length} synced
              &middot; {members.length} members
            </p>
          </div>
          <Button size="sm" variant="outline" className="gap-1 bg-transparent" onClick={() => showToast("Invite link copied to clipboard!", "success")}>
            <UserPlus className="w-4 h-4" />
            Invite
          </Button>
        </div>

        {/* Tab bar */}
        <div className="flex bg-muted rounded-lg p-1">
          <button
            onClick={() => setActiveTab("pod")}
            className={cn(
              "flex-1 py-1.5 text-xs font-medium rounded-md transition-colors",
              activeTab === "pod"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground"
            )}
          >
            My Pod
          </button>
          <button
            onClick={() => setActiveTab("nearby")}
            className={cn(
              "flex-1 py-1.5 text-xs font-medium rounded-md transition-colors",
              activeTab === "nearby"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground"
            )}
          >
            Nearby
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {activeTab === "pod" ? (
          <>
            {/* Pod Members */}
            {members.map((member) => (
              <div
                key={member.id}
                className="p-3 rounded-xl border border-border bg-card"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                    {member.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground text-sm">
                        {member.name}
                      </p>
                      {member.status === "synced" && (
                        <Badge
                          variant="outline"
                          className="text-[10px] py-0 h-4 bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981]"
                        >
                          <Check className="w-3 h-3 mr-0.5" /> Synced
                        </Badge>
                      )}
                      {member.status === "diverging" && (
                        <Badge
                          variant="outline"
                          className="text-[10px] py-0 h-4 bg-[#F59E0B]/10 border-[#F59E0B]/30 text-[#F59E0B]"
                        >
                          <AlertTriangle className="w-3 h-3 mr-0.5" />{" "}
                          Diverging
                        </Badge>
                      )}
                      {member.status === "offline" && (
                        <Badge
                          variant="outline"
                          className="text-[10px] py-0 h-4"
                        >
                          Offline
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {member.currentLocation}
                    </p>
                  </div>
                  <Button size="icon" variant="ghost" className="shrink-0" onClick={() => showToast(`Opening chat with ${member.name}`, "info")}>
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>

                {member.status === "diverging" && member.divergeDate && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs text-[#F59E0B]">
                      Diverges {member.divergeDate} &rarr;{" "}
                      {member.divergeLocation}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs flex-1 border-[#FF9F43] text-[#FF9F43] bg-transparent"
                        onClick={() => showToast("Sync request sent to Chloe", "success")}
                      >
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

            {/* Group Booking */}
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    Group Dorm Available
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    3 beds available at Los Amigos Hostel in Flores
                  </p>
                  <Button size="sm" className="mt-3 bg-primary hover:bg-primary/90 text-white" onClick={() => setSubPage("hostelDetails")}>
                    Book Group Dorm
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Nearby Travellers */
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-primary" />
            </div>
            <p className="font-semibold text-foreground mb-2">
              Find Nearby Travellers
            </p>
            <p className="text-xs text-muted-foreground mb-4 max-w-[240px] mx-auto">
              Enable location sharing to discover other backpackers near you
            </p>
            <Button className="mt-4 bg-primary hover:bg-primary/90 text-white" onClick={() => showToast("Location sharing enabled! Nearby travellers will be visible soon.", "success")}>
              Enable Location Sharing
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
