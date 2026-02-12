import { Navbar } from "@/components/layout/Navbar";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-background"><Navbar /><main>{children}</main></div>;
}
