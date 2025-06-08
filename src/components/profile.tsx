'use client';

import { useSession } from "next-auth/react";
import { useLoading } from "@/context/loading-context";
import { useEffect } from "react";

const Profile = () => {
  const { data: session, status } = useSession();
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    if (status === "loading") {
      startLoading("Loading profile...");
    } else {
      stopLoading();
    }
  }, [status, startLoading, stopLoading]);

  if (status === "loading") {
    return null; // The loader will be shown by the LoadingProvider
  }

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Please sign in to view your profile</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Profile</h1>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-[#FB9EC6] rounded-full flex items-center justify-center">
              <span className="text-2xl text-white font-bold">
                {session.user.username?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{session.user.username}</h2>
              <p className="text-gray-600">{session.user.email}</p>
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">User ID</p>
                <p className="font-medium">{session.user._id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-medium capitalize">{session.user.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;