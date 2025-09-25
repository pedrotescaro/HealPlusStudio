import {OverviewStats} from '@/components/dashboard/overview-stats';
import {HealingProgressChart} from '@/components/dashboard/healing-progress-chart';
import {UpcomingAppointments} from '@/components/dashboard/upcoming-appointments';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, Dr. Smith!</h1>
        <p className="text-muted-foreground">Here's a look at your clinic's status today.</p>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <OverviewStats />
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>Healing Progress Overview</CardTitle>
              <CardDescription>
                A monthly overview of new vs. healed wounds.
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <HealingProgressChart />
            </CardContent>
          </Card>
        </div>
        <div className="grid auto-rows-max items-start gap-4 md:gap-8">
          <UpcomingAppointments />
        </div>
      </div>
    </div>
  );
}
