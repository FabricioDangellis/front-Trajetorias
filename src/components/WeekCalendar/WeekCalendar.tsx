import { useEffect, useState } from "react";
import {
  format,
  addDays,
  startOfWeek,
  isToday,
  isSameDay,
} from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import "./WeekCalendar.css";

interface Appointment {
  id: number;
  date: string;
  timeStart: string;
  patient: string;
}

interface Patient {
  id: number;
  name: string;
  appointments?: {
    id: number;
    date: string;
    timeStart: string;
    timeEnd: string;
    status: string;
    type: string;
    note: string;
  }[];
}

export function WeekCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [consultationsByDay, setConsultationsByDay] = useState<Record<string, Appointment[]>>({});

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 }); // domingo
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const currentMonth = format(selectedDate, "MMMM", { locale: ptBR });
  const selectedKey = format(selectedDate, "yyyy-MM-dd");
  const list = consultationsByDay[selectedKey] || [];

  useEffect(() => {
    const stored = localStorage.getItem("pacientes") || "[]";
    const pacientes: Patient[] = JSON.parse(stored);
    const organized: Record<string, Appointment[]> = {};

    pacientes.forEach((p) => {
      (p.appointments || []).forEach((appt) => {
        const key = appt.date;
        if (!organized[key]) {
          organized[key] = [];
        }

        organized[key].push({
          id: appt.id,
          date: appt.date,
          timeStart: appt.timeStart,
          patient: p.name,
        });
      });
    });

    // Ordenar consultas por horário
    Object.keys(organized).forEach((date) => {
      organized[date].sort((a, b) => a.timeStart.localeCompare(b.timeStart));
    });

    setConsultationsByDay(organized);
  }, []);

  return (
    <div className="calendar-container">
      <div className="calendar-week">
        {weekDays.map((day) => (
          <button
            key={day.toISOString()}
            onClick={() => setSelectedDate(day)}
            className={`calendar-day 
              ${isToday(day) ? "calendar-today" : ""} 
              ${isSameDay(day, selectedDate) ? "calendar-selected" : ""}`}
          >
            <span className="calendar-weekday">{format(day, "EEEEE", { locale: ptBR })}</span>
            <span className="calendar-date">{format(day, "dd")}</span>
          </button>
        ))}
      </div>

      <div className="calendar-consultations">
        <h3>{currentMonth.toUpperCase()}, {format(selectedDate, "dd")}</h3>
        {list.length === 0 ? (
          <p>Nenhuma consulta agendada.</p>
        ) : (
          <ul>
            {list.map((c) => (
              <li key={c.id}>
                <strong>{c.timeStart}</strong> – {c.patient}
                <hr className="divisao" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
