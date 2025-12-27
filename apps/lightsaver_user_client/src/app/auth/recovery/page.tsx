"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { RecoveryFlow, UpdateRecoveryFlowBody } from "@ory/client";
import { kratosClient } from "@/lib/kratos/client";
import { AuthForm } from "@/components/auth/AuthForm";
import Link from "next/link";

export default function RecoveryPage() {
  const [flow, setFlow] = useState<RecoveryFlow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const searchParams = useSearchParams();

  const flowId = searchParams.get("flow");

  const initializeFlow = useCallback(async () => {
    try {
      if (flowId) {
        const { data } = await kratosClient.getRecoveryFlow({ id: flowId });
        setFlow(data);
      } else {
        const { data } = await kratosClient.createBrowserRecoveryFlow();
        window.history.replaceState(null, "", `?flow=${data.id}`);
        setFlow(data);
      }
    } catch (error: unknown) {
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 410) {
        window.location.href = "/auth/recovery";
        return;
      }
      console.error("Failed to initialize recovery flow:", error);
    } finally {
      setIsLoading(false);
    }
  }, [flowId]);

  useEffect(() => {
    initializeFlow();
  }, [initializeFlow]);

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!flow) return;

    try {
      const { data } = await kratosClient.updateRecoveryFlow({
        flow: flow.id,
        updateRecoveryFlowBody: values as UpdateRecoveryFlowBody,
      });

      setFlow(data);

      if (data.state === "passed_challenge") {
        setSuccess(true);
      }
    } catch (error: unknown) {
      const err = error as {
        response?: { status?: number; data?: RecoveryFlow };
      };
      if (err.response?.status === 400 && err.response.data) {
        setFlow(err.response.data);
      } else if (err.response?.status === 410) {
        window.location.href = "/auth/recovery";
      } else {
        console.error("Recovery error:", error);
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
        Error loading recovery flow
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold">Recovery Successful</h1>
          <p className="text-gray-600">
            You can now set a new password in your account settings.
          </p>
          <Link
            href="/auth/settings"
            className="inline-block py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Settings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Recover Your Account</h1>
        <p className="text-center text-gray-600">
          Enter your email address and we&apos;ll send you a recovery code.
        </p>
        <AuthForm
          flow={flow}
          onSubmit={handleSubmit}
          submitLabel="Send Recovery Code"
        />
        <p className="text-center text-sm text-gray-600">
          Remember your password?{" "}
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
