"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { VerificationFlow, UpdateVerificationFlowBody } from "@ory/client";
import { kratosClient } from "@/lib/kratos/client";
import { AuthForm } from "@/components/auth/AuthForm";
import Link from "next/link";

export default function VerificationPage() {
  const [flow, setFlow] = useState<VerificationFlow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const searchParams = useSearchParams();

  const flowId = searchParams.get("flow");

  const initializeFlow = useCallback(async () => {
    try {
      if (flowId) {
        const { data } = await kratosClient.getVerificationFlow({ id: flowId });
        setFlow(data);

        if (data.state === "passed_challenge") {
          setSuccess(true);
        }
      } else {
        const { data } = await kratosClient.createBrowserVerificationFlow();
        window.history.replaceState(null, "", `?flow=${data.id}`);
        setFlow(data);
      }
    } catch (error: unknown) {
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 410) {
        window.location.href = "/auth/verification";
        return;
      }
      console.error("Failed to initialize verification flow:", error);
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
      const { data } = await kratosClient.updateVerificationFlow({
        flow: flow.id,
        updateVerificationFlowBody: values as UpdateVerificationFlowBody,
      });

      setFlow(data);

      if (data.state === "passed_challenge") {
        setSuccess(true);
      }
    } catch (error: unknown) {
      const err = error as {
        response?: { status?: number; data?: VerificationFlow };
      };
      if (err.response?.status === 400 && err.response.data) {
        setFlow(err.response.data);
      } else if (err.response?.status === 410) {
        window.location.href = "/auth/verification";
      } else {
        console.error("Verification error:", error);
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
        Error loading verification flow
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold text-green-600">Email Verified!</h1>
          <p className="text-gray-600">
            Your email address has been successfully verified.
          </p>
          <Link
            href="/dashboard"
            className="inline-block py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Verify Your Email</h1>
        <p className="text-center text-gray-600">
          Enter the verification code sent to your email address.
        </p>
        <AuthForm flow={flow} onSubmit={handleSubmit} submitLabel="Verify" />
        <p className="text-center text-sm text-gray-600">
          <Link
            href="/dashboard"
            className="text-blue-600 hover:underline"
          >
            Skip for now
          </Link>
        </p>
      </div>
    </div>
  );
}
