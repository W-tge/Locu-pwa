"use client";

import { useTrip } from "@/lib/trip-context";
import { JourneyView } from "./journey-view";
import { ChatGuide } from "./chat-guide";
import { SocialPods } from "./social-pods";
import { WalletDocs } from "./wallet-docs";
import { BottomNav } from "./bottom-nav";
import { StopDetailSheet } from "./stop-detail-sheet";
import { TransitDetailSheet } from "./transit-detail-sheet";

export function AppShell() {
  const { activeTab, selectedStop, selectedLeg } = useTrip();

  return (
    <div className="h-[100dvh] w-full flex flex-col overflow-hidden bg-background">
      {/* Main Content */}
      <main className="flex-1 overflow-hidden pb-16">
        {activeTab === "journey" && <JourneyView />}
        {activeTab === "guide" && <ChatGuide />}
        {activeTab === "social" && <SocialPods />}
        {activeTab === "wallet" && <WalletDocs />}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Detail Sheets */}
      {selectedStop && <StopDetailSheet />}
      {selectedLeg && !selectedStop && <TransitDetailSheet />}
    </div>
  );
}
