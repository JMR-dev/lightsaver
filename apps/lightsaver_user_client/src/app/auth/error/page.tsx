"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FlowError } from "@ory/client";
import { kratosClient } from "@/lib/kratos/client";
import Link from "next/link";

export default function ErrorPage() {
  const [error, setError] = useState<FlowError | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();

  const errorId = searchParams.get("id");

  useEffect(() => {
    if (!errorId) {
      setIsLoading(false);
      return;
    }

    kratosClient
      .getFlowError({ id: errorId })
      .then(({ data }) => {
        setError(data);
      })
      .catch((err) => {
        console.error("Failed to fetch error:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [errorId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-red-600">
          An Error Occurred
        </h1>

        {error ? (
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">
                {typeof error.error === "object" && error.error !== null
                  ? JSON.stringify(error.error, null, 2)
                  : String(error.error)}
              </p>
            </div>

            {errorId && (
              <p className="text-xs text-gray-500 text-center">
                Error ID: {errorId}
              </p>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-600">
            An unknown error occurred. Please try again.
          </p>
        )}

        <div className="flex flex-col gap-2">
          <Link
            href="/auth/login"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center"
          >
            Go to Login
          </Link>
          <Link
            href="/"
            className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-center"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
