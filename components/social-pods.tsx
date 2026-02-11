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
  LogOut,
  ArrowLeft,
  Eye,
  Navigation,
  X,
  Sparkles,
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
  suggestedAlign?: string;
  route?: string[];
}

const members: PodMember[] = [
  {
    id: "1",
    name: "You",
    avatar: "YO",
    status: "synced",
    currentLocation: "Mexico City",
    nextStop: "Oaxaca",
    route: ["Mexico City", "Oaxaca", "San Cristobal", "Flores", "Caye Caulker"],
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
    suggestedAlign: "Meet at San Cristobal on Mar 16 - both heading south",
    route: ["Mexico City", "San Cristobal", "Palenque", "Flores"],
  },
  {
    id: "3",
    name: "Marcus",
    avatar: "MJ",
    status: "synced",
    currentLocation: "Mexico City",
    nextStop: "Oaxaca",
    route: ["Mexico City", "Oaxaca", "Puerto Escondido"],
  },
  {
    id: "4",
    name: "Priya",
    avatar: "PS",
    status: "offline",
    currentLocation: "Oaxaca",
    route: ["Oaxaca", "San Cristobal", "Antigua"],
  },
];

export function SocialPods() {
  const { trip, setSubPage } = useTrip();
  const { showToast } = useLocuToast();
  const [activeTab, setActiveTab] = useState<"pod" | "nearby">("pod");
  const [viewingPlan, setViewingPlan] = useState<PodMember | null>(null);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friendCode, setFriendCode] = useState("");
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  // Plan comparison view
  if (viewingPlan) {
    const yourRoute = members[0].route || [];
    const theirRoute = viewingPlan.route || [];
    const sharedStops = yourRoute.filter(s => theirRoute.includes(s));

    return (
      <div className="flex flex-col h-full bg-background">
        <div className="shrink-0 p-4 border-b border-border flex items-center gap-3">
          <Button size="icon" variant="ghost" onClick={() => setViewingPlan(null)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h2 className="font-serif text-lg text-foreground">{viewingPlan.name}{"'"}s Plan</h2>
            <p className="text-xs text-muted-foreground">Compare routes and find alignment</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Shared stops highlight */}
          {sharedStops.length > 0 && (
            <div className="rounded-xl border border-[#0D9488]/30 bg-[#0D9488]/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-[#0D9488]" />
                <span className="font-semibold text-[#0D9488] text-sm">{sharedStops.length} Shared Stops</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {sharedStops.map(s => (
                  <Badge key={s} variant="outline" className="bg-[#0D9488]/10 border-[#0D9488]/30 text-[#0D9488] text-xs">{s}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Alignment suggestion */}
          {viewingPlan.suggestedAlign && (
            <div className="rounded-xl border border-[#FBBF24]/30 bg-[#FBBF24]/5 p-4">
              <div className="flex items-center gap-2 mb-1">
                <Navigation className="w-4 h-4 text-[#92710C]" />
                <span className="font-semibold text-[#92710C] text-sm">Suggested Alignment</span>
              </div>
              <p className="text-xs text-muted-foreground">{viewingPlan.suggestedAlign}</p>
              <Button size="sm" className="mt-2 bg-[#0D9488] hover:bg-[#0D9488]/90 text-white text-xs" onClick={() => showToast("Alignment request sent!", "success")}>
                Suggest This Meetup
              </Button>
            </div>
          )}

          {/* Side-by-side routes */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="micro-label mb-2">Your Route</p>
              <div className="space-y-2">
                {yourRoute.map((stop, i) => (
                  <div key={stop} className="flex items-center gap-2">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0",
                      sharedStops.includes(stop) ? "bg-[#0D9488]" : "bg-muted-foreground/30"
                    )}>{i + 1}</div>
                    <span className={cn("text-xs", sharedStops.includes(stop) ? "font-semibold text-foreground" : "text-muted-foreground")}>{stop}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="micro-label mb-2">{viewingPlan.name}{"'"}s Route</p>
              <div className="space-y-2">
                {theirRoute.map((stop, i) => (
                  <div key={stop} className="flex items-center gap-2">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0",
                      sharedStops.includes(stop) ? "bg-[#0D9488]" : "bg-muted-foreground/30"
                    )}>{i + 1}</div>
                    <span className={cn("text-xs", sharedStops.includes(stop) ? "font-semibold text-foreground" : "text-muted-foreground")}>{stop}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="shrink-0 p-4 border-t border-border">
          <Button className="w-full bg-[#0D9488] hover:bg-[#0D9488]/90 text-white font-semibold" onClick={() => { showToast(`Sync request sent to ${viewingPlan.name}`, "success"); setViewingPlan(null); }}>
            Request Itinerary Sync
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="shrink-0 p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Button size="icon" variant="ghost" onClick={() => setSubPage(null)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h2 className="font-serif text-lg text-foreground">Travel Pod</h2>
              <p className="text-xs text-muted-foreground">
                {members.filter((m) => m.status === "synced").length} synced &middot; {members.length} members
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="outline" className="gap-1 bg-transparent" onClick={() => setShowAddFriend(true)}>
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Add</span>
            </Button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex bg-muted rounded-lg p-1">
          <button
            onClick={() => setActiveTab("pod")}
            className={cn(
              "flex-1 py-1.5 text-xs font-medium rounded-md transition-colors",
              activeTab === "pod" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            )}
          >
            My Pod
          </button>
          <button
            onClick={() => setActiveTab("nearby")}
            className={cn(
              "flex-1 py-1.5 text-xs font-medium rounded-md transition-colors",
              activeTab === "nearby" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
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
              <div key={member.id} className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="p-3">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0",
                      member.status === "synced" ? "bg-[#0D9488]/10 text-[#0D9488]" :
                      member.status === "diverging" ? "bg-[#F59E0B]/10 text-[#F59E0B]" :
                      "bg-muted text-muted-foreground"
                    )}>
                      {member.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground text-sm">{member.name}</p>
                        {member.status === "synced" && (
                          <Badge variant="outline" className="text-[10px] py-0 h-4 bg-[#0D9488]/10 border-[#0D9488]/30 text-[#0D9488]">
                            <Check className="w-3 h-3 mr-0.5" /> Synced
                          </Badge>
                        )}
                        {member.status === "diverging" && (
                          <Badge variant="outline" className="text-[10px] py-0 h-4 bg-[#F59E0B]/10 border-[#F59E0B]/30 text-[#F59E0B]">
                            <AlertTriangle className="w-3 h-3 mr-0.5" /> Diverging
                          </Badge>
                        )}
                        {member.status === "offline" && (
                          <Badge variant="outline" className="text-[10px] py-0 h-4">Offline</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {member.currentLocation}
                        {member.nextStop && <span className="text-muted-foreground/50"> &rarr; {member.nextStop}</span>}
                      </p>
                    </div>
                    {member.id !== "1" && (
                      <Button size="icon" variant="ghost" className="shrink-0" onClick={() => showToast(`Opening chat with ${member.name}`, "info")}>
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Diverging member: show alignment suggestion + action buttons */}
                {member.status === "diverging" && member.divergeDate && (
                  <div className="px-3 pb-3 pt-0">
                    <div className="border-t border-border pt-3 space-y-2">
                      <p className="text-xs text-[#F59E0B]">
                        Diverges {member.divergeDate} &rarr; {member.divergeLocation}
                      </p>
                      {member.suggestedAlign && (
                        <div className="rounded-lg bg-[#0D9488]/5 border border-[#0D9488]/20 p-2">
                          <div className="flex items-center gap-1 mb-0.5">
                            <Sparkles className="w-3 h-3 text-[#0D9488]" />
                            <span className="text-[10px] font-semibold text-[#0D9488]">Alignment Suggestion</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground">{member.suggestedAlign}</p>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="text-xs flex-1 bg-[#0D9488] hover:bg-[#0D9488]/90 text-white"
                          onClick={() => showToast("Sync request sent to " + member.name, "success")}
                        >
                          Sync Itinerary
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs flex-1 bg-transparent"
                          onClick={() => setViewingPlan(member)}
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          View Plan
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Synced/offline members: View Plan link */}
                {member.status !== "diverging" && member.id !== "1" && (
                  <div className="px-3 pb-3 pt-0">
                    <button
                      onClick={() => setViewingPlan(member)}
                      className="text-xs text-[#0D9488] font-medium flex items-center gap-1 hover:underline"
                    >
                      <Eye className="w-3 h-3" /> View Plan
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* Group Booking */}
            <div className="p-4 rounded-xl bg-[#0D9488]/5 border border-[#0D9488]/20">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0D9488]/10 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-[#0D9488]" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Group Dorm Available</p>
                  <p className="text-xs text-muted-foreground mt-1">3 beds available at Los Amigos Hostel in Flores</p>
                  <Button size="sm" className="mt-3 bg-[#0D9488] hover:bg-[#0D9488]/90 text-white" onClick={() => setSubPage("hostelDetails")}>
                    Book Group Dorm
                  </Button>
                </div>
              </div>
            </div>

            {/* Leave Pod */}
            <button
              onClick={() => setShowLeaveConfirm(true)}
              className="w-full flex items-center justify-center gap-2 py-3 text-xs text-destructive font-medium hover:bg-destructive/5 rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Leave Pod
            </button>
          </>
        ) : (
          /* Nearby Travellers */
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-[#0D9488]/10 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-[#0D9488]" />
            </div>
            <p className="font-semibold text-foreground mb-2">Find Nearby Travellers</p>
            <p className="text-xs text-muted-foreground mb-4 max-w-[240px] mx-auto">
              Enable location sharing to discover other backpackers near you
            </p>
            <Button className="mt-4 bg-[#0D9488] hover:bg-[#0D9488]/90 text-white" onClick={() => showToast("Location sharing enabled! Nearby travellers will be visible soon.", "success")}>
              Enable Location Sharing
            </Button>
          </div>
        )}
      </div>

      {/* Add Friend Modal */}
      {showAddFriend && (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowAddFriend(false)} />
          <div className="relative bg-card rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-sm p-5 animate-in slide-in-from-bottom duration-300 sm:mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg text-foreground">Add Friend</h3>
              <button onClick={() => setShowAddFriend(false)} className="p-1 hover:bg-muted rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mb-3">Enter your friend{"'"}s travel code or share your invite link.</p>
            <input
              type="text"
              value={friendCode}
              onChange={(e) => setFriendCode(e.target.value)}
              placeholder="Enter travel code..."
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488]/30 transition-colors"
            />
            <div className="flex gap-2 mt-4">
              <Button className="flex-1 bg-[#0D9488] hover:bg-[#0D9488]/90 text-white" onClick={() => {
                showToast(friendCode ? "Friend request sent!" : "Please enter a travel code", friendCode ? "success" : "info");
                if (friendCode) { setFriendCode(""); setShowAddFriend(false); }
              }}>
                Add Friend
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => {
                showToast("Invite link copied to clipboard!", "success");
              }}>
                Share Link
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Leave Pod Confirmation */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowLeaveConfirm(false)} />
          <div className="relative bg-card rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-sm p-5 animate-in slide-in-from-bottom duration-300 sm:mx-4">
            <h3 className="font-semibold text-foreground mb-2">Leave this Pod?</h3>
            <p className="text-xs text-muted-foreground mb-4">
              You will no longer see updates from pod members or be able to sync itineraries. You can rejoin later with an invite.
            </p>
            <div className="flex gap-2">
              <Button variant="destructive" className="flex-1" onClick={() => {
                showToast("You left the pod.", "info");
                setShowLeaveConfirm(false);
                setSubPage(null);
              }}>
                Leave Pod
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowLeaveConfirm(false)}>
                Stay
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
