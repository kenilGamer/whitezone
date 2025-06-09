"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { FaGoogle } from "react-icons/fa";

const GoogleSignInButton = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", {
        callbackUrl,
        redirect: true,
      });
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="w-full flex items-center justify-center gap-2 bg-white text-slate-700 rounded-md px-4 py-2 text-base font-medium hover:bg-slate-50 transition-colors duration-200 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
    >
      <FaGoogle className="w-5 h-5" />
      <span>Continue with Google</span>
    </button>
  );
};

export default GoogleSignInButton;
