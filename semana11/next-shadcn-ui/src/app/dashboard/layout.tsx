import { AppProvider } from "@/components/AppState";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <AppProvider>{children}</AppProvider>;
}