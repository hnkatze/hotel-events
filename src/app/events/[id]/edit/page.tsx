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
import { ArrowLeft, Save, Loader2 } from "lucide-react"
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
  "Lanzamiento de Producto"
]

const configurations = [
  "Teatro",
  "Escuela",
  "Cóctel",
  "Banquete",
  "U-Shape",
  "Boardroom"
]

const services = [
  "Coffee Break Mañana",
  "Coffee Break Tarde", 
  "Almuerzo",
  "Cena",
  "Servicio de Bar",
  "Decoración",
  "Música/DJ",
  "Fotografía",
  "Video"
]

const equipment = [
  "Proyector",
  "Pantalla",
  "Micrófono Inalámbrico",
  "Sistema de Audio",
  "Wi-Fi Reforzado",
  "Flipchart",
  "TV",
  "Equipo de Video Conferencia"
]

export default function EditEventPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.id as string
  
  const { getEventById, updateEvent, loading: eventsLoading } = useEvents()
  const { salones } = useSalones()
  const { getCoordinadores, getSupervisoresCocina } = usePersonal()
  
  const coordinadores = getCoordinadores()
  const supervisoresCocina = getSupervisoresCocina()
  
  const event = getEventById(eventId)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    date: "",
    startTime: "",
    endTime: "",
    setupTime: "",
    teardownTime: "",
    status: "pending" as "pending" | "confirmed" | "cancelled" | "finished",
    
    client: {
      name: "",
      position: "",
      company: "",
      phone: "",
      email: "",
      specialRequirements: ""
    },
    
    venue: {
      salon: "",
      capacity: 0,
      configuration: "",
      attendeesMin: 0,
      attendeesMax: 0,
      additionalAreas: [] as string[]
    },
    
    services: [] as string[],
    equipment: [] as string[],
    
    staff: {
      coordinator: "",
      waiters: 0,
      security: 0,
      kitchenSupervisor: ""
    },
    
    financial: {
      totalCost: 0,
      deposit: 0,
      depositDate: "",
      balance: 0,
      paymentMethod: ""
    },
    
    logistics: {
      externalProviders: "",
      specialNotes: ""
    },
    
    legal: {
      contractSigned: false,
      contractDate: "",
      insurance: false,
      permits: false
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
        
        client: {
          name: event.client?.name || "",
          position: event.client?.position || "",
          company: event.client?.company || "",
          phone: event.client?.phone || "",
          email: event.client?.email || "",
          specialRequirements: event.client?.specialRequirements || ""
        },
        
        venue: {
          salon: event.venue?.salon || "",
          capacity: event.venue?.capacity || 0,
          configuration: event.venue?.configuration || "",
          attendeesMin: event.venue?.attendeesMin || 0,
          attendeesMax: event.venue?.attendeesMax || 0,
          additionalAreas: event.venue?.additionalAreas || []
        },
        
        services: event.services || [],
        equipment: event.equipment || [],
        
        staff: {
          coordinator: event.staff?.coordinator || "",
          waiters: event.staff?.waiters || 0,
          security: event.staff?.security || 0,
          kitchenSupervisor: event.staff?.kitchenSupervisor || ""
        },
        
        financial: {
          totalCost: event.financial?.totalCost || 0,
          deposit: event.financial?.deposit || 0,
          depositDate: event.financial?.depositDate || "",
          balance: event.financial?.balance || 0,
          paymentMethod: event.financial?.paymentMethod || ""
        },
        
        logistics: {
          externalProviders: event.logistics?.externalProviders || "",
          specialNotes: event.logistics?.specialNotes || ""
        },
        
        legal: {
          contractSigned: event.legal?.contractSigned || false,
          contractDate: event.legal?.contractDate || "",
          insurance: event.legal?.insurance || false,
          permits: event.legal?.permits || false
        }
      })
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

  const calculateHours = (start: string, end: string) => {
    if (!start || !end) return 0
    const startTime = new Date(`2000-01-01T${start}:00`)
    const endTime = new Date(`2000-01-01T${end}:00`)
    return (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)
  }

  const calculateTotalCost = () => {
    const selectedSalon = salones.find(s => s.nombre === formData.venue.salon)
    if (!selectedSalon || !formData.startTime || !formData.endTime) return 0
    
    const hours = calculateHours(formData.startTime, formData.endTime)
    return hours * selectedSalon.precioPorHora
  }

  const handleSalonChange = (salonName: string) => {
    const salon = salones.find(s => s.nombre === salonName)
    if (salon) {
      const newTotalCost = calculateTotalCost()
      setFormData(prev => ({
        ...prev,
        venue: {
          ...prev.venue,
          salon: salonName,
          capacity: salon.capacidadPersonas
        },
        financial: {
          ...prev.financial,
          totalCost: newTotalCost
        }
      }))
    }
  }

  const handleTimeChange = (field: "startTime" | "endTime", value: string) => {
    setFormData(prev => {
      const updated = {
        ...prev,
        [field]: value
      }
      
      if (updated.startTime && updated.endTime && updated.venue.salon) {
        const newTotalCost = calculateTotalCost()
        updated.financial = {
          ...updated.financial,
          totalCost: newTotalCost
        }
      }
      
      return updated
    })
  }

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }))
  }

  const handleEquipmentToggle = (item: string) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.includes(item)
        ? prev.equipment.filter(e => e !== item)
        : [...prev.equipment, item]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await updateEvent(eventId, formData)
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
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Información Básica */}
          <Card>
            <CardHeader>
              <CardTitle>Información Básica del Evento</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Nombre del Evento *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
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
                  onChange={(e) => handleTimeChange("startTime", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="endTime">Hora de Fin *</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleTimeChange("endTime", e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Información del Cliente */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Cliente</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="clientName">Nombre del Cliente *</Label>
                <Input
                  id="clientName"
                  value={formData.client.name}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    client: { ...prev.client, name: e.target.value }
                  }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="clientPhone">Teléfono *</Label>
                <Input
                  id="clientPhone"
                  value={formData.client.phone}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    client: { ...prev.client, phone: e.target.value }
                  }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="clientEmail">Email *</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={formData.client.email}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    client: { ...prev.client, email: e.target.value }
                  }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="clientPosition">Cargo</Label>
                <Input
                  id="clientPosition"
                  value={formData.client.position}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    client: { ...prev.client, position: e.target.value }
                  }))}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="clientCompany">Empresa</Label>
                <Input
                  id="clientCompany"
                  value={formData.client.company}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    client: { ...prev.client, company: e.target.value }
                  }))}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="specialRequirements">Requerimientos Especiales</Label>
                <Textarea
                  id="specialRequirements"
                  value={formData.client.specialRequirements}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    client: { ...prev.client, specialRequirements: e.target.value }
                  }))}
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
                <Label htmlFor="attendeesMax">Número de Asistentes *</Label>
                <Input
                  id="attendeesMax"
                  type="number"
                  value={formData.venue.attendeesMax}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    venue: { ...prev.venue, attendeesMax: parseInt(e.target.value) || 0 }
                  }))}
                  required
                />
              </div>

              <div>
                <Label>Costo Total Calculado</Label>
                <div className="text-2xl font-bold text-green-600">
                  L.{formData.financial.totalCost.toLocaleString()}
                </div>
                {formData.venue.salon && formData.startTime && formData.endTime && (
                  <div className="text-sm text-gray-500">
                    {calculateHours(formData.startTime, formData.endTime)} horas × L.{salones.find(s => s.nombre === formData.venue.salon)?.precioPorHora.toLocaleString()}/hora
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Personal */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Asignado</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <Label htmlFor="waiters">Número de Meseros</Label>
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
              </div>
            </CardContent>
          </Card>

          {/* Servicios */}
          <Card>
            <CardHeader>
              <CardTitle>Servicios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {services.map((service) => (
                  <div key={service} className="flex items-center space-x-2">
                    <Checkbox
                      id={service}
                      checked={formData.services.includes(service)}
                      onCheckedChange={() => handleServiceToggle(service)}
                    />
                    <Label htmlFor={service} className="text-sm font-normal">
                      {service}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Equipos */}
          <Card>
            <CardHeader>
              <CardTitle>Equipos y Tecnología</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {equipment.map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox
                      id={item}
                      checked={formData.equipment.includes(item)}
                      onCheckedChange={() => handleEquipmentToggle(item)}
                    />
                    <Label htmlFor={item} className="text-sm font-normal">
                      {item}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Información Legal */}
          <Card>
            <CardHeader>
              <CardTitle>Información Legal</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="contractSigned"
                  checked={formData.legal.contractSigned}
                  onCheckedChange={(checked) => setFormData(prev => ({
                    ...prev,
                    legal: { ...prev.legal, contractSigned: checked as boolean }
                  }))}
                />
                <Label htmlFor="contractSigned">Contrato Firmado</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="insurance"
                  checked={formData.legal.insurance}
                  onCheckedChange={(checked) => setFormData(prev => ({
                    ...prev,
                    legal: { ...prev.legal, insurance: checked as boolean }
                  }))}
                />
                <Label htmlFor="insurance">Seguro Contratado</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="permits"
                  checked={formData.legal.permits}
                  onCheckedChange={(checked) => setFormData(prev => ({
                    ...prev,
                    legal: { ...prev.legal, permits: checked as boolean }
                  }))}
                />
                <Label htmlFor="permits">Permisos Obtenidos</Label>
              </div>
            </CardContent>
          </Card>

          {/* Notas */}
          <Card>
            <CardHeader>
              <CardTitle>Notas Adicionales</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="specialNotes">Notas Especiales</Label>
                <Textarea
                  id="specialNotes"
                  value={formData.logistics.specialNotes}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    logistics: { ...prev.logistics, specialNotes: e.target.value }
                  }))}
                  placeholder="Cualquier información adicional relevante para el evento..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Botones de Acción */}
          <div className="flex justify-end gap-4">
            <Link href={`/events/${eventId}`}>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={loading}>
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
        </form>
      </div>
    </div>
  )
}
