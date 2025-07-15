"use client"

import { useState, useEffect, useCallback } from "react"
import { 
  doc,
  getDoc, 
  setDoc, 
  updateDoc,
  Timestamp 
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/contexts/auth-context"

export interface HotelConfig {
  id?: string
  nombreHotel: string
  userId: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export function useHotelConfig() {
  const [config, setConfig] = useState<HotelConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchConfig = useCallback(async () => {
    if (!user) return

    try {
      setLoading(true)
      const configDoc = await getDoc(doc(db, "hotelConfig", user.uid))
      
      if (configDoc.exists()) {
        setConfig({ id: configDoc.id, ...configDoc.data() } as HotelConfig)
      } else {
        // Crear configuración por defecto
        const defaultConfig: Omit<HotelConfig, "id"> = {
          nombreHotel: "Mi Hotel",
          userId: user.uid,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        }
        
        await setDoc(doc(db, "hotelConfig", user.uid), defaultConfig)
        setConfig({ id: user.uid, ...defaultConfig })
      }
    } catch (error) {
      console.error("Error fetching hotel config:", error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchConfig()
  }, [fetchConfig])

  const updateConfig = async (updates: Partial<Omit<HotelConfig, "id" | "userId" | "createdAt">>) => {
    if (!user || !config) throw new Error("Usuario no autenticado o configuración no encontrada")

    try {
      const updateData = {
        ...updates,
        updatedAt: Timestamp.now(),
      }

      await updateDoc(doc(db, "hotelConfig", user.uid), updateData)
      
      setConfig(prev => prev ? { ...prev, ...updateData } : null)
    } catch (error) {
      console.error("Error updating hotel config:", error)
      throw error
    }
  }

  return {
    config,
    loading,
    updateConfig,
    fetchConfig,
  }
}
