"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="">URL Shortener</span>
        </Link>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
              pathname === "/dashboard" ? "bg-muted text-primary" : ""
            }`}
          >
            Links
          </Link>
          <Link
            href="/analytics"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
              pathname === "/analytics" ? "bg-muted text-primary" : ""
            }`}
          >
            Analytics
          </Link>
          {/* <Link
            href="/settings"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
              pathname === "/settings" ? "bg-muted text-primary" : ""
            }`}
          >
            Settings
          </Link> */}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <Button
          onClick={() => signOut({ callbackUrl: DEFAULT_LOGIN_REDIRECT })}
          variant="ghost"
          className="w-full justify-start"
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
