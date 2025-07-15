"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft,
  Loader2,
  Phone,
  UserCheck,
  ChefHat,
  Shield,
  Coffee
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { usePersonal, type Personal } from "@/hooks/use-personal"
import UserMenu from "@/components/user-menu"
import MobileNav from "@/components/mobile-nav"

export default function PersonalPage() {
  const { personal, loading, addPersonal, updatePersonal, deletePersonal } = usePersonal()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingPersonal, setEditingPersonal] = useState<Personal | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    tipo: "" as Personal["tipo"] | "",
  })

  const resetForm = () => {
    setFormData({
      nombre: "",
      telefono: "",
      tipo: "",
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCreatePersonal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.tipo) return
    
    setIsSubmitting(true)

    try {
      await addPersonal({
        nombre: formData.nombre,
        telefono: formData.telefono,
        tipo: formData.tipo,
      })

      toast.success("Personal agregado exitosamente")
      setIsCreateOpen(false)
      resetForm()
    } catch (error) {
      toast.error("Error al agregar personal")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditPersonal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPersonal || !formData.tipo) return

    setIsSubmitting(true)

    try {
      await updatePersonal(editingPersonal.id!, {
        nombre: formData.nombre,
        telefono: formData.telefono,
        tipo: formData.tipo,
      })

      toast.success("Personal actualizado exitosamente")
      setIsEditOpen(false)
      setEditingPersonal(null)
      resetForm()
    } catch (error) {
      toast.error("Error al actualizar personal")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeletePersonal = async (id: string, nombre: string) => {
    try {
      await deletePersonal(id)
      toast.success(`${nombre} eliminado exitosamente`)
    } catch (error) {
      toast.error("Error al eliminar personal")
      console.error(error)
    }
  }

  const openEditDialog = (persona: Personal) => {
    setEditingPersonal(persona)
    setFormData({
      nombre: persona.nombre,
      telefono: persona.telefono,
      tipo: persona.tipo,
    })
    setIsEditOpen(true)
  }

  const getTipoIcon = (tipo: Personal["tipo"]) => {
    switch (tipo) {
      case "coordinador":
        return <UserCheck className="w-4 h-4 text-blue-600" />
      case "supervisor_cocina":
        return <ChefHat className="w-4 h-4 text-orange-600" />
      case "mesero":
        return <Coffee className="w-4 h-4 text-green-600" />
      case "seguridad":
        return <Shield className="w-4 h-4 text-red-600" />
    }
  }

  const getTipoLabel = (tipo: Personal["tipo"]) => {
    switch (tipo) {
      case "coordinador":
        return "Coordinador"
      case "supervisor_cocina":
        return "Supervisor de Cocina"
      case "mesero":
        return "Mesero"
      case "seguridad":
        return "Seguridad"
    }
  }

  const getTipoBadgeColor = (tipo: Personal["tipo"]) => {
    switch (tipo) {
      case "coordinador":
        return "bg-blue-100 text-blue-800"
      case "supervisor_cocina":
        return "bg-orange-100 text-orange-800"
      case "mesero":
        return "bg-green-100 text-green-800"
      case "seguridad":
        return "bg-red-100 text-red-800"
    }
  }

  const groupedPersonal = {
    coordinador: personal.filter(p => p.tipo === "coordinador"),
    supervisor_cocina: personal.filter(p => p.tipo === "supervisor_cocina"),
    mesero: personal.filter(p => p.tipo === "mesero"),
    seguridad: personal.filter(p => p.tipo === "seguridad"),
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando personal...</p>
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
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Gestión de Personal</h1>
                <p className="text-sm lg:text-base text-gray-600 hidden sm:block">Administra el personal del hotel</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Personal
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md mx-4">
                  <DialogHeader>
                    <DialogTitle>Agregar Nuevo Personal</DialogTitle>
                    <DialogDescription>
                      Completa los datos del nuevo miembro del personal.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreatePersonal} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre Completo *</Label>
                      <Input
                        id="nombre"
                        placeholder="Ej: Juan Carlos Pérez"
                        value={formData.nombre}
                        onChange={(e) => handleInputChange("nombre", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Número de Teléfono *</Label>
                      <Input
                        id="telefono"
                        placeholder="Ej: +504 9999-9999"
                        value={formData.telefono}
                        onChange={(e) => handleInputChange("telefono", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tipo">Tipo de Personal *</Label>
                      <Select value={formData.tipo} onValueChange={(value: Personal["tipo"]) => handleInputChange("tipo", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="coordinador">Coordinador</SelectItem>
                          <SelectItem value="supervisor_cocina">Supervisor de Cocina</SelectItem>
                          <SelectItem value="mesero">Mesero</SelectItem>
                          <SelectItem value="seguridad">Seguridad</SelectItem>
                        </SelectContent>
                      </Select>
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
                      <Button type="submit" disabled={isSubmitting || !formData.tipo}>
                        {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Agregar Personal
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
        {personal.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay personal registrado</h3>
              <p className="text-gray-600 mb-4">Comienza agregando el primer miembro del personal</p>
              <Button 
                onClick={() => setIsCreateOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Primer Personal
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedPersonal).map(([tipo, personas]) => (
              personas.length > 0 && (
                <div key={tipo}>
                  <div className="flex items-center gap-3 mb-4">
                    {getTipoIcon(tipo as Personal["tipo"])}
                    <h2 className="text-xl font-semibold text-gray-900">
                      {getTipoLabel(tipo as Personal["tipo"])} ({personas.length})
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {personas.map((persona) => (
                      <Card key={persona.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{persona.nombre}</CardTitle>
                              <CardDescription className="flex items-center gap-1 mt-1">
                                <Phone className="w-3 h-3" />
                                {persona.telefono}
                              </CardDescription>
                            </div>
                            <Badge className={getTipoBadgeColor(persona.tipo)}>
                              {getTipoLabel(persona.tipo)}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(persona)}
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
                                  <AlertDialogTitle>¿Eliminar personal?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción eliminará permanentemente a &quot;{persona.nombre}&quot; del registro de personal.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeletePersonal(persona.id!, persona.nombre)}
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
                </div>
              )
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Personal</DialogTitle>
              <DialogDescription>
                Modifica los datos del personal.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditPersonal} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-nombre">Nombre Completo *</Label>
                <Input
                  id="edit-nombre"
                  placeholder="Ej: Juan Carlos Pérez"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange("nombre", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-telefono">Número de Teléfono *</Label>
                <Input
                  id="edit-telefono"
                  placeholder="Ej: +504 9999-9999"
                  value={formData.telefono}
                  onChange={(e) => handleInputChange("telefono", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-tipo">Tipo de Personal *</Label>
                <Select value={formData.tipo} onValueChange={(value: Personal["tipo"]) => handleInputChange("tipo", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="coordinador">Coordinador</SelectItem>
                    <SelectItem value="supervisor_cocina">Supervisor de Cocina</SelectItem>
                    <SelectItem value="mesero">Mesero</SelectItem>
                    <SelectItem value="seguridad">Seguridad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditOpen(false)
                    setEditingPersonal(null)
                    resetForm()
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting || !formData.tipo}>
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
