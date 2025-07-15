"use client"

import { useState, useEffect, useCallback } from "react"
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  Timestamp 
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/contexts/auth-context"

export interface Personal {
  id?: string
  nombre: string
  telefono: string
  tipo: "coordinador" | "supervisor_cocina" | "mesero" | "seguridad"
  userId: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export function usePersonal() {
  const [personal, setPersonal] = useState<Personal[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchPersonal = useCallback(async () => {
    if (!user) return

    try {
      setLoading(true)
      const q = query(
        collection(db, "personal"),
        where("userId", "==", user.uid),
        orderBy("nombre", "asc")
      )
      
      const querySnapshot = await getDocs(q)
      const personalData: Personal[] = []
      
      querySnapshot.forEach((doc) => {
        personalData.push({ id: doc.id, ...doc.data() } as Personal)
      })
      
      setPersonal(personalData)
    } catch (error) {
      console.error("Error fetching personal:", error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchPersonal()
  }, [user, fetchPersonal])

  const addPersonal = async (personalData: Omit<Personal, "id" | "userId" | "createdAt" | "updatedAt">) => {
    if (!user) throw new Error("Usuario no autenticado")

    try {
      const newPersonal = {
        ...personalData,
        userId: user.uid,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      }

      const docRef = await addDoc(collection(db, "personal"), newPersonal)
      const personalWithId = { ...newPersonal, id: docRef.id }
      
      setPersonal(prev => [...prev, personalWithId])
      return personalWithId
    } catch (error) {
      console.error("Error adding personal:", error)
      throw error
    }
  }

  const updatePersonal = async (id: string, updates: Partial<Omit<Personal, "id" | "userId" | "createdAt">>) => {
    try {
      const updateData = {
        ...updates,
        updatedAt: Timestamp.now(),
      }

      await updateDoc(doc(db, "personal", id), updateData)
      
      setPersonal(prev => 
        prev.map(p => 
          p.id === id ? { ...p, ...updateData } : p
        )
      )
    } catch (error) {
      console.error("Error updating personal:", error)
      throw error
    }
  }

  const deletePersonal = async (id: string) => {
    try {
      await deleteDoc(doc(db, "personal", id))
      setPersonal(prev => prev.filter(p => p.id !== id))
    } catch (error) {
      console.error("Error deleting personal:", error)
      throw error
    }
  }

  // Helpers para obtener personal por tipo
  const getCoordinadores = () => personal.filter(p => p.tipo === "coordinador")
  const getSupervisoresCocina = () => personal.filter(p => p.tipo === "supervisor_cocina")
  const getMeseros = () => personal.filter(p => p.tipo === "mesero")
  const getSeguridad = () => personal.filter(p => p.tipo === "seguridad")
  
  // Helper para obtener personal por nombre
  const getPersonalByName = (nombre: string) => personal.find(p => p.nombre === nombre)

  return {
    personal,
    loading,
    addPersonal,
    updatePersonal,
    deletePersonal,
    fetchPersonal,
    getCoordinadores,
    getSupervisoresCocina,
    getMeseros,
    getSeguridad,
    getPersonalByName,
  }
}
