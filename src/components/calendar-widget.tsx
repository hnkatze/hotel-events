"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react"
import Link from "next/link"

interface Event {
  id: number
  name: string
  date: string
  salon: string
  status: string
}

interface CalendarWidgetProps {
  events?: Event[]
  compact?: boolean
}

export default function CalendarWidget({ events = [], compact = false }: CalendarWidgetProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  const dayNames = compact ? ["D", "L", "M", "M", "J", "V", "S"] : ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const getEventsForDay = (day: number) => {
    if (!day) return []
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return events.filter((event) => event.date === dateStr)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const days = getDaysInMonth(currentDate)
  const today = new Date()
  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            {compact ? "Calendario" : "Vista Rápida"}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigateMonth("prev")}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium min-w-[100px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <Button variant="ghost" size="sm" onClick={() => navigateMonth("next")}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Calendar Header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="p-1 text-center text-xs font-medium text-gray-600">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const dayEvents = getEventsForDay(day || 0)
            return (
              <div
                key={index}
                className={`${compact ? "min-h-[30px]" : "min-h-[40px]"} p-1 text-center text-xs border rounded ${
                  day ? "bg-white hover:bg-gray-50" : "bg-gray-50"
                } ${isToday(day || 0) ? "ring-1 ring-blue-500 bg-blue-50" : ""}`}
              >
                {day && (
                  <>
                    <div className={`font-medium ${isToday(day) ? "text-blue-600" : "text-gray-900"}`}>{day}</div>
                    {dayEvents.length > 0 && (
                      <div className="flex justify-center">
                        <div
                          className={`w-1 h-1 rounded-full ${
                            dayEvents.some((e) => e.status === "confirmed") ? "bg-green-500" : "bg-yellow-500"
                          }`}
                        ></div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>

        {!compact && (
          <div className="mt-4 pt-3 border-t">
            <Link href="/calendar">
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                Ver Calendario Completo
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
