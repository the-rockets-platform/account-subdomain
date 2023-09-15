import { Separator } from "@/ui/new-york/separator";
import Link from "next/link";

export default function Plans() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Planos</h3>
                <p className="text-sm text-muted-foreground">
                    Veja seu plano atual e os planos disponíveis
                </p>
            </div>
            <Separator />
            <div className="space-y-4">
                <p className="text-md font-medium">Atualmente você está no plano gratuito que disponiliza:</p>
                <ul className="list-disc pl-4 pt-2 space-y-4">
                    <li>Criar até 1 plataforma</li>
                    <li>Criar até 3 cursos por plataforma</li>
                    <li>Até 2000 Horas de vídeo</li>
                    <li>Espaço de comunidade</li>
                    <li>Gamificação personalizada</li>
                </ul>

                <Link
                    href="/docs/changelog"
                    className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium"
                    >
                    🚧 <Separator className="mx-2 h-4" orientation="vertical" />{" "}
                    <span className="hidden sm:inline">
                        Planos pagos em planejamento
                    </span>
                    </Link>
            </div>
        </div>
    );
}
