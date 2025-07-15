"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CalendarDays,
  Users,
  MapPin,
  ArrowLeft,
  Edit,
  Printer,
  Mail,
  Phone,
  Clock,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEvents } from "@/hooks/use-events"
import { usePersonal } from "@/hooks/use-personal"
import UserMenu from "@/components/user-menu"
import MobileNav from "@/components/mobile-nav"

export default function EventDetailsPage() {
  const params = useParams()
  const eventId = params.id as string
  const { getEventById, loading } = useEvents()
  const { getPersonalByName } = usePersonal()
  
  const event = getEventById(eventId)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando evento...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Evento no encontrado</h2>
          <p className="text-gray-600 mb-6">El evento que buscas no existe o no tienes permisos para verlo.</p>
          <Link href="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

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

  const coordinator = event.staff?.coordinator ? getPersonalByName(event.staff.coordinator) : null
  const kitchenSupervisor = event.staff?.kitchenSupervisor ? getPersonalByName(event.staff.kitchenSupervisor) : null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center py-4 lg:py-6 gap-4">
            <div className="flex items-center gap-4">
              <MobileNav />
              <div className="hidden lg:block">
                <Link href="/">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver al Dashboard
                  </Button>
                </Link>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{event.name}</h1>
                <p className="text-sm lg:text-base text-gray-600">Detalles completos del evento</p>
              </div>
            </div>
            
            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-4">
              <Link href={`/events/${eventId}/edit`}>
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar Evento
                </Button>
              </Link>
              <Button variant="outline">
                <Printer className="w-4 h-4 mr-2" />
                Imprimir
              </Button>
              <UserMenu />
            </div>
            
            {/* Mobile Actions */}
            <div className="lg:hidden flex items-center justify-between gap-2">
              <Link href={`/events/${eventId}/edit`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              </Link>
              <Button variant="outline" size="sm">
                <Printer className="w-4 h-4" />
              </Button>
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información del Evento */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>Información del Evento</CardTitle>
                  <Badge className={getStatusColor(event.status)}>
                    {getStatusText(event.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Fecha</p>
                      <p className="text-gray-600">{new Date(event.date).toLocaleDateString('es-ES', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Horario</p>
                      <p className="text-gray-600">{event.startTime} - {event.endTime}</p>
                      {event.setupTime && (
                        <p className="text-sm text-gray-500">Montaje desde: {event.setupTime}</p>
                      )}
                      {event.teardownTime && (
                        <p className="text-sm text-gray-500">Desmontaje hasta: {event.teardownTime}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Ubicación</p>
                      <p className="text-gray-600">{event.venue.salon}</p>
                      <p className="text-sm text-gray-500">Configuración: {event.venue.configuration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Asistentes</p>
                      <p className="text-gray-600">{event.venue.attendeesMax} personas (máximo)</p>
                      {event.venue.attendeesMin && (
                        <p className="text-sm text-gray-500">Mínimo: {event.venue.attendeesMin}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información del Cliente */}
            {event.client && (
              <Card>
                <CardHeader>
                  <CardTitle>Información del Cliente</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {event.client.name && (
                      <div>
                        <p className="font-medium">Nombre</p>
                        <p className="text-gray-600">{event.client.name}</p>
                      </div>
                    )}
                    {event.client.position && (
                      <div>
                        <p className="font-medium">Cargo</p>
                        <p className="text-gray-600">{event.client.position}</p>
                      </div>
                    )}
                    {event.client.company && (
                      <div>
                        <p className="font-medium">Empresa</p>
                        <p className="text-gray-600">{event.client.company}</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    {event.client.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="font-medium">Teléfono</p>
                          <p className="text-gray-600">{event.client.phone}</p>
                        </div>
                      </div>
                    )}
                    {event.client.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="font-medium">Email</p>
                          <p className="text-gray-600">{event.client.email}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {event.client.specialRequirements && (
                    <div className="md:col-span-2">
                      <p className="font-medium">Requerimientos Especiales</p>
                      <p className="text-gray-600">{event.client.specialRequirements}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Servicios y Personal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Servicios</CardTitle>
                </CardHeader>
                <CardContent>
                  {event.services && event.services.length > 0 ? (
                    <ul className="space-y-2">
                      {event.services.map((service, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>{service}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600">No hay servicios especificados</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Personal Asignado</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {coordinator && (
                    <div>
                      <p className="font-medium">Coordinador</p>
                      <p className="text-gray-600">{coordinator.nombre}</p>
                      {coordinator.telefono && (
                        <p className="text-sm text-gray-500">{coordinator.telefono}</p>
                      )}
                    </div>
                  )}
                  {kitchenSupervisor && (
                    <div>
                      <p className="font-medium">Supervisor de Cocina</p>
                      <p className="text-gray-600">{kitchenSupervisor.nombre}</p>
                      {kitchenSupervisor.telefono && (
                        <p className="text-sm text-gray-500">{kitchenSupervisor.telefono}</p>
                      )}
                    </div>
                  )}
                  {event.staff?.waiters && (
                    <div>
                      <p className="font-medium">Meseros</p>
                      <p className="text-gray-600">{event.staff.waiters} personas</p>
                    </div>
                  )}
                  {event.staff?.security && (
                    <div>
                      <p className="font-medium">Seguridad</p>
                      <p className="text-gray-600">{event.staff.security} personas</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Equipamiento */}
            {event.equipment && event.equipment.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Equipamiento</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {event.equipment.map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Proveedores Externos */}
            {event.logistics?.externalProviders && (
              <Card>
                <CardHeader>
                  <CardTitle>Proveedores Externos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{event.logistics.externalProviders}</p>
                </CardContent>
              </Card>
            )}

            {/* Notas Adicionales */}
            {event.logistics?.specialNotes && (
              <Card>
                <CardHeader>
                  <CardTitle>Notas Especiales</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{event.logistics.specialNotes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}