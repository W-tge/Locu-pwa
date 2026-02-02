"use client";

import { useTrip } from "@/lib/trip-context";
import { JourneyView } from "./journey-view";
import { ChatGuide } from "./chat-guide";
import { SocialPods } from "./social-pods";
import { WalletDocs } from "./wallet-docs";
import { ProfileMenu } from "./profile-menu";
import { BottomNav } from "./bottom-nav";
import { StopDetailSheet } from "./stop-detail-sheet";
import { TransitDetailSheet } from "./transit-detail-sheet";

// Sub-pages
import { MyStats } from "./pages/my-stats";
import { MyPreferences } from "./pages/my-preferences";
import { MyBookings } from "./pages/my-bookings";
import { SavedPlaces } from "./pages/saved-places";
import { SavedHostels } from "./pages/saved-hostels";
import { IntelHub } from "./pages/intel-hub";
import { SafetyToolkit } from "./pages/safety-toolkit";
import { TravelTimeline } from "./pages/travel-timeline";
import { TripHistory } from "./pages/trip-history";

export function AppShell() {
  const { activeTab, subPage, selectedStop, selectedLeg } = useTrip();

  // Render sub-pages if active
  const renderSubPage = () => {
    switch (subPage) {
      case "stats":
        return <MyStats />;
      case "preferences":
        return <MyPreferences />;
      case "bookings":
        return <MyBookings />;
      case "savedPlaces":
        return <SavedPlaces />;
      case "savedHostels":
        return <SavedHostels />;
      case "intelHub":
        return <IntelHub />;
      case "safety":
        return <SafetyToolkit />;
      case "timeline":
        return <TravelTimeline />;
      case "tripHistory":
        return <TripHistory />;
      default:
        return null;
    }
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col overflow-hidden bg-background">
      {/* Main Content */}
      <main className="flex-1 overflow-hidden pb-16">
        {subPage ? (
          renderSubPage()
        ) : (
          <>
            {activeTab === "journey" && <JourneyView />}
            {activeTab === "guide" && <ChatGuide />}
            {activeTab === "social" && <SocialPods />}
            {activeTab === "wallet" && <WalletDocs />}
            {activeTab === "menu" && <ProfileMenu />}
          </>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Detail Sheets - only show when not in sub-page */}
      {!subPage && selectedStop && <StopDetailSheet />}
      {!subPage && selectedLeg && !selectedStop && <TransitDetailSheet />}
    </div>
  );
}
