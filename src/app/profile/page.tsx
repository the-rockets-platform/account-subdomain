import { Metadata } from "next"

import { Separator } from "@/ui/new-york/separator"
import { ProfileForm } from "./profile-form"


export const metadata: Metadata = {
    title: "Configurações",
}

export default function Profile() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Perfil</h3>
                <p className="text-sm text-muted-foreground">
                    Essas informações que outras pessoas o poderão ver
                </p>
            </div>
            <Separator />
            <ProfileForm />
        </div>
    );
}