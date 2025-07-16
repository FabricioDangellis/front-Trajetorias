import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import "./CalendarComponent.css";
import { ModalConsulta } from "../ModalConsulta/ModalConsulta";

interface Appointment {
  id: number;
  date: string;          // formato: YYYY-MM-DD
  timeStart: string;     // formato: HH:mm
  timeEnd: string;       // formato: HH:mm
  status: "Marcada" | "Cancelada" |"Finalizada";
  type: string;
  notes?: string;
}

interface Patient {
  id: number;
  name: string;
  appointments: Appointment[];
}

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  className: string;
  extendedProps: {
    status: string;
    tipo: string;
  };
}

export function CalendarComponent() {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("pacientes");
    if (!stored) return;

    const pacientes: Patient[] = JSON.parse(stored);
    const calendarEvents: CalendarEvent[] = [];

    pacientes.forEach((p) => {
      p.appointments?.forEach((appt) => {
        calendarEvents.push({
          id: String(appt.id),
          title: p.name,
          start: `${appt.date}T${appt.timeStart}`,
          end: `${appt.date}T${appt.timeEnd}`,
          className: appt.status.toLowerCase(), // usado para cores no CSS
          extendedProps: {
            status: appt.status,
            tipo: appt.type,
          },
        });
      });
    });

    setEvents(calendarEvents);
  }, []);

  function handleEventClick(info: any) {
    setSelectedEvent({
      id: info.event.id,
      title: info.event.title,
      start: info.event.startStr,
      end: info.event.endStr,
      status: info.event.extendedProps.status,
      tipo: info.event.extendedProps.tipo,
    });
  }

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          start: "dayGridMonth,timeGridWeek,timeGridDay",
          center: "title",
          end: "prev,next",
        }}
        events={events}
        eventClick={handleEventClick}
        height="auto"
        locale="pt-br"
        slotMinTime="07:00:00"
        slotMaxTime="20:00:00"
      />

      {selectedEvent && (
        <ModalConsulta
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}
