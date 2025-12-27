"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { SettingsFlow, UpdateSettingsFlowBody } from "@ory/client";
import { kratosClient } from "@/lib/kratos/client";
import { AuthForm } from "@/components/auth/AuthForm";
import Link from "next/link";

export default function SettingsPage() {
  const [flow, setFlow] = useState<SettingsFlow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const searchParams = useSearchParams();

  const flowId = searchParams.get("flow");

  const initializeFlow = useCallback(async () => {
    try {
      if (flowId) {
        const { data } = await kratosClient.getSettingsFlow({ id: flowId });
        setFlow(data);
      } else {
        const { data } = await kratosClient.createBrowserSettingsFlow();
        window.history.replaceState(null, "", `?flow=${data.id}`);
        setFlow(data);
      }
    } catch (error: unknown) {
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 410) {
        window.location.href = "/auth/settings";
        return;
      }
      if (err.response?.status === 401) {
        window.location.href = "/auth/login?return_to=/auth/settings";
        return;
      }
      console.error("Failed to initialize settings flow:", error);
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
      const { data } = await kratosClient.updateSettingsFlow({
        flow: flow.id,
        updateSettingsFlowBody: values as UpdateSettingsFlowBody,
      });

      setFlow(data);
      setSuccess(true);

      setTimeout(() => setSuccess(false), 3000);
    } catch (error: unknown) {
      const err = error as {
        response?: { status?: number; data?: SettingsFlow };
      };
      if (err.response?.status === 400 && err.response.data) {
        setFlow(err.response.data);
      } else if (err.response?.status === 410) {
        window.location.href = "/auth/settings";
      } else if (err.response?.status === 401) {
        window.location.href = "/auth/login?return_to=/auth/settings";
      } else {
        console.error("Settings error:", error);
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
        Error loading settings flow
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Account Settings</h1>

        {success && (
          <div className="p-3 bg-green-50 text-green-700 border border-green-200 rounded-md text-sm">
            Settings updated successfully!
          </div>
        )}

        <AuthForm
          flow={flow}
          onSubmit={handleSubmit}
          submitLabel="Update Settings"
        />

        <p className="text-center text-sm text-gray-600">
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            Back to Dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}
