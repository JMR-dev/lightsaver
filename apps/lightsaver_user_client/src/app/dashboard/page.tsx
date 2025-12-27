"use client";

import { useSession } from "@/lib/hooks/useSession";
import Link from "next/link";

export default function DashboardPage() {
  const { session, identity, isLoading, isAuthenticated } = useSession();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated || !identity) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="mb-4">You need to be logged in to view this page.</p>
          <Link
            href="/auth/login"
            className="text-blue-600 hover:underline"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const traits = identity.traits as {
    email?: string;
    name?: { first?: string; last?: string };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-4">
            <Link
              href="/auth/settings"
              className="text-gray-600 hover:text-gray-900"
            >
              Settings
            </Link>
            <Link
              href="/auth/logout"
              className="py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Logout
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Welcome, {traits.name?.first || "User"}!
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="text-gray-900">{traits.email}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
              <p className="text-gray-900">
                {traits.name?.first} {traits.name?.last}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">User ID</h3>
              <p className="text-gray-900 font-mono text-sm">{identity.id}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Session Expires
              </h3>
              <p className="text-gray-900">
                {session?.expires_at
                  ? new Date(session.expires_at).toLocaleString()
                  : "N/A"}
              </p>
            </div>

            {!identity.verifiable_addresses?.[0]?.verified && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-yellow-700 text-sm">
                  Your email is not verified.{" "}
                  <Link
                    href="/auth/verification"
                    className="font-medium underline"
                  >
                    Verify now
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
