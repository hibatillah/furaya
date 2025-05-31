"use client"

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { id } from "date-fns/locale"

interface DatePickerProps {
  value: Date
  onChange: (date: Date) => void
  className?: string
}

export function DatePicker(props: DatePickerProps) {
  const { value: date, onChange, className } = props

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon />
          {date ? format(date, "PPP", { locale: id }) : <span>Pilih tanggal</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(day) => onChange(day as Date)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
