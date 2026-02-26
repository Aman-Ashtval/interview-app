"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/utils";
import styles from "./navbar.module.scss";
import { Button } from "@/components/ui/button/button";
import { LogOutIcon, Menu } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/questions", label: "Questions" },
  { href: "/how-it-works", label: "How it works" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth/sign-in");
    router.refresh();
  };

  return (
    <header className={cn(styles["navbar"])}>
      <div className={styles["navbar-logo"]}>
        <Link href="/" aria-label="Prepify home">
          <Image
            src="/images/logo.svg"
            alt="Prepify"
            width={180}
            height={50}
            priority
            className={styles["navbar-logo-image"]}
          />
        </Link>
      </div>

      {/* Desktop: center nav links */}
      <nav className={styles["navbar-center"]} aria-label="Main navigation">
        <NavigationMenu className="max-w-none">
          <NavigationMenuList className={cn(styles["navbar-menu"])}>
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        styles["navbar-link"],
                        active && styles["navbar-link-active"]
                      )}
                    >
                      {item.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>
      </nav>

      {/* Desktop: logout button */}
      <div className={styles["navbar-right"]}>
        <Button variant="primary" onClick={signOut} className={styles["navbar-logout-btn"]}>
          Logout
          <LogOutIcon size={20} aria-hidden />
        </Button>
      </div>

      {/* Mobile: menu button opens nav + logout */}
      <div className={styles["navbar-mobile"]}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className={styles["navbar-menu-btn"]} aria-label="Open menu">
              <Menu size={24} aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={styles["navbar-dropdown"]}>
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <DropdownMenuItem key={item.href} asChild>
                  <Link
                    href={item.href}
                    className={cn(styles["navbar-dropdown-link"], active && styles["navbar-dropdown-link-active"])}
                  >
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuItem onClick={signOut} className={styles["navbar-dropdown-logout"]}>
              Logout
              <LogOutIcon size={18} aria-hidden />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
