"use client";

import { useTrip } from "@/lib/trip-context";
import { AppHeader } from "./app-header";
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
import { HostelDetails } from "./pages/hostel-details";
import { TransportBooking } from "./pages/transport-booking";

export function AppShell() {
  const { activeTab, subPage, selectedStop, selectedLeg } = useTrip();

  const renderSubPage = () => {
    switch (subPage) {
      case "stats": return <MyStats />;
      case "preferences": return <MyPreferences />;
      case "bookings": return <MyBookings />;
      case "savedPlaces": return <SavedPlaces />;
      case "savedHostels": return <SavedHostels />;
      case "intelHub": return <IntelHub />;
      case "safety": return <SafetyToolkit />;
      case "timeline": return <TravelTimeline />;
      case "tripHistory": return <TripHistory />;
      case "social": return <SocialPods />;
      case "hostelDetails": return <HostelDetails />;
      case "transportBooking": return <TransportBooking />;
      default: return null;
    }
  };

  const subPageContent = renderSubPage();

  return (
    <div className="h-[100dvh] w-full flex flex-col overflow-hidden bg-background">
      {/* Header - always visible */}
      <AppHeader />

      {/* Main Content Area - shrinks to fit between header and bottom nav */}
      <main className="flex-1 overflow-hidden relative">
        {/* Primary tab content */}
        {activeTab === "journey" && <JourneyView />}
        {activeTab === "guide" && !subPage && <ChatGuide />}
        {activeTab === "social" && !subPage && <SocialPods />}
        {activeTab === "wallet" && !subPage && <WalletDocs />}
        {activeTab === "menu" && !subPage && <ProfileMenu />}

        {/* Sub-pages slide in on top as overlay WITHIN main (between header and bottom nav) */}
        {subPageContent && (
          <div className="absolute inset-0 z-30 bg-background overflow-y-auto animate-in slide-in-from-right-8 duration-200">
            {subPageContent}
          </div>
        )}
      </main>

      {/* Bottom Navigation - ALWAYS visible, sits below <main> in the flex column.
          z-[60] ensures it is above all map overlays, popups, and subpages. */}
      <div className="lg:hidden shrink-0 relative z-[60]">
        <BottomNav />
      </div>

      {/* Detail Sheets - only show when no subpage is active */}
      {!subPage && selectedStop && <StopDetailSheet />}
      {!subPage && selectedLeg && !selectedStop && <TransitDetailSheet />}
    </div>
  );
}
