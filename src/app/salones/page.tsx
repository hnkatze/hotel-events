"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { 
  MapPin, 
  Users, 
  DollarSign, 
  Zap, 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft,
  Loader2 
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useSalones, type Salon } from "@/hooks/use-salones"
import UserMenu from "@/components/user-menu"
import MobileNav from "@/components/mobile-nav"

export default function SalonesPage() {
  const { salones, loading, addSalon, updateSalon, deleteSalon } = useSalones()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingSalon, setEditingSalon] = useState<Salon | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    nombre: "",
    capacidadPersonas: "",
    precioPorHora: "",
    tomasCorriente: "",
  })

  const resetForm = () => {
    setFormData({
      nombre: "",
      capacidadPersonas: "",
      precioPorHora: "",
      tomasCorriente: "",
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCreateSalon = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await addSalon({
        nombre: formData.nombre,
        capacidadPersonas: parseInt(formData.capacidadPersonas),
        precioPorHora: parseFloat(formData.precioPorHora),
        tomasCorriente: parseInt(formData.tomasCorriente),
      })

      toast.success("Salón creado exitosamente")
      setIsCreateOpen(false)
      resetForm()
    } catch (error) {
      toast.error("Error al crear el salón")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditSalon = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingSalon) return

    setIsSubmitting(true)

    try {
      await updateSalon(editingSalon.id!, {
        nombre: formData.nombre,
        capacidadPersonas: parseInt(formData.capacidadPersonas),
        precioPorHora: parseFloat(formData.precioPorHora),
        tomasCorriente: parseInt(formData.tomasCorriente),
      })

      toast.success("Salón actualizado exitosamente")
      setIsEditOpen(false)
      setEditingSalon(null)
      resetForm()
    } catch (error) {
      toast.error("Error al actualizar el salón")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteSalon = async (id: string, nombre: string) => {
    try {
      await deleteSalon(id)
      toast.success(`Salón "${nombre}" eliminado exitosamente`)
    } catch (error) {
      toast.error("Error al eliminar el salón")
      console.error(error)
    }
  }

  const openEditDialog = (salon: Salon) => {
    setEditingSalon(salon)
    setFormData({
      nombre: salon.nombre,
      capacidadPersonas: salon.capacidadPersonas.toString(),
      precioPorHora: salon.precioPorHora.toString(),
      tomasCorriente: salon.tomasCorriente.toString(),
    })
    setIsEditOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando salones...</p>
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
              <div className="hidden lg:block">
                <Link href="/">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver al Dashboard
                  </Button>
                </Link>
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Gestión de Salones</h1>
                <p className="text-sm lg:text-base text-gray-600 hidden sm:block">Administra los salones del hotel</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Salón
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md mx-4">
                  <DialogHeader>
                    <DialogTitle>Crear Nuevo Salón</DialogTitle>
                    <DialogDescription>
                      Completa los datos del nuevo salón del hotel.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateSalon} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre del Salón *</Label>
                      <Input
                        id="nombre"
                        placeholder="Ej: Salón Diamante"
                        value={formData.nombre}
                        onChange={(e) => handleInputChange("nombre", e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="capacidad">Capacidad (personas) *</Label>
                        <Input
                          id="capacidad"
                          type="number"
                          placeholder="120"
                          value={formData.capacidadPersonas}
                          onChange={(e) => handleInputChange("capacidadPersonas", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="precio">Precio/Hora *</Label>
                        <Input
                          id="precio"
                          type="number"
                          step="0.01"
                          placeholder="15000"
                          value={formData.precioPorHora}
                          onChange={(e) => handleInputChange("precioPorHora", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tomas">Tomas de Corriente *</Label>
                      <Input
                        id="tomas"
                        type="number"
                        placeholder="8"
                        value={formData.tomasCorriente}
                        onChange={(e) => handleInputChange("tomasCorriente", e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsCreateOpen(false)
                          resetForm()
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Crear Salón
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {salones.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MapPin className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay salones registrados</h3>
              <p className="text-gray-600 mb-4">Comienza agregando el primer salón del hotel</p>
              <Button 
                onClick={() => setIsCreateOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear Primer Salón
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {salones.map((salon) => (
              <Card key={salon.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{salon.nombre}</CardTitle>
                      <CardDescription>Salón de eventos</CardDescription>
                    </div>
                    <Badge variant="secondary">
                      L.{salon.precioPorHora.toLocaleString()}/hora
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">{salon.capacidadPersonas} personas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm">{salon.tomasCorriente} tomas</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">
                      L.{salon.precioPorHora.toLocaleString()} por hora
                    </span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(salon)}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar salón?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción eliminará permanentemente el salón &quot;{salon.nombre}&quot;. 
                            Los eventos que usan este salón no se verán afectados.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteSalon(salon.id!, salon.nombre)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Salón</DialogTitle>
              <DialogDescription>
                Modifica los datos del salón.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditSalon} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-nombre">Nombre del Salón *</Label>
                <Input
                  id="edit-nombre"
                  placeholder="Ej: Salón Diamante"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange("nombre", e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-capacidad">Capacidad (personas) *</Label>
                  <Input
                    id="edit-capacidad"
                    type="number"
                    placeholder="120"
                    value={formData.capacidadPersonas}
                    onChange={(e) => handleInputChange("capacidadPersonas", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-precio">Precio/Hora *</Label>
                  <Input
                    id="edit-precio"
                    type="number"
                    step="0.01"
                    placeholder="15000"
                    value={formData.precioPorHora}
                    onChange={(e) => handleInputChange("precioPorHora", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-tomas">Tomas de Corriente *</Label>
                <Input
                  id="edit-tomas"
                  type="number"
                  placeholder="8"
                  value={formData.tomasCorriente}
                  onChange={(e) => handleInputChange("tomasCorriente", e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditOpen(false)
                    setEditingSalon(null)
                    resetForm()
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Guardar Cambios
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
