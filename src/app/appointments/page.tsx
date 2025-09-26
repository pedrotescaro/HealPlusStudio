'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import {appointments, patients} from '../../lib/data';
import type {Appointment} from '../../lib/types';
import {cn} from '../../lib/utils';
import Link from 'next/link';
import {Button} from '../../components/ui/button';

const statusVariantMap = {
  Confirmed: 'default',
  Completed: 'secondary',
  Canceled: 'destructive',
};

export default function AppointmentsPage() {
  const sortedAppointments = [...appointments].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
        <p className="text-muted-foreground">
          View and manage all patient appointments.
        </p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="hidden md:table-cell">Date & Time</TableHead>
                <TableHead className="hidden md:table-cell">Provider</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAppointments.map((appointment: Appointment) => {
                const patient = patients.find(
                  p => p.id === appointment.patientId
                );
                return (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        {patient && (
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
                        )}
                        <div className="font-medium">
                          {appointment.patientName}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge
                        variant={
                          statusVariantMap[
                            appointment.status
                          ] as keyof typeof statusVariantMap
                        }
                      >
                        {appointment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Intl.DateTimeFormat('en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      }).format(new Date(appointment.date))}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {appointment.doctor}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/patients/${appointment.patientId}`}>
                          View Patient
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
