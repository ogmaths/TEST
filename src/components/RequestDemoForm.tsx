"use client";

import { useState } from "react";
import { sendDemoRequest } from "../actions/sendDemoRequest";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check, ArrowRight } from "lucide-react";

export function RequestDemoForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    org: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      await sendDemoRequest(form);
      setStatus("success");
      setForm({ name: "", email: "", org: "", message: "" });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setStatus("idle");
      }, 5000);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    }
  };

  if (status === "success") {
    return (
      <Alert className="border-green-200 bg-green-50 max-w-lg">
        <Check className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Thank you! We'll be in touch within 24 hours to schedule your demo.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="demo-name"
            className="text-sm font-medium text-gray-700"
          >
            Name *
          </Label>
          <Input
            id="demo-name"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border-gray-200"
            required
            disabled={status === "loading"}
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="demo-email"
            className="text-sm font-medium text-gray-700"
          >
            Email *
          </Label>
          <Input
            id="demo-email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border-gray-200"
            required
            disabled={status === "loading"}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label
          htmlFor="demo-organization"
          className="text-sm font-medium text-gray-700"
        >
          Organization
        </Label>
        <Input
          id="demo-organization"
          type="text"
          value={form.org}
          onChange={(e) => setForm({ ...form, org: e.target.value })}
          className="border-gray-200"
          disabled={status === "loading"}
        />
      </div>
      <div className="space-y-2">
        <Label
          htmlFor="demo-message"
          className="text-sm font-medium text-gray-700"
        >
          Tell us about your needs
        </Label>
        <Textarea
          id="demo-message"
          placeholder="How many staff members? What type of support services do you provide?"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="border-gray-200"
          disabled={status === "loading"}
        />
      </div>
      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Sending..." : "Request Demo"}
        {status !== "loading" && <ArrowRight className="ml-2 h-4 w-4" />}
      </Button>
      {status === "error" && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}
    </form>
  );
}
