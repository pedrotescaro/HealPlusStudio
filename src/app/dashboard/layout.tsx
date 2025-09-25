"use client";

import React, { useEffect } from 'react';
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

  useEffect(() => {
    // Redireciona apenas após a verificação de autenticação e se não houver usuário.
    // Isso evita o erro "Cannot update a component while rendering a different component".
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <LoadingPage message="Autenticando..." />;
  }

  // Se não há usuário e ainda não redirecionou, exibe o carregamento para evitar piscar a tela.
  if (!user) {
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
