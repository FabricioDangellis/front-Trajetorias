import { useState } from "react";
import "./PatientCare.css";
import { format, isBefore } from "date-fns";

interface Appointment {
  id: number;
  date: string; // formato: YYYY-MM-DD
  time: string;
  status: "Confirmada" | "Cancelada" | "Pendente";
  type: "Individual" | "Familiar" | "Retorno";
}

interface Props {
  appointments: Appointment[];
}

export function PatientCare({ appointments }: Props) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  const today = new Date();

  const upcomingAppointments = appointments.filter((appt) => {
    const apptDate = new Date(`${appt.date}T${appt.time}`);
    return !isBefore(apptDate, today);
  });

  const pastAppointments = appointments.filter((appt) => {
    const apptDate = new Date(`${appt.date}T${appt.time}`);
    return isBefore(apptDate, today);
  });

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
            <div key={appt.id} className={`appointment-card ${appt.status.toLowerCase()}`}>
              <div>
                <strong>{format(new Date(appt.date), "dd/MM/yyyy")}</strong> às <strong>{appt.time}</strong>
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
