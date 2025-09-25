"use client";

import { ReportGenerator } from "@/components/dashboard/report-generator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function GenerateReportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gerador de Relatório de IA</h1>
        <p className="text-muted-foreground">
          Selecione uma avaliação de anamnese para gerar um relatório detalhado.
        </p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <ReportGenerator />
        </CardContent>
      </Card>
    </div>
  );
}
