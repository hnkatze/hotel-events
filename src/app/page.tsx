"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Users, MapPin, Plus, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useEvents } from "@/hooks/use-events"
import { useSalones } from "@/hooks/use-salones"
import { useHotelConfig } from "@/hooks/use-hotel-config"
import { useAuth } from "@/contexts/auth-context"
import UserMenu from "@/components/user-menu"
import MobileNav from "@/components/mobile-nav"

export default function Dashboard() {
  const { user } = useAuth()
  const { events, loading } = useEvents()
  const { salones } = useSalones()
  const { config: hotelConfig } = useHotelConfig()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "finished":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmado"
      case "pending":
        return "Pendiente"
      case "cancelled":
        return "Cancelado"
      case "finished":
        return "Finalizado"
      default:
        return status
    }
  }

  // Calculate stats from real data
  const confirmedEvents = events.filter((e) => e.status === "confirmed")
  const totalAttendees = events.reduce((sum, event) => sum + (event.venue?.attendeesMax || 0), 0)

  // Get salon availability (simplified - check if any event today uses the salon)
  const today = new Date().toISOString().split("T")[0]
  const todayEvents = events.filter((e) => e.date === today)
  const occupiedSalons = new Set(todayEvents.map((e) => e.venue.salon))
  const availableSalons = salones.filter((s) => !occupiedSalons.has(s.nombre))

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando eventos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center py-4 lg:py-6 gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <MobileNav />
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Sistema de Eventos</h1>
                  <p className="text-sm lg:text-base text-gray-600">{hotelConfig?.nombreHotel || "Mi Hotel"} - Bienvenido, {user?.displayName || user?.email}</p>
                </div>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-4">
              <Link href="/personal">
                <Button variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Gestionar Personal
                </Button>
              </Link>
              <Link href="/salones">
                <Button variant="outline">
                  <MapPin className="w-4 h-4 mr-2" />
                  Gestionar Salones
                </Button>
              </Link>
              <Link href="/calendar">
                <Button variant="outline">
                  <CalendarDays className="w-4 h-4 mr-2" />
                  Calendario
                </Button>
              </Link>
              <Link href="/events/new">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Evento
                </Button>
              </Link>
              <UserMenu />
            </div>

            {/* Mobile Navigation - Solo botón principal y menú usuario */}
            <div className="lg:hidden flex items-center gap-3">
              <Link href="/events/new" className="flex-1">
                <Button className="bg-blue-600 hover:bg-blue-700 w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Evento
                </Button>
              </Link>
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs lg:text-sm font-medium">Total Eventos</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl lg:text-2xl font-bold">{events.length}</div>
              <p className="text-xs text-muted-foreground">{confirmedEvents.length} confirmados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs lg:text-sm font-medium">Eventos Confirmados</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg lg:text-2xl font-bold">{confirmedEvents.length}</div>
              <p className="text-xs text-muted-foreground">De {events.length} eventos totales</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs lg:text-sm font-medium">Asistentes Total</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl lg:text-2xl font-bold">{totalAttendees.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Promedio: {events.length > 0 ? Math.round(totalAttendees / events.length) : 0} por evento
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs lg:text-sm font-medium">Salones Disponibles</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl lg:text-2xl font-bold">{availableSalons.length}/{salones.length}</div>
              <p className="text-xs text-muted-foreground">
                {occupiedSalons.size > 0 ? `${occupiedSalons.size} ocupados hoy` : "Todos disponibles"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Buscar eventos..." className="pl-10" />
              </div>
            </div>
            <Button variant="outline" className="sm:w-auto">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>

        {/* Events List */}
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Mis Eventos</CardTitle>
              <CardDescription>
                {events.length === 0 ? "No tienes eventos registrados aún" : `${events.length} eventos registrados`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {events.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarDays className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay eventos</h3>
                  <p className="text-gray-600 mb-4">Comienza creando tu primer evento</p>
                  <Link href="/events/new">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Crear Primer Evento
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {events.slice(0, 5).map((event) => (
                    <div
                      key={event.id}
                      className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{event.name}</h3>
                          <div className="flex flex-wrap gap-2">
                            <Badge className={getStatusColor(event.status)}>{getStatusText(event.status)}</Badge>
                            <Badge variant="outline">{event.type}</Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">
                              {event.date} | {event.startTime} - {event.endTime}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{event.venue.salon}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 flex-shrink-0" />
                            <span>{event.venue.attendeesMax} asistentes</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 flex-shrink-0" />
                            <span>{event.staff?.coordinator || "Sin coordinador"}</span>
                          </div>
                        </div>

                        <div className="mt-2 text-sm text-gray-500">
                          {event.client?.name && `Cliente: ${event.client.name} | `}Setup: {event.setupTime || "No definido"}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 lg:flex-col lg:w-auto">
                        <Link href={`/events/${event.id}`} className="flex-1 sm:flex-none">
                          <Button variant="outline" size="sm" className="w-full">
                            Ver Detalles
                          </Button>
                        </Link>
                        <Link href={`/events/${event.id}/edit`} className="flex-1 sm:flex-none">
                          <Button variant="outline" size="sm" className="w-full">
                            Editar
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}

                  {events.length > 5 && (
                    <div className="text-center pt-4">
                      <Link href="/events">
                        <Button variant="outline">Ver todos los eventos ({events.length})</Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Salones Status */}
          <Card>
            <CardHeader>
              <CardTitle>Estado de Salones</CardTitle>
              <CardDescription>Disponibilidad actual de los 5 salones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {salones.map((salon, index) => {
                  const isOccupied = occupiedSalons.has(salon.nombre)
                  return (
                    <div
                      key={index}
                      className={`p-3 lg:p-4 rounded-lg border-2 ${
                        !isOccupied ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                      }`}
                    >
                      <div className="text-center">
                        <h4 className="font-semibold text-sm lg:text-base truncate">{salon.nombre}</h4>
                        <p className="text-xs lg:text-sm text-gray-600">Cap: {salon.capacidadPersonas}</p>
                        <Badge
                          className={`mt-2 text-xs ${!isOccupied ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                        >
                          {!isOccupied ? "Disponible" : "Ocupado"}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
