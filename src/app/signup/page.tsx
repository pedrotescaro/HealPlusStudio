
"use client";

import { AuthFormWrapper } from "@/components/auth/auth-form-wrapper";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <AuthFormWrapper
      title="Crie sua conta"
      description="Comece a usar o Heal+ para transformar sua prática."
      showSocialLogins
    >
      <SignupForm />
    </AuthFormWrapper>
  );
}
