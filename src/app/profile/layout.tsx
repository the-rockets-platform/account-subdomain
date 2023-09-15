import { Metadata } from "next"
import Image from "next/image"

import { Separator } from "@/ui/new-york/separator"
import { SidebarNav } from "./components/sidebar-nav"

export const metadata: Metadata = {
  title: "Forms",
  description: "Advanced form example using react-hook-form and Zod.",
}

const sidebarNavItems = [
  {
    title: "Perfil",
    href: "/profile",
  },
  {
    title: "Planos",
    href: "/profile/plans",
  },
  {
    title: "Aparência",
    href: "/profile/appearance",
  },
  {
    title: "Notificações",
    href: "/profile/notifications",
  },
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="space-y-6 p-10 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Seu perfil</h2>
        <p className="text-muted-foreground">
          Gerencie suas preferências de conta e dados pessoais
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </div>
  )
}
