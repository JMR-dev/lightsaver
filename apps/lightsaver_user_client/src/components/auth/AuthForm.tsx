"use client";

import { UiNode, UiNodeInputAttributes, UiText } from "@ory/client";
import { useState } from "react";

interface FlowUI {
  nodes: UiNode[];
  action: string;
  method: string;
  messages?: UiText[];
}

interface AuthFormProps {
  flow: { ui: FlowUI };
  onSubmit: (values: Record<string, unknown>) => Promise<void>;
  submitLabel: string;
}

function getInputType(attrs: UiNodeInputAttributes): string {
  if (attrs.type === "hidden") return "hidden";
  if (attrs.type === "submit") return "submit";
  if (attrs.type === "email") return "email";
  if (attrs.type === "password") return "password";
  return attrs.type || "text";
}

export function AuthForm({ flow, onSubmit, submitLabel }: AuthFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const values: Record<string, unknown> = {};

    formData.forEach((value, key) => {
      values[key] = value;
    });

    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderNode = (node: UiNode, index: number) => {
    if (node.type !== "input") return null;

    const attrs = node.attributes as UiNodeInputAttributes;
    const inputType = getInputType(attrs);

    if (inputType === "hidden") {
      return (
        <input
          key={index}
          type="hidden"
          name={attrs.name}
          value={(attrs.value as string) ?? ""}
        />
      );
    }

    if (inputType === "submit") {
      return (
        <button
          key={index}
          type="submit"
          name={attrs.name}
          value={(attrs.value as string) ?? ""}
          disabled={isSubmitting || attrs.disabled}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Loading..." : submitLabel}
        </button>
      );
    }

    const hasError = node.messages?.some((m) => m.type === "error");

    return (
      <div key={index} className="space-y-1">
        <label htmlFor={attrs.name} className="block text-sm font-medium">
          {node.meta.label?.text || attrs.name}
        </label>
        <input
          id={attrs.name}
          type={inputType}
          name={attrs.name}
          defaultValue={(attrs.value as string) ?? ""}
          required={attrs.required}
          disabled={attrs.disabled || isSubmitting}
          autoComplete={attrs.autocomplete}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 disabled:opacity-50 ${
            hasError
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          }`}
        />
        {node.messages?.map((message, msgIndex) => (
          <p
            key={msgIndex}
            className={`text-sm ${
              message.type === "error" ? "text-red-600" : "text-gray-600"
            }`}
          >
            {message.text}
          </p>
        ))}
      </div>
    );
  };

  const inputNodes = flow.ui.nodes.filter(
    (node) =>
      node.type === "input" &&
      (node.group === "default" || node.group === "password")
  );

  const submitNodes = flow.ui.nodes.filter(
    (node) =>
      node.type === "input" &&
      (node.attributes as UiNodeInputAttributes).type === "submit"
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {flow.ui.messages?.map((message, index) => (
        <div
          key={index}
          className={`p-3 rounded-md text-sm ${
            message.type === "error"
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-blue-50 text-blue-700 border border-blue-200"
          }`}
        >
          {message.text}
        </div>
      ))}

      {inputNodes.map(renderNode)}
      {submitNodes.map(renderNode)}
    </form>
  );
}
