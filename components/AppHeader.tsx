"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/AuthDialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";

const AUTH_CHANGED_EVENT = "docsort-auth-changed";

type MeResponse =
  | { success: true; user: { id: string; email: string; name: string } }
  | { success: false; error: string };

async function fetchMe(): Promise<MeResponse> {
  const res = await fetch("/api/auth/me", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });
  const json = (await res.json()) as MeResponse;
  if (!res.ok) return json;
  return json;
}

export function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();

  const [me, setMe] = React.useState<MeResponse | null>(null);
  const [authOpen, setAuthOpen] = React.useState(false);

  const refreshMe = React.useCallback(async () => {
    try {
      setMe(await fetchMe());
    } catch {
      setMe({ success: false, error: "Unauthorized" });
    }
  }, []);

  React.useEffect(() => {
    void refreshMe();
  }, [refreshMe]);

  React.useEffect(() => {
    const handler = () => {
      void refreshMe();
    };
    window.addEventListener(AUTH_CHANGED_EVENT, handler);
    return () => window.removeEventListener(AUTH_CHANGED_EVENT, handler);
  }, [refreshMe]);

  const logout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    }).catch(() => null);
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
    await refreshMe();
    router.refresh();
    if (pathname !== "/") router.push("/");
  };

  const authed = me?.success === true;
  const email = me?.success === true ? me.user.email : null;
  const initials = React.useMemo(() => {
    if (!email) return "U";
    const left = email.split("@")[0] ?? "";
    const chars = left.replace(/[^a-z0-9]/gi, "").slice(0, 2);
    return (chars || "U").toUpperCase();
  }, [email]);

  return (
    <header className="w-full border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <Link href="/" className="font-semibold text-foreground">
          DocSort
        </Link>

        <div className="flex items-center gap-2">
          {authed ? (
            <div className="flex items-center gap-3">
              <span
                className="hidden text-sm text-muted-foreground sm:inline"
                title={email ?? undefined}
              >
                {email}
              </span>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" aria-label="Profile">
                    <Avatar className="size-7">
                      <AvatarFallback className="text-xs font-medium">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="flex items-center gap-2">
                    <User className="size-4" />
                    <span className="truncate">{email}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="size-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button variant="outline" onClick={() => setAuthOpen(true)}>
              Sign in
            </Button>
          )}
        </div>
      </div>

      <AuthDialog
        open={authOpen}
        onOpenChange={setAuthOpen}
        onAuthed={async () => {
          await refreshMe();
          router.refresh();
        }}
      />
    </header>
  );
}
