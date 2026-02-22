import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SignOutButton } from "@/components/sign-out-button";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-dvh flex flex-col bg-slate-50 dark:bg-slate-950">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex h-14 min-h-[3.5rem] max-w-4xl items-center justify-between gap-3 px-3 sm:px-4">
          <Link
            href="/dashboard"
            className="text-base font-semibold text-slate-900 dark:text-white truncate min-w-0 sm:text-lg"
          >
            AI Mock Interview
          </Link>
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <span
              className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[120px] sm:max-w-[180px]"
              title={user.email ?? undefined}
            >
              {user.email}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="flex-1 min-w-0 w-full">{children}</main>
    </div>
  );
}
