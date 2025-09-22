"use client";

import { useRouter } from "next/navigation";
import { SignupForm } from "@/modules/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();

  const handleSignupSuccess = () => {
    // Redirect to dashboard or home page after successful signup
    router.push("/board");
  };

  const handleLoginClick = () => {
    // Navigate to login page or show login form
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              Create Your Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SignupForm
              onSuccess={handleSignupSuccess}
              onLoginClick={handleLoginClick}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
