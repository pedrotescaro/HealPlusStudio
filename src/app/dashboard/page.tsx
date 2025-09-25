"use client";

import { useAuth } from "@/hooks/use-auth";
import { LoadingPage } from "@/components/ui/loading-spinner";
import { ProfessionalDashboard } from "@/components/dashboard/professional-dashboard";
import { PatientDashboard } from "@/components/dashboard/patient-dashboard";
import { useTranslation } from "@/contexts/app-provider";
import { CatSupport } from "@/components/dashboard/cat-support";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { t } = useTranslation();

  if (loading) {
    return <LoadingPage message={t.loadingDashboard} />;
  }

  return (
    <>
      {user?.role === 'professional' ? <ProfessionalDashboard /> : <PatientDashboard />}
      <CatSupport currentPage="dashboard" />
    </>
  );
}
