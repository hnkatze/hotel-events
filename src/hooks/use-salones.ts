"use client"

import { useState, useEffect } from "react"
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/contexts/auth-context"

export interface Salon {
  id?: string
  nombre: string
  capacidadPersonas: number
  precioPorHora: number
  tomasCorriente: number
  userId: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export function useSalones() {
  const { user } = useAuth()
  const [salones, setSalones] = useState<Salon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setSalones([])
      setLoading(false)
      return
    }

    const q = query(
      collection(db, "salones"),
      orderBy("nombre", "asc")
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const salonesData: Salon[] = []
        snapshot.forEach((doc) => {
          salonesData.push({
            id: doc.id,
            ...doc.data(),
          } as Salon)
        })
        setSalones(salonesData)
        setLoading(false)
        setError(null)
      },
      (error) => {
        console.error("Error fetching salones:", error)
        setError("Error al cargar los salones")
        setLoading(false)
      }
    )

    return unsubscribe
  }, [user])

  const addSalon = async (salonData: Omit<Salon, "id" | "userId" | "createdAt" | "updatedAt">) => {
    if (!user) {
      throw new Error("Usuario no autenticado")
    }

    try {
      const now = Timestamp.now()
      const docRef = await addDoc(collection(db, "salones"), {
        ...salonData,
        userId: user.uid,
        createdAt: now,
        updatedAt: now,
      })
      
      return docRef.id
    } catch (error) {
      console.error("Error adding salon:", error)
      throw new Error("Error al crear el salón")
    }
  }

  const updateSalon = async (id: string, salonData: Partial<Omit<Salon, "id" | "userId" | "createdAt">>) => {
    if (!user) {
      throw new Error("Usuario no autenticado")
    }

    try {
      const salonRef = doc(db, "salones", id)
      await updateDoc(salonRef, {
        ...salonData,
        updatedAt: Timestamp.now(),
      })
    } catch (error) {
      console.error("Error updating salon:", error)
      throw new Error("Error al actualizar el salón")
    }
  }

  const deleteSalon = async (id: string) => {
    if (!user) {
      throw new Error("Usuario no autenticado")
    }

    try {
      await deleteDoc(doc(db, "salones", id))
    } catch (error) {
      console.error("Error deleting salon:", error)
      throw new Error("Error al eliminar el salón")
    }
  }

  return {
    salones,
    loading,
    error,
    addSalon,
    updateSalon,
    deleteSalon,
  }
}
