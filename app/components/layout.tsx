"use client";
import React, { useContext, useEffect, useState, useMemo } from "react";
import { FloatingDock } from "@/app/components/ui/floating-dock";
import { ThemeToggle } from "@/app/components/theme-toggle";
import {
  IconHome,
  IconPill,
  IconLogin,
  IconUser,
  IconLogout,
  IconMicroscope,
} from "@tabler/icons-react";
import { SessionContext } from "@/lib/supabase/usercontext";
import { CopilotManager } from "@/app/components/copilot";
import { subscribeUser, unsubscribeUser } from "@/app/actions";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { sessionData, setSessionData } = useContext(SessionContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  useEffect(() => {
    if (sessionData?.session) {
      setIsLoggedIn(true);
    }
  }, [sessionData]);

  useEffect(() => {
    if (sessionData?.session && !subscription) {
      // Automatically subscribe the logged-in user
      subscribeToPush(sessionData.session.user.id);
    }
  }, [sessionData, subscription]);

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
    const sub = await registration.pushManager.getSubscription();
    setSubscription(sub);
  }

  async function subscribeToPush(userId: string) {
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    });
    setSubscription(sub);
    const serializedSub = JSON.parse(JSON.stringify(sub));
    await subscribeUser(serializedSub, userId);
  }
  async function unsubscribeFromPush() {
    await subscription?.unsubscribe();
    setSubscription(null);
    await unsubscribeUser();
  }

  const dockItems = useMemo(
    () => [
      {
        title: "Dashboard",
        icon: (
          <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
        ),
        href: "/Dashboard",
      },
      {
        title: "Medicine",
        icon: (
          <IconPill className="h-full w-full text-neutral-500 dark:text-neutral-300" />
        ),
        href: "/Medicine",
      },
      {
        title: "Lab Tests",
        icon: (
          <IconMicroscope className="h-full w-full text-neutral-500 dark:text-neutral-300" />
        ),
        href: "/Labs",
      },
      !isLoggedIn
        ? {
            title: "Sign In",
            icon: (
              <IconLogin className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: "/SignIn",
          }
        : {
            title: "Sign Out",
            icon: (
              <IconLogout className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: "/SignOut",
          },
      {
        title: "Profile",
        icon: (
          <IconUser className="h-full w-full text-neutral-500 dark:text-neutral-300" />
        ),
        href: "/Profile",
      },
    ],
    [isLoggedIn]
  );

  return (
    <div className="w-screen h-screen bg-white dark:bg-black text-black dark:text-neutral-300 overflow-hidden relative">
      <div className="fixed top-4 right-4">
        <ThemeToggle />
      </div>
      <main className="container mx-auto px-4 py-8 h-full overflow-hidden">
        <CopilotManager
          sessionData={sessionData}
          setSessionData={setSessionData}
        />
        {children}
      </main>
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
        <FloatingDock items={dockItems} />
      </div>
    </div>
  );
}
