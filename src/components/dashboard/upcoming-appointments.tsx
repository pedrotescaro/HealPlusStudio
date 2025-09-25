import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {appointments, patients} from '@/lib/data';
import {Button} from '../ui/button';
import Link from 'next/link';

export function UpcomingAppointments() {
  const upcomingAppointments = appointments
    .filter(a => new Date(a.date) >= new Date() && a.status === 'Confirmed')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
        <CardDescription>
          Here are the next appointments on your schedule.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {upcomingAppointments.length > 0 ? (
          <div className="space-y-4">
            {upcomingAppointments.map(appointment => {
              const patient = patients.find(
                p => p.id === appointment.patientId
              );
              return (
                <div
                  key={appointment.id}
                  className="flex items-center space-x-4"
                >
                  <Avatar className="hidden h-9 w-9 sm:flex">
                    <AvatarImage
                      src={patient?.avatarUrl}
                      alt={patient?.name}
                      data-ai-hint={patient?.avatarHint}
                    />
                    <AvatarFallback>
                      {patient?.name
                        .split(' ')
                        .map(n => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">
                      {appointment.patientName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Intl.DateTimeFormat('en-US', {
                        month: 'long',
                        day: 'numeric',
                      }).format(new Date(appointment.date))}{' '}
                      at {appointment.time}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/patients/${patient?.id}`}>View</Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No upcoming appointments.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
