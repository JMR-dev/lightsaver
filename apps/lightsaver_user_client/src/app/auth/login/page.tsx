"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoginFlow, UpdateLoginFlowBody } from "@ory/client";
import { kratosClient } from "@/lib/kratos/client";
import { AuthForm } from "@/components/auth/AuthForm";
import Link from "next/link";

export default function LoginPage() {
  const [flow, setFlow] = useState<LoginFlow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  const flowId = searchParams.get("flow");
  const returnTo = searchParams.get("return_to");

  const initializeFlow = useCallback(async () => {
    try {
      if (flowId) {
        const { data } = await kratosClient.getLoginFlow({ id: flowId });
        setFlow(data);
      } else {
        const { data } = await kratosClient.createBrowserLoginFlow({
          returnTo: returnTo || undefined,
        });
        window.history.replaceState(null, "", `?flow=${data.id}`);
        setFlow(data);
      }
    } catch (error: unknown) {
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 410) {
        window.location.href = "/auth/login";
        return;
      }
      console.error("Failed to initialize login flow:", error);
    } finally {
      setIsLoading(false);
    }
  }, [flowId, returnTo]);

  useEffect(() => {
    initializeFlow();
  }, [initializeFlow]);

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!flow) return;

    try {
      await kratosClient.updateLoginFlow({
        flow: flow.id,
        updateLoginFlowBody: values as UpdateLoginFlowBody,
      });

      router.push(returnTo || "/dashboard");
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: LoginFlow } };
      if (err.response?.status === 400 && err.response.data) {
        setFlow(err.response.data);
      } else if (err.response?.status === 410) {
        window.location.href = "/auth/login";
      } else {
        console.error("Login error:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!flow) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Error loading login flow
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Sign In</h1>
        <AuthForm flow={flow} onSubmit={handleSubmit} submitLabel="Sign In" />
        <div className="text-center text-sm text-gray-600 space-y-2">
          <p>
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/registration"
              className="text-blue-600 hover:underline"
            >
              Sign up
            </Link>
          </p>
          <p>
            <Link
              href="/auth/recovery"
              className="text-blue-600 hover:underline"
            >
              Forgot your password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
