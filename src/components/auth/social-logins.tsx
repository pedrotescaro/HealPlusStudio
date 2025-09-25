"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const GoogleIcon = () => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="currentColor"
  >
    <title>Google</title>
    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.08-2.58 2.03-4.56 2.03-3.86 0-7-3.14-7-7s3.14-7 7-7c2.1 0 3.63.86 4.67 1.88l2.85-2.85C16.3 1.94 14.1.84 12.02.84c-5.52 0-10 4.48-10 10s4.48 10 10 10c5.77 0 9.6-4.06 9.6-9.77 0-.64-.07-1.25-.16-1.84z" />
  </svg>
);

const AppleIcon = () => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="currentColor"
  >
    <title>Apple</title>
    <path d="M12.15,2.57c-0.27-0.02-0.54-0.03-0.81-0.03c-1.3,0-2.58,0.54-3.57,1.52c-1.68,1.68-2.33,4.24-1.85,6.58 c0.48,2.34,2.05,4.3,4.1,5.34c0.97,0.49,2.04,0.76,3.13,0.76c0.27,0,0.53-0.01,0.8-0.03c0.01-0.01,0.02-0.01,0.03-0.02 c-0.12,0.02-0.25,0.03-0.37,0.03c-0.78,0-1.54-0.29-2.09-0.84c-0.55-0.55-0.84-1.31-0.84-2.09c0-0.78,0.29-1.54,0.84-2.09 c0.55-0.55,1.31-0.84,2.09-0.84c0.78,0,1.54,0.29,2.09,0.84c0.55,0.55,0.84,1.31,0.84,2.09c0,0.08,0,0.16-0.01,0.24 c-0.01-0.08-0.01-0.16-0.01-0.24c0-2.3-1.85-4.15-4.15-4.15c-0.02,0-0.03,0-0.05,0c1.07-1.4,1.72-3.08,1.8-4.94 C13.9,4.2,13.25,3.22,12.15,2.57z M15.18,17.43c-0.78-0.78-1.82-1.22-2.93-1.22c-1.11,0-2.15,0.44-2.93,1.22 c-0.78,0.78-1.22,1.82-1.22,2.93c0,1.11,0.44,2.15,1.22,2.93c0.78,0.78,1.82,1.22,2.93,1.22c1.11,0,2.15-0.44,2.93-1.22 c0.78-0.78,1.22-1.82,1.22-2.93C16.4,19.25,15.96,18.21,15.18,17.43z" />
  </svg>
);

export function SocialLogins() {
  const { signInWithGoogle, signInWithApple, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSocialLogin = async (provider: "google" | "apple") => {
    try {
      const loginFn =
        provider === "google" ? signInWithGoogle : signInWithApple;
      await loginFn();
      toast({
        title: "Login bem-sucedido!",
        description: "Redirecionando para o dashboard...",
      });
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: `Erro no login com ${
          provider.charAt(0).toUpperCase() + provider.slice(1)
        }`,
        description: error.message || "Ocorreu um erro. Tente novamente.",
      });
    }
  };

  return (
    <>
      <div className="relative my-6">
        <Separator />
        <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-sm text-muted-foreground">
          OU
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          onClick={() => handleSocialLogin("google")}
          disabled={loading}
        >
          <GoogleIcon /> <span className="ml-2">Google</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => handleSocialLogin("apple")}
          disabled={loading}
        >
          <AppleIcon />
          <span className="ml-2">Apple</span>
        </Button>
      </div>
    </>
  );
}