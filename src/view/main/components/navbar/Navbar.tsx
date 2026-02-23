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
import { cn } from "@/utils";
import styles from "./navbar.module.scss";
import { Button } from "@/components/ui/button/button";
import { LogOutIcon } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/questions", label: "Questions" },
  { href: "/practice", label: "Practice" },
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
    <header className={styles["navbar"]}>
      <div className={styles["navbar-logo"]}>
        <Link href="/">
          <Image
            src="/images/logo.svg"
            alt="Prepify"
            width={180}
            height={50}
            priority
          />
        </Link>
      </div>

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

      <div className={styles["navbar-right"]}>
          <Button 
          variant="primary"
          onClick={() => {
            signOut();
          }}
          >
            Logout
            <LogOutIcon size={20} />
          </Button>
      </div>
    </header>
  );
}
