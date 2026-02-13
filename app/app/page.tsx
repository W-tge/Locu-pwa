import { TripProvider } from "@/lib/trip-context";
import { AppShell } from "@/components/app-shell";
import { LocuToastProvider } from "@/components/locu-toast";
import { AuthProvider } from "@/lib/auth-provider";

export default function AppPage() {
  return (
    <AuthProvider>
      <TripProvider>
        <LocuToastProvider>
          <AppShell />
        </LocuToastProvider>
      </TripProvider>
    </AuthProvider>
  );
}
