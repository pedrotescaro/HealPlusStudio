"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/contexts/app-provider";
import { useAuth } from "@/hooks/use-auth";
import { useFirebase } from "@/firebase";
import { collection, query, getDocs, orderBy, where } from "firebase/firestore";
import { useState, useEffect } from "react";
import { 
  FileText, 
  Calendar, 
  User, 
  TrendingUp, 
  TrendingDown, 
  BarChart3,
  Download,
  Share2,
  Eye,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Info,
  Loader2
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface ReportData {
  id: string;
  patientName: string;
  date: string;
  woundType: string;
  severity: 'low' | 'medium' | 'high';
  progress: number;
  notes: string;
  professional: string;
}

export function CompareReportsView() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const [reports, setReports] = useState<ReportData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [comparisonData, setComparisonData] = useState<ReportData[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      if (!user || !firestore) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const reportsQuery = query(
          collection(firestore, "users", user.uid, "reports"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(reportsQuery);
        const fetchedReports = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                patientName: data.patientName,
                date: data.createdAt.toDate().toISOString(),
                woundType: data.woundType || 'Não especificado',
                severity: data.severity || 'medium',
                progress: data.progress || 0,
                notes: data.reportContent,
                professional: user.name || 'Desconhecido'
            };
        });
        setReports(fetchedReports);
      } catch (error) {
        console.error("Error fetching reports:", error);
        toast({ title: "Erro", description: "Não foi possível carregar os relatórios.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, [user, firestore, toast]);
  
  const handleReportSelect = (reportId: string) => {
    setSelectedReports(prev => {
        if (prev.includes(reportId)) {
            return prev.filter(id => id !== reportId);
        }
        if (prev.length < 2) {
            return [...prev, reportId];
        }
        toast({ title: "Limite Atingido", description: "Você só pode selecionar até 2 relatórios para comparar.", variant: "default"});
        return prev;
    });
  };

  const handleCompare = () => {
    if (selectedReports.length < 2) {
        toast({ title: "Seleção Incompleta", description: "Selecione 2 relatórios para comparar.", variant: "destructive"});
        return;
    };
    
    const selectedData = reports?.filter(report => 
      selectedReports.includes(report.id)
    ) || [];
    
    setComparisonData(selectedData.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    toast({ title: "Comparação Realizada", description: "A análise comparativa foi atualizada."});
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'low': return 'Baixa';
      case 'medium': return 'Média';
      case 'high': return 'Alta';
      default: return 'Desconhecida';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-full page-responsive">
        <div className="space-y-2">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="grid gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-full page-responsive">
      <div>
        <h1 className="text-responsive-3xl font-bold tracking-tight">Comparar Relatórios</h1>
        <p className="text-muted-foreground text-responsive-base">
          Compare múltiplos relatórios para analisar a evolução do tratamento
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Seleção de Relatórios */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Selecionar Relatórios
            </CardTitle>
            <CardDescription>
              Escolha os relatórios que deseja comparar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
                <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : reports?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum relatório encontrado</p>
                <p className="text-sm">Crie alguns relatórios primeiro</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reports?.map((report) => (
                  <div
                    key={report.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedReports.includes(report.id)
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
                    onClick={() => handleReportSelect(report.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{report.patientName}</h3>
                          <Badge variant="outline" className={getSeverityColor(report.severity)}>
                            {getSeverityLabel(report.severity)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(report.date).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {report.professional}
                          </div>
                        </div>
                      </div>
                      {selectedReports.includes(report.id) && (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleCompare} disabled={selectedReports.length < 2} className="w-full">
              <BarChart3 className="h-4 w-4 mr-2" />
              Comparar Relatórios ({selectedReports.length}/2)
            </Button>
          </CardFooter>
        </Card>

        {/* Comparação */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Comparação
            </CardTitle>
            <CardDescription>
              Análise comparativa dos relatórios selecionados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {comparisonData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Selecione 2 relatórios e clique em "Comparar"</p>
              </div>
            ) : (
              <div className="space-y-4">
                {comparisonData.map((report, index) => (
                  <div key={report.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{report.patientName}</h3>
                      <Badge variant="outline" className={getSeverityColor(report.severity)}>
                        {getSeverityLabel(report.severity)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Data:</span>
                        <span>{new Date(report.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progresso:</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${report.progress}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{report.progress}%</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Tipo de Ferida:</span>
                        <span>{report.woundType}</span>
                      </div>
                    </div>
                    
                    {report.notes && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm text-muted-foreground line-clamp-3">{report.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
           {comparisonData.length > 0 && (
            <CardFooter className="flex-col items-start gap-4">
                <Separator />
                 <div className="flex gap-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="outline">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
            </CardFooter>
           )}
        </Card>
      </div>

      {/* Análise Comparativa */}
      {comparisonData.length >= 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Análise Comparativa (Simulação)
            </CardTitle>
            <CardDescription>
              Insights baseados na comparação dos relatórios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                <h4 className="font-semibold mb-2 flex items-center gap-2 text-green-800">
                  <TrendingUp className="h-4 w-4" />
                  Melhorias Identificadas
                </h4>
                <ul className="space-y-1 text-sm text-green-700">
                  <li>• Redução de <strong>15%</strong> na área da ferida.</li>
                  <li>• Aumento do tecido de granulação em <strong>20%</strong>.</li>
                  <li>• Diminuição do exsudato de 'moderado' para 'pequeno'.</li>
                </ul>
              </div>
              
              <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                <h4 className="font-semibold mb-2 flex items-center gap-2 text-yellow-800">
                  <AlertCircle className="h-4 w-4" />
                  Pontos de Atenção
                </h4>
                <ul className="space-y-1 text-sm text-yellow-700">
                  <li>• Leve maceração na pele perilesional.</li>
                  <li>• Paciente relatou dor esporádica.</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
