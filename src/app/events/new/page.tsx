"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Users, MapPin, ArrowLeft, Save, X, Loader2 } from "lucide-react"
import Link from "next/link"
import { useEvents } from "@/hooks/use-events"
import { useSalones } from "@/hooks/use-salones"
import { usePersonal } from "@/hooks/use-personal"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import UserMenu from "@/components/user-menu"
import MobileNav from "@/components/mobile-nav"

export default function NewEvent() {
  const router = useRouter()
  const { user } = useAuth()
  const { addEvent } = useEvents()
  const { salones } = useSalones()
  const { getCoordinadores, getSupervisoresCocina, getMeseros, getSeguridad } = usePersonal()
  const [loading, setLoading] = useState(false)
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([])

  // Form state
  const [formData, setFormData] = useState({
    // Basic event data
    name: "",
    type: "",
    date: "",
    startTime: "",
    endTime: "",
    setupTime: "",
    status: "pending" as const,

    // Client data
    clientName: "",
    clientPosition: "",
    clientCompany: "",
    clientPhone: "",
    clientEmail: "",
    specialRequirements: "",

    // Venue data
    salon: "",
    configuration: "",
    attendeesMin: "",
    attendeesMax: "",
    additionalAreas: [] as string[],

    // Staff data
    coordinator: "",
    waiters: "",
    security: "",
    kitchenSupervisor: "",

    // Logistics
    externalProviders: "",
    specialNotes: "",
  })

  const eventTypes = [
    "Reunión Corporativa",
    "Boda",
    "Congreso",
    "Coctel",
    "Conferencia",
    "Seminario",
    "Celebración",
    "Lanzamiento de Producto",
    "Otro",
  ]

  const configurations = ["Teatro", "Escuela", "Banquete", "Cóctel", "U", "Boardroom", "Cabaret"]

  const foodServices = [
    "Desayuno Continental",
    "Coffee Break Mañana",
    "Coffee Break Tarde",
    "Almuerzo Buffet",
    "Almuerzo Servido",
    "Cena Buffet",
    "Cena Servida",
    "Cóctel de Bienvenida",
    "Brindis",
  ]

  const equipment = [
    "Proyector",
    "Pantalla",
    "Micrófono Inalámbrico",
    "Micrófono de Solapa",
    "Sistema de Audio",
    "Laptop",
    "Flipchart",
    "Pizarra",
    "Wi-Fi Reforzado",
    "Iluminación Especial",
    "Tarima",
    "Atril",
  ]

  const handleServiceToggle = (service: string) => {
    setSelectedServices((prev) => (prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]))
  }

  const handleEquipmentToggle = (item: string) => {
    setSelectedEquipment((prev) => (prev.includes(item) ? prev.filter((e) => e !== item) : [...prev, item]))
  }

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    
    // Auto-fill max attendees when salon is selected
    if (field === "salon" && typeof value === "string") {
      const selectedSalon = salones.find(s => s.nombre === value)
      if (selectedSalon) {
        setFormData(prev => ({ 
          ...prev, 
          salon: value,
          attendeesMax: selectedSalon.capacidadPersonas.toString()
        }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast.error("Debes estar autenticado para crear eventos")
      return
    }

    // Basic validation
    if (!formData.type || !formData.date || !formData.startTime || !formData.endTime) {
      toast.error("Por favor completa los campos obligatorios")
      return
    }

    if (!formData.salon || !formData.attendeesMax) {
      toast.error("Por favor selecciona un salón y especifica el número de asistentes")
      return
    }

    setLoading(true)

    try {
      const selectedSalon = salones.find((s) => s.nombre === formData.salon)
      
      // Si no hay nombre de evento, usar la fecha
      const eventName = formData.name || new Date(formData.date).toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      })

      const eventData = {
        name: eventName,
        type: formData.type,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        setupTime: formData.setupTime,
        status: formData.status,

        client: formData.clientName || formData.clientPhone || formData.clientEmail ? {
          name: formData.clientName || '',
          position: formData.clientPosition || '',
          company: formData.clientCompany || '',
          phone: formData.clientPhone || '',
          email: formData.clientEmail || '',
          specialRequirements: formData.specialRequirements || '',
        } : undefined,

        venue: {
          salon: formData.salon,
          capacity: selectedSalon?.capacidadPersonas || 0,
          configuration: formData.configuration,
          attendeesMin: Number.parseInt(formData.attendeesMin) || 0,
          attendeesMax: Number.parseInt(formData.attendeesMax),
          additionalAreas: formData.additionalAreas,
        },

        services: selectedServices,
        equipment: selectedEquipment,

        staff: {
          coordinator: formData.coordinator,
          waiters: Number.parseInt(formData.waiters) || 0,
          security: Number.parseInt(formData.security) || 0,
          kitchenSupervisor: formData.kitchenSupervisor,
        },

        logistics: {
          externalProviders: formData.externalProviders,
          specialNotes: formData.specialNotes,
        },
      }

      const eventId = await addEvent(eventData)
      toast.success("Evento creado exitosamente")
      router.push(`/events/${eventId}`)
    } catch (error) {
      console.error("Error creating event:", error)
      toast.error("Error al crear el evento")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 lg:py-6 gap-4">
            <div className="flex items-center gap-4">
              <MobileNav />
              <div className="hidden lg:block">
                <Link href="/">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver
                  </Button>
                </Link>
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Nuevo Evento</h1>
                <p className="text-sm lg:text-base text-gray-600">Registro completo de evento</p>
              </div>
            </div>
            <div className="flex justify-between items-center gap-2">
              <Button type="submit" form="event-form" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Crear Evento
                  </>
                )}
              </Button>
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      <form id="event-form" onSubmit={handleSubmit}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-4 lg:space-y-6">
              {/* 1. Datos del Evento */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CalendarDays className="w-5 h-5" />
                    Datos del Evento
                  </CardTitle>
                  <CardDescription>Información básica del evento</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="eventName">Nombre del Evento</Label>
                      <Input
                        id="eventName"
                        placeholder="ej: Conferencia Tech 2024 (opcional - se usará la fecha si no se especifica)"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eventType">Tipo de Evento *</Label>
                      <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {eventTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="eventDate">Fecha *</Label>
                      <Input
                        id="eventDate"
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange("date", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Hora Inicio *</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => handleInputChange("startTime", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endTime">Hora Fin *</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => handleInputChange("endTime", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="setupTime">Hora de Montaje</Label>
                      <Input
                        id="setupTime"
                        type="time"
                        placeholder="ej: 07:00"
                        value={formData.setupTime}
                        onChange={(e) => handleInputChange("setupTime", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Estado</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value: string) => handleInputChange("status", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pendiente</SelectItem>
                          <SelectItem value="confirmed">Confirmado</SelectItem>
                          <SelectItem value="cancelled">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 2. Cliente/Contratante */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Cliente/Contratante (Opcional)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="clientName">Nombre Completo</Label>
                      <Input
                        id="clientName"
                        placeholder="ej: María Gómez (opcional)"
                        value={formData.clientName}
                        onChange={(e) => handleInputChange("clientName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clientPosition">Cargo</Label>
                      <Input
                        id="clientPosition"
                        placeholder="ej: Directora de Marketing"
                        value={formData.clientPosition}
                        onChange={(e) => handleInputChange("clientPosition", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Empresa/Organización</Label>
                    <Input
                      id="company"
                      placeholder="ej: TechCorp S.A."
                      value={formData.clientCompany}
                      onChange={(e) => handleInputChange("clientCompany", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        placeholder="+1 234 567 8900 (opcional)"
                        value={formData.clientPhone}
                        onChange={(e) => handleInputChange("clientPhone", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="maria@techcorp.com (opcional)"
                        value={formData.clientEmail}
                        onChange={(e) => handleInputChange("clientEmail", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialRequirements">Requisitos Especiales</Label>
                    <Textarea
                      id="specialRequirements"
                      placeholder="Accesibilidad, restricciones religiosas, etc."
                      value={formData.specialRequirements}
                      onChange={(e) => handleInputChange("specialRequirements", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* 3. Salón y Espacios */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Salón y Espacios
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="salon">Salón Asignado *</Label>
                      <Select value={formData.salon} onValueChange={(value) => handleInputChange("salon", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar salón" />
                        </SelectTrigger>
                        <SelectContent>
                          {salones.map((salon) => (
                            <SelectItem key={salon.nombre} value={salon.nombre}>
                              {salon.nombre} (Cap: {salon.capacidadPersonas}) - L.{salon.precioPorHora}/h
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="configuration">Configuración *</Label>
                      <Select
                        value={formData.configuration}
                        onValueChange={(value) => handleInputChange("configuration", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tipo de configuración" />
                        </SelectTrigger>
                        <SelectContent>
                          {configurations.map((config) => (
                            <SelectItem key={config} value={config}>
                              {config}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="minAttendees">Asistentes Mínimo</Label>
                      <Input
                        id="minAttendees"
                        type="number"
                        placeholder="50"
                        value={formData.attendeesMin}
                        onChange={(e) => handleInputChange("attendeesMin", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxAttendees">Asistentes Máximo *</Label>
                      <Input
                        id="maxAttendees"
                        type="number"
                        placeholder="120"
                        value={formData.attendeesMax}
                        onChange={(e) => handleInputChange("attendeesMax", e.target.value)}
                        readOnly={!!formData.salon}
                        className={formData.salon ? "bg-gray-100" : ""}
                        required
                      />
                      {formData.salon && (
                        <p className="text-xs text-gray-500">Capacidad máxima del salón seleccionado</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 4. Servicios de Alimentación */}
              <Card>
                <CardHeader>
                  <CardTitle>Servicios de Alimentación (F&B)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Label>Servicios Seleccionados</Label>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                      {foodServices.map((service) => (
                        <div key={service} className="flex items-center space-x-2">
                          <Checkbox
                            id={service}
                            checked={selectedServices.includes(service)}
                            onCheckedChange={() => handleServiceToggle(service)}
                          />
                          <Label htmlFor={service} className="text-sm">
                            {service}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedServices.length > 0 && (
                    <div className="space-y-2">
                      <Label>Servicios Seleccionados:</Label>
                      <div className="flex flex-wrap gap-2">
                        {selectedServices.map((service) => (
                          <Badge key={service} variant="secondary" className="flex items-center gap-1">
                            {service}
                            <X className="w-3 h-3 cursor-pointer" onClick={() => handleServiceToggle(service)} />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 5. Equipamiento */}
              <Card>
                <CardHeader>
                  <CardTitle>Equipamiento y Recursos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Label>Equipos Requeridos</Label>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                      {equipment.map((item) => (
                        <div key={item} className="flex items-center space-x-2">
                          <Checkbox
                            id={item}
                            checked={selectedEquipment.includes(item)}
                            onCheckedChange={() => handleEquipmentToggle(item)}
                          />
                          <Label htmlFor={item} className="text-sm">
                            {item}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedEquipment.length > 0 && (
                    <div className="space-y-2">
                      <Label>Equipos Seleccionados:</Label>
                      <div className="flex flex-wrap gap-2">
                        {selectedEquipment.map((item) => (
                          <Badge key={item} variant="secondary" className="flex items-center gap-1">
                            {item}
                            <X className="w-3 h-3 cursor-pointer" onClick={() => handleEquipmentToggle(item)} />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Personal Asignado */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal del Hotel</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="coordinator">Coordinador Principal</Label>
                    <Select
                      value={formData.coordinator}
                      onValueChange={(value) => handleInputChange("coordinator", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Asignar coordinador" />
                      </SelectTrigger>
                      <SelectContent>
                        {getCoordinadores().length > 0 ? (
                          getCoordinadores().map((coordinador) => (
                            <SelectItem key={coordinador.id} value={coordinador.nombre}>
                              {coordinador.nombre} - {coordinador.telefono}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-coordinadores" disabled>
                            No hay coordinadores registrados
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="waiters">Cantidad de Meseros</Label>
                    <Input
                      id="waiters"
                      type="number"
                      placeholder="4"
                      value={formData.waiters}
                      onChange={(e) => handleInputChange("waiters", e.target.value)}
                    />
                    {getMeseros().length > 0 && (
                      <div className="text-xs text-gray-600">
                        Meseros disponibles: {getMeseros().map(m => m.nombre).join(", ")}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="security">Cantidad de Seguridad</Label>
                    <Input
                      id="security"
                      type="number"
                      placeholder="2"
                      value={formData.security}
                      onChange={(e) => handleInputChange("security", e.target.value)}
                    />
                    {getSeguridad().length > 0 && (
                      <div className="text-xs text-gray-600">
                        Personal de seguridad disponible: {getSeguridad().map(s => s.nombre).join(", ")}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="kitchenSupervisor">Supervisor de Cocina</Label>
                    <Select
                      value={formData.kitchenSupervisor}
                      onValueChange={(value) => handleInputChange("kitchenSupervisor", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Asignar supervisor" />
                      </SelectTrigger>
                      <SelectContent>
                        {getSupervisoresCocina().length > 0 ? (
                          getSupervisoresCocina().map((supervisor) => (
                            <SelectItem key={supervisor.id} value={supervisor.nombre}>
                              {supervisor.nombre} - {supervisor.telefono}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-supervisores" disabled>
                            No hay supervisores de cocina registrados
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Logística */}
              <Card>
                <CardHeader>
                  <CardTitle>Logística Operativa</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="externalProviders">Proveedores Externos</Label>
                    <Textarea
                      id="externalProviders"
                      placeholder="DJ, florista, etc."
                      value={formData.externalProviders}
                      onChange={(e) => handleInputChange("externalProviders", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialNotes">Notas Especiales</Label>
                    <Textarea
                      id="specialNotes"
                      placeholder="Instrucciones importantes..."
                      value={formData.specialNotes}
                      onChange={(e) => handleInputChange("specialNotes", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}