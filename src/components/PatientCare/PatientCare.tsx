import { useState } from "react";
import "./PatientCare.css";
import { format, parseISO } from "date-fns";

interface Appointment {
  id: number;
  date: string; // formato: YYYY-MM-DD
  status: "Marcada" | "Cancelada" |"Finalizada";
  type: "Individual" | "Familiar" | "Retorno";
  timeStart: string;
  timeEnd: string;
}

interface Props {
  appointments: Appointment[];
}

export function PatientCare({ appointments }: Props) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  const upcomingAppointments = appointments.filter(
    (appt) => appt.status === "Marcada"
  );

  const pastAppointments = appointments.filter(
    (appt) => appt.status !== "Marcada"
  );

  const appointmentsToShow =
    activeTab === "upcoming" ? upcomingAppointments : pastAppointments;

  return (
    <div className="patient-care">
      <div className="tabs">
        <button
          className={activeTab === "upcoming" ? "active" : ""}
          onClick={() => setActiveTab("upcoming")}
        >
          Próximas Consultas
        </button>
        <button
          className={activeTab === "past" ? "active" : ""}
          onClick={() => setActiveTab("past")}
        >
          Consultas Passadas
        </button>
      </div>

      <div className="appointment-list">
        {appointmentsToShow.length === 0 ? (
          <p>Nenhuma consulta registrada.</p>
        ) : (
          appointmentsToShow.map((appt) => (
            <div
              key={appt.id}
              className={`appointment-card ${appt.status.toLowerCase()}`}
            >
              <div>
                <strong>
                  {format(parseISO(appt.date), "dd/MM/yyyy")}
                </strong>{" "}
                das <strong>{appt.timeStart} </strong> às <strong>{appt.timeEnd}</strong>
              </div>
              <p>Tipo: {appt.type}</p>
              <span className={`tipo ${appt.status.toLowerCase()}`}>
                {appt.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
