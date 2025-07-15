"use client"

import { useState, useEffect } from "react"
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/contexts/auth-context"

export interface Event {
  id?: string
  userId: string
  name: string
  type: string
  date: string
  startTime: string
  endTime: string
  setupTime?: string
  teardownTime?: string
  status: "pending" | "confirmed" | "cancelled" | "finished"

  // Cliente (opcional)
  client?: {
    name?: string
    position?: string
    company?: string
    phone?: string
    email?: string
    specialRequirements?: string
  }

  // Venue
  venue: {
    salon: string
    capacity: number
    configuration: string
    attendeesMin?: number
    attendeesMax: number
    additionalAreas?: string[]
  }

  // Services
  services: string[]
  equipment: string[]

  // Staff
  staff: {
    coordinator?: string
    waiters?: number
    security?: number
    kitchenSupervisor?: string
  }

  // Logistics
  logistics: {
    externalProviders?: string
    specialNotes?: string
  }

  createdAt: Timestamp
  updatedAt: Timestamp
}

export function useEvents() {
  const { user } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setEvents([])
      setLoading(false)
      return
    }

    const eventsRef = collection(db, "events")
    const q = query(eventsRef, where("userId", "==", user.uid), orderBy("date", "asc"))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const eventsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Event[]

        setEvents(eventsData)
        setLoading(false)
        setError(null)
      },
      (error) => {
        console.error("Error fetching events:", error)
        setError("Error al cargar eventos")
        setLoading(false)
      },
    )

    return unsubscribe
  }, [user])

  const addEvent = async (eventData: Omit<Event, "id" | "userId" | "createdAt" | "updatedAt">) => {
    if (!user) throw new Error("Usuario no autenticado")

    try {
      const now = Timestamp.now()
      const docRef = await addDoc(collection(db, "events"), {
        ...eventData,
        userId: user.uid,
        createdAt: now,
        updatedAt: now,
      })
      return docRef.id
    } catch (error) {
      console.error("Error adding event:", error)
      throw new Error("Error al crear evento")
    }
  }

  const updateEvent = async (eventId: string, eventData: Partial<Event>) => {
    if (!user) throw new Error("Usuario no autenticado")

    try {
      const eventRef = doc(db, "events", eventId)
      await updateDoc(eventRef, {
        ...eventData,
        updatedAt: Timestamp.now(),
      })
    } catch (error) {
      console.error("Error updating event:", error)
      throw new Error("Error al actualizar evento")
    }
  }

  const deleteEvent = async (eventId: string) => {
    if (!user) throw new Error("Usuario no autenticado")

    try {
      await deleteDoc(doc(db, "events", eventId))
    } catch (error) {
      console.error("Error deleting event:", error)
      throw new Error("Error al eliminar evento")
    }
  }

  const getEventById = (eventId: string) => {
    return events.find((event) => event.id === eventId)
  }

  const getEventsByDate = (date: string) => {
    return events.filter((event) => event.date === date)
  }

  const getEventsBySalon = (salon: string) => {
    return events.filter((event) => event.venue.salon === salon)
  }

  const getEventsInDateRange = (startDate: string, endDate: string) => {
    return events.filter((event) => event.date >= startDate && event.date <= endDate)
  }

  return {
    events,
    loading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    getEventsByDate,
    getEventsBySalon,
    getEventsInDateRange,
  }
}
