"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { SettingsForm } from "@/components/dashboard/settings-form";
import { User, Settings } from "lucide-react";
import { useTranslation } from "@/contexts/app-provider";

export default function ProfilePage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t.profileTitle}</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações de perfil e configurações da aplicação.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Informações do Perfil
            </CardTitle>
            <CardDescription>
                Atualize seu nome e foto de perfil.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Configurações da Aplicação
            </CardTitle>
            <CardDescription>
                Personalize a aparência e o idioma do Heal+.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SettingsForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
