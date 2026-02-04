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
      case "social":
        return <SocialPods />;
      case "hostelDetails":
        return <HostelDetails />;
      case "transportBooking":
        return <TransportBooking />;
      default:
        return null;
    }
  };

  const subPageContent = renderSubPage();

  return (
    <div className="h-[100dvh] w-full flex flex-col overflow-hidden bg-background">
      {/* Header - Always visible */}
      <AppHeader />

      {/* Main Content - Always leaves space for bottom nav on mobile */}
      <main className="flex-1 overflow-hidden pb-16 lg:pb-0 relative">
        {/* Journey view always renders but may be covered by subpage */}
        {activeTab === "journey" && <JourneyView />}
        {activeTab === "guide" && !subPage && <ChatGuide />}
        {activeTab === "social" && !subPage && <SocialPods />}
        {activeTab === "wallet" && !subPage && <WalletDocs />}
        {activeTab === "menu" && !subPage && <ProfileMenu />}
        
        {/* Sub-pages render as overlay on top of main content - with proper bottom padding for nav */}
        {subPageContent && (
          <div className="absolute inset-0 z-30 bg-background overflow-y-auto">
            <div className="min-h-full pb-20 lg:pb-0">
              {subPageContent}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation - ALWAYS visible on mobile, higher z-index */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-50">
        <BottomNav />
      </div>

      {/* Detail Sheets - only show when no subpage is active */}
      {!subPage && selectedStop && <StopDetailSheet />}
      {!subPage && selectedLeg && !selectedStop && <TransitDetailSheet />}
    </div>
  );
}
