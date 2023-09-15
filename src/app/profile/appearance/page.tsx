import { Separator } from "@/ui/new-york/separator"
import { AppearanceForm } from "./appearance-form"

export default function SettingsAppearancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Aparência</h3>
        <p className="text-sm text-muted-foreground">
          Customize a aparência de acordo com seus gostos
        </p>
      </div>
      <Separator />
      <AppearanceForm />
    </div>
  )
}
