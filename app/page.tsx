import { TripProvider } from "@/lib/trip-context";
import { AppShell } from "@/components/app-shell";

export default function Home() {
  return (
    <TripProvider>
      <AppShell />
    </TripProvider>
  );
}
