import { Loader2 } from "lucide-react";

export function LoadingPage({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      {message && <p className="mt-4 text-muted-foreground">{message}</p>}
    </div>
  );
}
