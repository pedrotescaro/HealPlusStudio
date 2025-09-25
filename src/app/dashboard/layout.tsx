"use client";

import React from 'react';
import AppSidebar from '@/components/dashboard/app-sidebar';
import MobileNav from '@/components/dashboard/mobile-nav';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { LoadingPage } from '@/components/ui/loading-spinner';
import { CatSupport } from '@/components/dashboard/cat-support';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <LoadingPage message="Autenticando..." />;
  }

  if (!user) {
    // A verificação de autenticação concluiu e não há usuário.
    // O ideal é que o hook `useAuth` ou um middleware já tivesse redirecionado,
    // mas fazemos um último redirecionamento aqui para garantir.
    router.replace('/login');
    return <LoadingPage message="Redirecionando para login..." />;
  }

  // Se chegou até aqui, o usuário está carregado e autenticado.
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <div className="hidden md:flex">
        <AppSidebar />
      </div>
      <div className="flex flex-col flex-1">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:hidden">
          <MobileNav />
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
       <CatSupport currentPage="dashboard" />
    </div>
  );
}
