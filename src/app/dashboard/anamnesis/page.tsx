"use client";

import dynamic from 'next/dynamic';
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/contexts/app-provider";
import { Skeleton } from '@/components/ui/skeleton';
import { useSearchParams } from 'next/navigation';

const AnamnesisForm = dynamic(() => import('@/components/dashboard/anamnesis-form').then(mod => mod.AnamnesisForm), {
  ssr: false,
  loading: () => (
    <div className="space-y-4">
      <Skeleton className="h-12 w-1/3" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
});

export default function AnamnesisPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const isEditMode = !!searchParams.get('edit');

  return (
    <div className="space-y-6 max-w-full page-responsive">
      <div>
        <h1 className="text-responsive-3xl font-bold tracking-tight">
          {isEditMode ? "Editar Avaliação" : t.anamnesisTitle}
        </h1>
        <p className="text-muted-foreground text-responsive-base">
          {isEditMode ? "Modifique os dados da ficha de avaliação abaixo." : t.anamnesisDescription}
        </p>
      </div>
      <Card className="w-full">
        <CardContent className="card-responsive w-full">
          <AnamnesisForm />
        </CardContent>
      </Card>
    </div>
  );
}
