import { Separator } from "@/ui/new-york/separator"
import { NotificationsForm } from "./notifications-form"

export default function SettingsNotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notificações</h3>
        <p className="text-sm text-muted-foreground">
          Diga-nos quando devemos notifica-lo sobre o que acontece com suas plataformas e seus cursos
        </p>
      </div>
      <Separator />
      <NotificationsForm />
    </div>
  )
}
