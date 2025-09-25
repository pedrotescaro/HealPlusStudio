"use client";

import { AuthFormWrapper } from "@/components/auth/auth-form-wrapper";
import { LoginForm } from "@/components/auth/login-form";
import { useTranslation } from "@/contexts/app-provider";

export default function LoginPage() {
  const { t } = useTranslation();
  return (
    <AuthFormWrapper
      title={t.welcomeBack}
      description={t.loginPrompt}
      showSocialLogins
    >
      <LoginForm />
    </AuthFormWrapper>
  );
}
