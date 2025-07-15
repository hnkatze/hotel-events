"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { 
  Menu, 
  Home, 
  CalendarDays, 
  Users, 
  MapPin, 
  Plus,
  X
} from "lucide-react"

const navigationItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    name: "Calendario",
    href: "/calendar",
    icon: CalendarDays,
  },
  {
    name: "Salones",
    href: "/salones",
    icon: MapPin,
  },
  {
    name: "Personal",
    href: "/personal",
    icon: Users,
  },
]

export default function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Abrir menú</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle>Sistema de Eventos</SheetTitle>
          <SheetDescription>
            Navegación principal
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-6">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-blue-100 text-blue-700" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
          
          <div className="border-t pt-4 mt-4">
            <Link
              href="/events/new"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">Nuevo Evento</span>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
