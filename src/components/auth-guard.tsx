"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Hotel, Calendar, Users, Shield } from "lucide-react"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, signInWithGoogle } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <Hotel className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Sistema de Eventos</CardTitle>
            <p className="text-gray-600">My Grand Palace Hotel</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="font-semibold">Gestión Profesional de Eventos</h3>
              <p className="text-sm text-gray-600">Administra los salones de tu hotel de manera eficiente</p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <Calendar className="w-6 h-6 mx-auto text-blue-600" />
                <p className="text-xs text-gray-600">Calendario Visual</p>
              </div>
              <div className="space-y-2">
                <Users className="w-6 h-6 mx-auto text-green-600" />
                <p className="text-xs text-gray-600">Gestión Clientes</p>
              </div>
              <div className="space-y-2">
                <Shield className="w-6 h-6 mx-auto text-purple-600" />
                <p className="text-xs text-gray-600">Datos Seguros</p>
              </div>
            </div>

            <Button
              onClick={signInWithGoogle}
              className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continuar con Google
            </Button>

            <p className="text-xs text-gray-500 text-center">
              Al continuar, aceptas nuestros términos de servicio y política de privacidad
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
