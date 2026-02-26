"use client";

import { Suspense } from "react";
import { SignIn } from "@/view/auth/sign-in/SignIn";

export default function page() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <SignIn />
      </Suspense>
    </main>
  );
}
