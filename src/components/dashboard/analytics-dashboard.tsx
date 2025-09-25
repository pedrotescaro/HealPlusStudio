"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart3, Users, FileText, GitCompareArrows } from "lucide-react";
import { HealingProgressChart } from "./healing-progress-chart";
import { ActivitySummaryChart } from "./activity-summary-chart";
import { useAuth } from "@/hooks/use-auth";
import { useFirebase } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

export function AnalyticsDashboard() {
  const { user } = useAuth();
  const { firestore } = useFirebase();
  const [stats, setStats] = useState({
    patients: 0,
    assessments: 0,
    reports: 0,
    comparisons: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !firestore) return;

      const [assessmentsSnapshot, reportsSnapshot, comparisonsSnapshot] = await Promise.all([
        getDocs(collection(firestore, "users", user.uid, "anamnesis")),
        getDocs(collection(firestore, "users", user.uid, "reports")),
        getDocs(collection(firestore, "users", user.uid, "comparisons")),
      ]);

      const patientIds = new Set(assessmentsSnapshot.docs.map(doc => doc.data().nome_cliente));

      setStats({
        patients: patientIds.size,
        assessments: assessmentsSnapshot.size,
        reports: reportsSnapshot.size,
        comparisons: comparisonsSnapshot.size,
      });
    };

    fetchData();
  }, [user, firestore]);

  const activityData = [
    { name: "completedForms", value: stats.assessments },
    { name: "generatedReports", value: stats.reports },
    { name: "comparisons", value: stats.comparisons },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Métricas e insights sobre sua atividade na plataforma.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pacientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.patients}</div>
            <p className="text-xs text-muted-foreground">Pacientes únicos registrados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Avaliações</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.assessments}</div>
            <p className="text-xs text-muted-foreground">Fichas de anamnese criadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Relatórios Gerados</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reports}</div>
            <p className="text-xs text-muted-foreground">Relatórios de IA finalizados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comparações</CardTitle>
            <GitCompareArrows className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.comparisons}</div>
            <p className="text-xs text-muted-foreground">Análises de evolução</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Progresso de Cicatrização (Exemplo)</CardTitle>
            <CardDescription>
              Novas feridas vs. feridas cicatrizadas por mês.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HealingProgressChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Resumo da Atividade</CardTitle>
            <CardDescription>
              Distribuição das suas principais ações.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ActivitySummaryChart data={activityData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
