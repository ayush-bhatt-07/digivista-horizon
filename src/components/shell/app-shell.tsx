import { useState, type ReactNode } from "react";
import { AppSidebar } from "./app-sidebar";
import { TopHeader } from "./top-header";
import { CommandPalette, useCommandPalette } from "./command-palette";

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const { open, setOpen } = useCommandPalette();
  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background">
      <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopHeader onOpenPalette={() => setOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1400px] px-6 py-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
      </div>
      <CommandPalette open={open} onOpenChange={setOpen} />
    </div>
  );
}
