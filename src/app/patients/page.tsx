'use client';
import {useRouter} from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {patients} from '@/lib/data';
import {formatDate} from '@/lib/utils';
import {cn} from '@/lib/utils';
import type {Patient} from '@/lib/types';

const riskVariantMap = {
  Low: 'default',
  Medium: 'secondary',
  High: 'destructive',
};

export default function PatientsPage() {
  const router = useRouter();

  const handleRowClick = (patientId: string) => {
    router.push(`/patients/${patientId}`);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
        <p className="text-muted-foreground">
          A list of all patients in your clinic.
        </p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">
                  Risk Level
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Last Visit
                </TableHead>
                <TableHead className="text-right">Age</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient: Patient) => (
                <TableRow
                  key={patient.id}
                  className="cursor-pointer"
                  onClick={() => handleRowClick(patient.id)}
                >
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={patient.avatarUrl}
                          alt={patient.name}
                          data-ai-hint={patient.avatarHint}
                        />
                        <AvatarFallback>
                          {patient.name
                            .split(' ')
                            .map(n => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{patient.name}</div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge
                      variant={
                        riskVariantMap[
                          patient.riskLevel
                        ] as keyof typeof riskVariantMap
                      }
                    >
                      {patient.riskLevel}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDate(patient.lastVisit)}
                  </TableCell>
                  <TableCell className="text-right">{patient.age}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
