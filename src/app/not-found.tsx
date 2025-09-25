"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-black text-white relative">
      <div className="flex items-center space-x-4 text-lg">
        <h1 className="font-medium">404</h1>
        <div className="h-8 border-l border-gray-600"></div>
        <p className="text-gray-400">This page could not be found.</p>
      </div>

      <div className="absolute bottom-8 left-8">
        <Button
          asChild
          variant="ghost"
          className="text-gray-400 hover:text-white hover:bg-gray-900"
        >
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go back
          </Link>
        </Button>
      </div>
    </div>
  );
}
