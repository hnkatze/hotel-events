"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save, Loader2, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useEvents } from "@/hooks/use-events"
import { useSalones } from "@/hooks/use-salones"
import { usePersonal } from "@/hooks/use-personal"
import UserMenu from "@/components/user-menu"
import { toast } from "sonner"

const eventTypes = [
  "Reunión Corporativa",
  "Boda", 
  "Congreso",
  "Coctel",
  "Conferencia",
  "Seminario",
  "Celebración",
  "Lanzamiento de Producto",
  "Otro"
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
  "Brindis"
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
  "Atril"
]

export default function EditEventPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.id as string
  
  const { getEventById, updateEvent, loading: eventsLoading } = useEvents()
  const { salones } = useSalones()
  const { getCoordinadores, getSupervisoresCocina, getMeseros, getSeguridad } = usePersonal()
  
  const coordinadores = getCoordinadores()
  const supervisoresCocina = getSupervisoresCocina()
  
  const event = getEventById(eventId)
  const [loading, setLoading] = useState(false)
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([])
  
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    date: "",
    startTime: "",
    endTime: "",
    setupTime: "",
    teardownTime: "",
    status: "pending" as "pending" | "confirmed" | "cancelled" | "finished",
    
    // Client data (optional)
    clientName: "",
    clientPosition: "",
    clientCompany: "",
    clientPhone: "",
    clientEmail: "",
    specialRequirements: "",
    
    venue: {
      salon: "",
      capacity: 0,
      configuration: "",
      attendeesMin: 0,
      attendeesMax: 0,
      additionalAreas: [] as string[]
    },
    
    staff: {
      coordinator: "",
      waiters: 0,
      security: 0,
      kitchenSupervisor: ""
    },
    
    logistics: {
      externalProviders: "",
      specialNotes: ""
    }
  })

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name || "",
        type: event.type || "",
        date: event.date || "",
        startTime: event.startTime || "",
        endTime: event.endTime || "",
        setupTime: event.setupTime || "",
        teardownTime: event.teardownTime || "",
        status: event.status || "pending",
        
        clientName: event.client?.name || "",
        clientPosition: event.client?.position || "",
        clientCompany: event.client?.company || "",
        clientPhone: event.client?.phone || "",
        clientEmail: event.client?.email || "",
        specialRequirements: event.client?.specialRequirements || "",
        
        venue: {
          salon: event.venue?.salon || "",
          capacity: event.venue?.capacity || 0,
          configuration: event.venue?.configuration || "",
          attendeesMin: event.venue?.attendeesMin || 0,
          attendeesMax: event.venue?.attendeesMax || 0,
          additionalAreas: event.venue?.additionalAreas || []
        },
        
        staff: {
          coordinator: event.staff?.coordinator || "",
          waiters: event.staff?.waiters || 0,
          security: event.staff?.security || 0,
          kitchenSupervisor: event.staff?.kitchenSupervisor || ""
        },
        
        logistics: {
          externalProviders: event.logistics?.externalProviders || "",
          specialNotes: event.logistics?.specialNotes || ""
        }
      })
      
      setSelectedServices(event.services || [])
      setSelectedEquipment(event.equipment || [])
    }
  }, [event])

  if (eventsLoading) {
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
          <p className="text-gray-600 mb-6">El evento que buscas no existe o no tienes permisos para editarlo.</p>
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

  const handleSalonChange = (salonName: string) => {
    const salon = salones.find(s => s.nombre === salonName)
    if (salon) {
      setFormData(prev => ({
        ...prev,
        venue: {
          ...prev.venue,
          salon: salonName,
          capacity: salon.capacidadPersonas,
          attendeesMax: salon.capacidadPersonas
        }
      }))
    }
  }

  const handleServiceToggle = (service: string) => {
    setSelectedServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service)
        : [...prev, service]
    )
  }

  const handleEquipmentToggle = (item: string) => {
    setSelectedEquipment(prev => 
      prev.includes(item)
        ? prev.filter(e => e !== item)
        : [...prev, item]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const selectedSalon = salones.find((s) => s.nombre === formData.venue.salon)
      
      // Si no hay nombre de evento, usar la fecha
      const eventName = formData.name || new Date(formData.date).toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      })

      const updateData = {
        name: eventName,
        type: formData.type,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        setupTime: formData.setupTime,
        teardownTime: formData.teardownTime,
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
          salon: formData.venue.salon,
          capacity: selectedSalon?.capacidadPersonas || formData.venue.capacity,
          configuration: formData.venue.configuration,
          attendeesMin: formData.venue.attendeesMin,
          attendeesMax: formData.venue.attendeesMax,
          additionalAreas: formData.venue.additionalAreas
        },
        
        services: selectedServices,
        equipment: selectedEquipment,
        
        staff: {
          coordinator: formData.staff.coordinator,
          waiters: formData.staff.waiters,
          security: formData.staff.security,
          kitchenSupervisor: formData.staff.kitchenSupervisor
        },
        
        logistics: {
          externalProviders: formData.logistics.externalProviders,
          specialNotes: formData.logistics.specialNotes
        }
      }

      await updateEvent(eventId, updateData)
      toast.success("Evento actualizado exitosamente")
      router.push(`/events/${eventId}`)
    } catch (error) {
      console.error("Error updating event:", error)
      toast.error("Error al actualizar el evento")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <Link href={`/events/${eventId}`}>
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver a Detalles
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Editar Evento</h1>
                <p className="text-gray-600">Modifica la información del evento</p>
              </div>
            </div>
            <UserMenu />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información Básica */}
            <Card>
              <CardHeader>
                <CardTitle>Información Básica del Evento</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Nombre del Evento</Label>
                  <Input
                    id="name"
                    placeholder="ej: Conferencia Tech 2024 (opcional - se usará la fecha si no se especifica)"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="type">Tipo de Evento *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="date">Fecha *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="status">Estado</Label>
                  <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="confirmed">Confirmado</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                      <SelectItem value="finished">Finalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="startTime">Hora de Inicio *</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="endTime">Hora de Fin *</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="setupTime">Hora de Montaje</Label>
                  <Input
                    id="setupTime"
                    type="time"
                    value={formData.setupTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, setupTime: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="teardownTime">Hora de Desmontaje</Label>
                  <Input
                    id="teardownTime"
                    type="time"
                    value={formData.teardownTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, teardownTime: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Información del Cliente */}
            <Card>
              <CardHeader>
                <CardTitle>Información del Cliente (Opcional)</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="clientName">Nombre del Cliente</Label>
                  <Input
                    id="clientName"
                    placeholder="ej: María Gómez (opcional)"
                    value={formData.clientName}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="clientPhone">Teléfono</Label>
                  <Input
                    id="clientPhone"
                    placeholder="+1 234 567 8900 (opcional)"
                    value={formData.clientPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="clientEmail">Email</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    placeholder="maria@techcorp.com (opcional)"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="clientPosition">Cargo</Label>
                  <Input
                    id="clientPosition"
                    placeholder="ej: Directora de Marketing"
                    value={formData.clientPosition}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientPosition: e.target.value }))}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="clientCompany">Empresa</Label>
                  <Input
                    id="clientCompany"
                    placeholder="ej: TechCorp S.A."
                    value={formData.clientCompany}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientCompany: e.target.value }))}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="specialRequirements">Requerimientos Especiales</Label>
                  <Textarea
                    id="specialRequirements"
                    placeholder="Accesibilidad, restricciones religiosas, etc."
                    value={formData.specialRequirements}
                    onChange={(e) => setFormData(prev => ({ ...prev, specialRequirements: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Información del Venue */}
            <Card>
              <CardHeader>
                <CardTitle>Información del Venue</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="salon">Salón *</Label>
                  <Select value={formData.venue.salon} onValueChange={handleSalonChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un salón" />
                    </SelectTrigger>
                    <SelectContent>
                      {salones.map((salon) => (
                        <SelectItem key={salon.nombre} value={salon.nombre}>
                          {salon.nombre} - L.{salon.precioPorHora}/hora
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="configuration">Configuración *</Label>
                  <Select value={formData.venue.configuration} onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    venue: { ...prev.venue, configuration: value }
                  }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona configuración" />
                    </SelectTrigger>
                    <SelectContent>
                      {configurations.map((config) => (
                        <SelectItem key={config} value={config}>{config}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="attendeesMin">Asistentes Mínimo</Label>
                  <Input
                    id="attendeesMin"
                    type="number"
                    value={formData.venue.attendeesMin}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      venue: { ...prev.venue, attendeesMin: parseInt(e.target.value) || 0 }
                    }))}
                  />
                </div>

                <div>
                  <Label htmlFor="attendeesMax">Asistentes Máximo *</Label>
                  <Input
                    id="attendeesMax"
                    type="number"
                    value={formData.venue.attendeesMax}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      venue: { ...prev.venue, attendeesMax: parseInt(e.target.value) || 0 }
                    }))}
                    readOnly={!!formData.venue.salon}
                    className={formData.venue.salon ? "bg-gray-100" : ""}
                    required
                  />
                  {formData.venue.salon && (
                    <p className="text-xs text-gray-500 mt-1">Capacidad máxima del salón seleccionado</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Servicios */}
            <Card>
              <CardHeader>
                <CardTitle>Servicios de Alimentación (F&B)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  {foodServices.map((service) => (
                    <div key={service} className="flex items-center space-x-2">
                      <Checkbox
                        id={service}
                        checked={selectedServices.includes(service)}
                        onCheckedChange={() => handleServiceToggle(service)}
                      />
                      <Label htmlFor={service} className="text-sm font-normal">
                        {service}
                      </Label>
                    </div>
                  ))}
                </div>
                {selectedServices.length > 0 && (
                  <div className="mt-4 space-y-2">
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

            {/* Equipos */}
            <Card>
              <CardHeader>
                <CardTitle>Equipamiento y Recursos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  {equipment.map((item) => (
                    <div key={item} className="flex items-center space-x-2">
                      <Checkbox
                        id={item}
                        checked={selectedEquipment.includes(item)}
                        onCheckedChange={() => handleEquipmentToggle(item)}
                      />
                      <Label htmlFor={item} className="text-sm font-normal">
                        {item}
                      </Label>
                    </div>
                  ))}
                </div>
                {selectedEquipment.length > 0 && (
                  <div className="mt-4 space-y-2">
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
            {/* Personal */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Asignado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="coordinator">Coordinador</Label>
                  <Select value={formData.staff.coordinator} onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    staff: { ...prev.staff, coordinator: value }
                  }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona coordinador" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Sin asignar</SelectItem>
                      {coordinadores.map((person) => (
                        <SelectItem key={person.id} value={person.nombre}>
                          {person.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="kitchenSupervisor">Supervisor de Cocina</Label>
                  <Select value={formData.staff.kitchenSupervisor} onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    staff: { ...prev.staff, kitchenSupervisor: value }
                  }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona supervisor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Sin asignar</SelectItem>
                      {supervisoresCocina.map((person) => (
                        <SelectItem key={person.id} value={person.nombre}>
                          {person.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="waiters">Cantidad de Meseros</Label>
                  <Input
                    id="waiters"
                    type="number"
                    min="0"
                    value={formData.staff.waiters}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      staff: { ...prev.staff, waiters: parseInt(e.target.value) || 0 }
                    }))}
                  />
                  {getMeseros().length > 0 && (
                    <div className="text-xs text-gray-600 mt-1">
                      Meseros disponibles: {getMeseros().map(m => m.nombre).join(", ")}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="security">Personal de Seguridad</Label>
                  <Input
                    id="security"
                    type="number"
                    min="0"
                    value={formData.staff.security}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      staff: { ...prev.staff, security: parseInt(e.target.value) || 0 }
                    }))}
                  />
                  {getSeguridad().length > 0 && (
                    <div className="text-xs text-gray-600 mt-1">
                      Personal de seguridad disponible: {getSeguridad().map(s => s.nombre).join(", ")}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Notas */}
            <Card>
              <CardHeader>
                <CardTitle>Logística Operativa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="externalProviders">Proveedores Externos</Label>
                  <Textarea
                    id="externalProviders"
                    placeholder="DJ, florista, etc."
                    value={formData.logistics.externalProviders}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      logistics: { ...prev.logistics, externalProviders: e.target.value }
                    }))}
                  />
                </div>

                <div>
                  <Label htmlFor="specialNotes">Notas Especiales</Label>
                  <Textarea
                    id="specialNotes"
                    value={formData.logistics.specialNotes}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      logistics: { ...prev.logistics, specialNotes: e.target.value }
                    }))}
                    placeholder="Instrucciones importantes..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Botones de Acción */}
            <div className="flex gap-4">
              <Link href={`/events/${eventId}`} className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}