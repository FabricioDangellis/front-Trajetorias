import { useState } from "react";
import { format, addDays, startOfWeek, isToday, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import "./WeekCalendar.css";

interface Consultation {
  id: number;
  patientName: string;
  time: string;
}

export function WeekCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 }); // domingo
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const currentMonth = format(selectedDate, "MMMM", { locale: ptBR });

  const consultations: Record<string, Consultation[]> = {
    [format(new Date(), "yyyy-MM-dd")]: [
      { id: 1, patientName: "Ana Souza", time: "09:00" },
      { id: 2, patientName: "Pedro Lima", time: "14:30" },
    ],
  };

  const selectedKey = format(selectedDate, "yyyy-MM-dd");
  const list = consultations[selectedKey] || [];

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
                <strong>{c.time}</strong> – {c.patientName}
                <hr className="divisao" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}