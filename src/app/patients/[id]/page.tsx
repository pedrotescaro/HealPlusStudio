import {notFound} from 'next/navigation';
import Image from 'next/image';
import {patients} from '@/lib/data';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Badge} from '@/components/ui/badge';
import {formatDate} from '@/lib/utils';
import {PatientWoundTracker} from '@/components/dashboard/patient-wound-tracker';

export default function PatientDetailPage({params}: {params: {id: string}}) {
  const patient = patients.find(p => p.id === params.id);

  if (!patient) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
        <Avatar className="h-24 w-24 border-4 border-background shadow-md">
          <AvatarImage
            src={patient.avatarUrl}
            alt={patient.name}
            data-ai-hint={patient.avatarHint}
          />
          <AvatarFallback className="text-3xl">
            {patient.name
              .split(' ')
              .map(n => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
        <div className="mt-4 sm:mt-0">
          <h1 className="text-3xl font-bold tracking-tight">{patient.name}</h1>
          <p className="text-muted-foreground">
            {patient.age} years old &bull; Last visit on{' '}
            {formatDate(patient.lastVisit)}
          </p>
          <div className="mt-2">
            <Badge
              variant={
                patient.riskLevel === 'High'
                  ? 'destructive'
                  : patient.riskLevel === 'Medium'
                  ? 'secondary'
                  : 'default'
              }
            >
              Risk Level: {patient.riskLevel}
            </Badge>
          </div>
        </div>
      </div>

      <PatientWoundTracker patient={patient} />
    </div>
  );
}
