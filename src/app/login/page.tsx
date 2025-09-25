"use client";

import { AuthFormWrapper } from "@/components/auth/auth-form-wrapper";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <AuthFormWrapper
      title="Bem-vindo(a) de volta!"
      description="Faça login para acessar seu painel."
      showSocialLogins
    >
      <LoginForm />
    </AuthFormWrapper>
  );
}
