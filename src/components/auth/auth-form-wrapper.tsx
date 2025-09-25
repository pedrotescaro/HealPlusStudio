"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { SocialLogins } from "./social-logins";

interface AuthFormWrapperProps {
  children: ReactNode;
  title: string;
  description: string;
  showSocialLogins?: boolean;
}

export function AuthFormWrapper({
  children,
  title,
  description,
  showSocialLogins,
}: AuthFormWrapperProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col justify-center items-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-sm sm:max-w-md space-y-6 sm:space-y-8">
          <div className="lg:hidden text-center">
            <Logo />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              {title}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              {description}
            </p>
          </div>
          <Card className="shadow-2xl border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6 sm:p-8">
              {children}
              {showSocialLogins && <SocialLogins />}
            </CardContent>
          </Card>
          {title.includes("Bem-vindo") ? (
            <p className="text-center text-sm text-muted-foreground">
              Não tem uma conta?{" "}
              <Link
                href="/signup"
                className="font-semibold text-primary hover:underline"
              >
                Cadastre-se
              </Link>
            </p>
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary hover:underline"
              >
                Faça login
              </Link>
            </p>
          )}
        </div>
    </div>
  );
}
