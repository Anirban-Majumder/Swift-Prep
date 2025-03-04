"use client"
import React from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from 'next/navigation';

export default function SignOut() {
  const supabase = createClient();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-lg dark:bg-zinc-800">
            <div className="text-center">
              <h1 className="text-xl font-semibold text-zinc-900 dark:text-white">
                Sign out of your account
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Are you sure you want to sign out?
              </p>
            </div>
            <div className="space-y-4">
              <button 
                onClick={handleSignOut} 
                className="w-full px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:ring focus:ring-red-300"
              >
                Sign Out
              </button>
              <button 
                onClick={handleGoBack} 
                className="w-full px-4 py-2 text-gray-800 bg-gray-200 rounded-lg hover:bg-gray-300 focus:ring focus:ring-gray-300"
              >
                Go Back
              </button>
            </div>
        </div>
      </div>
  );
}