import { TripProvider } from "@/lib/trip-context";
import { AppShell } from "@/components/app-shell";
import { LocuToastProvider } from "@/components/locu-toast";

export default function Home() {
  return (
    <TripProvider>
      <LocuToastProvider>
        <AppShell />
      </LocuToastProvider>
    </TripProvider>
  );
}
