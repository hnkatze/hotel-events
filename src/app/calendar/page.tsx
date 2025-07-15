"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDays, ChevronLeft, ChevronRight, Plus, ArrowLeft, MapPin, Users, Clock, Filter } from "lucide-react"
import Link from "next/link"
import { useEvents } from "@/hooks/use-events"
import { useSalones } from "@/hooks/use-salones"
import UserMenu from "@/components/user-menu"
import MobileNav from "@/components/mobile-nav"

const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
      return "border-l-green-500"
    case "pending":
      return "border-l-yellow-500"
    case "cancelled":
      return "border-l-red-500"
    default:
      return "border-l-gray-500"
  }
}

const getEventTypeColor = (type: string) => {
  switch (type) {
    case "Reunión Corporativa":
      return "bg-blue-100 text-blue-800"
    case "Boda":
      return "bg-pink-100 text-pink-800"
    case "Congreso":
      return "bg-green-100 text-green-800"
    case "Coctel":
      return "bg-purple-100 text-purple-800"
    case "Conferencia":
      return "bg-orange-100 text-orange-800"
    case "Seminario":
      return "bg-teal-100 text-teal-800"
    case "Celebración":
      return "bg-rose-100 text-rose-800"
    case "Lanzamiento de Producto":
      return "bg-indigo-100 text-indigo-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getSalonColor = (salonName: string) => {
  // Generar colores consistentes basados en el nombre del salón
  const colors = [
    "bg-blue-500",
    "bg-purple-500", 
    "bg-green-500",
    "bg-red-500",
    "bg-indigo-500",
    "bg-yellow-500",
    "bg-pink-500",
    "bg-teal-500"
  ]
  
  let hash = 0
  for (let i = 0; i < salonName.length; i++) {
    hash = salonName.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return colors[Math.abs(hash) % colors.length]
}

export default function CalendarView() {
  const { events, loading } = useEvents()
  const { salones } = useSalones()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedSalon, setSelectedSalon] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedEvent, setSelectedEvent] = useState<typeof events[0] | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Hook para detectar mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ]

  const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

  // Filtrar eventos
  const filteredEvents = events.filter((event) => {
    const salonMatch = selectedSalon === "all" || event.venue.salon === selectedSalon
    const typeMatch = selectedType === "all" || event.type === selectedType
    return salonMatch && typeMatch
  })

  // Obtener eventos únicos por tipo para el filtro
  const uniqueEventTypes = [...new Set(events.map(event => event.type))]

  // Funciones del calendario
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return filteredEvents.filter((event) => event.date === dateStr)
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      today.getDate() === day &&
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear()
    )
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const calendarDays = []

  // Días del mes anterior (para completar la primera semana)
  for (let i = firstDay - 1; i >= 0; i--) {
    const prevMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0)
    calendarDays.push({ day: prevMonthDate.getDate() - i, isCurrentMonth: false })
  }

  // Días del mes actual
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({ day, isCurrentMonth: true })
  }

  // Días del próximo mes (para completar la última semana)
  const remainingDays = 42 - calendarDays.length
  for (let day = 1; day <= remainingDays; day++) {
    calendarDays.push({ day, isCurrentMonth: false })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <CalendarDays className="w-8 h-8 animate-pulse mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Cargando calendario...</p>
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
            <div className="flex items-center gap-4">
              <MobileNav />
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Volver al Dashboard</span>
                  <span className="sm:hidden">Volver</span>
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Calendario de Eventos</h1>
                <p className="text-sm lg:text-base text-gray-600 hidden sm:block">Vista general de todos los eventos programados</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/events/new">
                <Button className="bg-blue-600 hover:bg-blue-700">
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Sidebar con filtros y estadísticas */}
          <div className="lg:col-span-1 space-y-4 lg:space-y-6">
            {/* Filtros */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Filter className="w-5 h-5" />
                  Filtros
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Salón</label>
                  <Select value={selectedSalon} onValueChange={setSelectedSalon}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los salones</SelectItem>
                      {salones.map((salon) => (
                        <SelectItem key={salon.nombre} value={salon.nombre}>
                          {salon.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Tipo de Evento</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los tipos</SelectItem>
                      {uniqueEventTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Estadísticas del mes */}
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas del Mes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total eventos:</span>
                  <span className="font-semibold">{filteredEvents.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Confirmados:</span>
                  <span className="font-semibold text-green-600">
                    {filteredEvents.filter(e => e.status === "confirmed").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Pendientes:</span>
                  <span className="font-semibold text-yellow-600">
                    {filteredEvents.filter(e => e.status === "pending").length}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Leyenda de salones */}
            {salones.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Salones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {salones.map((salon) => (
                    <div key={salon.nombre} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getSalonColor(salon.nombre)}`}></div>
                      <span className="text-sm">{salon.nombre}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Calendario principal */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={prevMonth}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={nextMonth}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Encabezados de días */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="p-1 lg:p-2 text-center text-xs lg:text-sm font-medium text-gray-500">
                      <span className="hidden sm:inline">{day}</span>
                      <span className="sm:hidden">{day.charAt(0)}</span>
                    </div>
                  ))}
                </div>

                {/* Días del calendario */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((dateObj, index) => {
                    const { day, isCurrentMonth } = dateObj
                    const dayEvents = isCurrentMonth ? getEventsForDate(day) : []
                    
                    return (
                      <div
                        key={index}
                        className={`min-h-[60px] sm:min-h-[80px] lg:min-h-[100px] p-1 border rounded-lg ${
                          isCurrentMonth ? "bg-white" : "bg-gray-50"
                        } ${isCurrentMonth && isToday(day) ? "ring-2 ring-blue-500 bg-blue-50" : ""}`}
                      >
                        <div className={`font-medium text-xs lg:text-sm mb-1 ${
                          isCurrentMonth ? (isToday(day) ? "text-blue-600" : "text-gray-900") : "text-gray-400"
                        }`}>
                          {day}
                        </div>
                        
                        {isCurrentMonth && (
                          <div className="space-y-1">
                            {dayEvents.slice(0, isMobile ? 1 : 2).map((event) => (
                              <div
                                key={event.id}
                                className={`p-1 rounded text-xs cursor-pointer hover:opacity-80 border-l-2 ${getStatusColor(event.status)}`}
                                style={{ backgroundColor: `${getSalonColor(event.venue.salon)}20` }}
                                onClick={() => setSelectedEvent(event)}
                              >
                                <div className="font-medium truncate">{event.name}</div>
                                <div className="text-gray-600 truncate hidden sm:block">{event.startTime} - {event.venue.salon}</div>
                                <div className="text-gray-600 truncate sm:hidden">{event.startTime}</div>
                              </div>
                            ))}
                            {dayEvents.length > (isMobile ? 1 : 2) && (
                              <div className="text-xs text-gray-500 pl-1">
                                +{dayEvents.length - (isMobile ? 1 : 2)} más
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modal de evento seleccionado */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-lg">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{selectedEvent.name}</CardTitle>
                    <Badge className={getEventTypeColor(selectedEvent.type)}>
                      {selectedEvent.type}
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedEvent(null)}
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{selectedEvent.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{selectedEvent.startTime} - {selectedEvent.endTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{selectedEvent.venue.salon}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{selectedEvent.venue.attendeesMax} personas</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex gap-2">
                    <Link href={`/events/${selectedEvent.id}`}>
                      <Button size="sm">Ver Detalles</Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={() => setSelectedEvent(null)}>
                      Cerrar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}