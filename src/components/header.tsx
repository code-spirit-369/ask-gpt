import Link from "next/link";

import { ModeToggle } from "@/components/mode-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";

export const Header = () => {
  return (
    <header className="bg-background border-b p-4 flex items-center justify-between">
      <SidebarTrigger className="block mr-4" />
      <Link href="/chat">
        <h1 className="text-xl font-bold">Ask-GPT</h1>
      </Link>
      <ModeToggle />
    </header>
  );
};
