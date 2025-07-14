import { useEffect, useState } from "react";
import "./AppointmentList.css";
import { IoCloseOutline } from "react-icons/io5";
import { NavLink } from "react-router-dom";

interface Appointment {
  id: number;
  patientId: number;
  patient: string;
  avatar: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  status: "Confirmado" | "Pendente" | "Cancelado";
  type: "Individual" | "Familiar" | "Retorno";
  note: string;
}

interface Patient {
  id: number;
  name: string;
  avatar: string;
  appointments?: Appointment[]; // <- ADICIONE ISSO
}


const tabs = ["Hoje", "Todos", "Confirmado", "Pendente", "Cancelado"];

export function AppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState("Hoje");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);

  // Formulário
  const [form, setForm] = useState({
    patientId: "",
    date: "",
    timeStart: "",
    timeEnd: "",
    note: "",
    type: "Individual",
    status: "Confirmado" as Appointment["status"],
  });

  useEffect(() => {
    const savedPatients = JSON.parse(localStorage.getItem("pacientes") || "[]");
    setPatients(savedPatients);

    const allAppointments = savedPatients.flatMap((p: any) =>
      (p.appointments || []).map((appt: any) => ({
        ...appt,
        patient: p.name,
        avatar: p.avatar,
        patientId: p.id,
      }))
    );

    setAppointments(allAppointments);
  }, [isModalOpen]);

  const today = new Date().toISOString().split("T")[0];

  const filteredAppointments = appointments.filter((a) => {
    if (activeTab === "Hoje") return a.date === today;
    if (activeTab === "Todos") return true;
    return a.status === activeTab;
  });

  function handleOpenModal() {
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setForm({
      patientId: "",
      date: "",
      timeStart: "",
      timeEnd: "",
      note: "",
      type: "Individual",
      status: "Confirmado",
    });
    setIsModalOpen(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const selectedPatient = patients.find((p) => p.id === Number(form.patientId));
    if (!selectedPatient) return;

    const newAppointment: Appointment = {
      id: Date.now(),
      patientId: selectedPatient.id,
      patient: selectedPatient.name,
      avatar: selectedPatient.avatar,
      date: form.date,
      timeStart: form.timeStart,
      timeEnd: form.timeEnd,
      note: form.note,
      type: form.type as Appointment["type"],
      status: form.status,
    };

    const updatedPatients = patients.map((p) => {
      if (p.id === selectedPatient.id) {
        return {
          ...p,
          appointments: [...(p.appointments || []), newAppointment],
        };
      }
      return p;
    });

    localStorage.setItem("pacientes", JSON.stringify(updatedPatients));
    setIsModalOpen(false);
  }

  return (
    <div className="listaAtendimentos">
      <div className="topoListagem">
        <div className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={tab === activeTab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <button onClick={handleOpenModal} className="btnCadastrarAtendimento">
          + Cadastrar Atendimento
        </button>
      </div>

      <div className="titulo">
        <div className="paciente">Paciente</div>
        <div className="horario">Horário</div>
        <div className="tipoAtendimento">Tipo</div>
        <div className="status">Status</div>
        <div className="visualizar"></div>
      </div>

      <div className="appointment-list">
        {filteredAppointments.length === 0 ? (
          <p className="empty-message">Nenhum atendimento encontrado.</p>
        ) : (
          filteredAppointments.map((a) => (
            <div key={a.id} className="appointment-item">
              <div className="paciente">
                <img src={a.avatar} alt={a.patient} />
                <strong>{a.patient}</strong>
              </div>
              <div className="horario">
                <span>{a.timeStart} - {a.timeEnd}</span>
              </div>
              <div className="tipoAtendimento">
                <p>{a.type}</p>
              </div>
              <div className="status">
                <span className={`statusAtendimento ${a.status.toLowerCase()}`}>
                  {a.status}
                </span>
              </div>
              <div className="visualizar">
                <NavLink className="details-button" to={`/atendimentos/atendimento/${a.id}`}>
                    <span>Visualisar Consulta</span>
                </NavLink>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="modalOverlay">
          <div className="modalContent">
            <button className="closeButton" onClick={handleCloseModal}>
              <IoCloseOutline size={24} />
            </button>

            <h2>Cadastrar Atendimento</h2>
            <form onSubmit={handleSubmit} className="formAtendimento">
              <label>Paciente:</label>
              <select name="patientId" value={form.patientId} onChange={handleChange} required>
                <option value="">Selecione</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>

              <label>Data:</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} required />

              <label>Horário Início:</label>
              <input type="time" name="timeStart" value={form.timeStart} onChange={handleChange} required />

              <label>Horário Fim:</label>
              <input type="time" name="timeEnd" value={form.timeEnd} onChange={handleChange} required />

              <label>Tipo:</label>
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="Individual">Individual</option>
                <option value="Familiar">Familiar</option>
                <option value="Retorno">Retorno</option>
              </select>

              <label>Observação:</label>
              <textarea name="note" value={form.note} onChange={handleChange} />

              <label>Status:</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="Confirmado">Confirmado</option>
                <option value="Pendente">Pendente</option>
                <option value="Cancelado">Cancelado</option>
              </select>

              <button type="submit">Salvar Atendimento</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
