import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Sidebar } from "../../components/SideBar/SideBar";
import { IoTrashOutline, IoCreateOutline } from "react-icons/io5";
import { CiCirclePlus, CiImport } from "react-icons/ci";
import "./ConsultaDetalhes.css";

interface Appointment {
  id: number;
  date: string;
  timeStart: string;
  timeEnd: string;
  status: "Confirmada" | "Cancelada" | "Pendente";
  type: string;
  notes?: string;
  started?: boolean;
  finished?: boolean;
}

interface Patient {
  id: number;
  name: string;
  avatar?: string;
  appointments: Appointment[];
}

export default function ConsultaDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [paciente, setPaciente] = useState<Patient | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState("");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("pacientes") || "[]";
    const pacientes: Patient[] = JSON.parse(stored);
    let found: Appointment | null = null;
    for (const p of pacientes) {
      const appt = (p.appointments || []).find((a: Appointment) => a.id === Number(id));
      if (appt) {
        found = appt;
        setPaciente(p);
        break;
      }
    }
    if (found) {
      setAppointment(found);
      setNotes(found.notes || "");
      setStarted(!!found.started);
      setFinished(!!found.finished);
    }
  }, [id]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (started && !finished) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [started, finished]);

  function formatTime(seconds: number) {
    const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  }

  function handleUpdate(updatedFields: Partial<Appointment>) {
    if (!paciente || !appointment) return;

    const stored = localStorage.getItem("pacientes") || "[]";
    const pacientes: Patient[] = JSON.parse(stored);
    const updatedPacientes = pacientes.map((p: Patient) => {
      if (p.id === paciente.id) {
        const updatedAppointments = p.appointments.map((a: Appointment) =>
          a.id === appointment.id ? { ...a, ...updatedFields } : a
        );
        return { ...p, appointments: updatedAppointments };
      }
      return p;
    });
    localStorage.setItem("pacientes", JSON.stringify(updatedPacientes));
    setAppointment({ ...appointment, ...updatedFields });
  }

  function handleDelete() {
    if (!paciente || !appointment) return;
    const confirmDelete = window.confirm("Tem certeza que deseja excluir essa consulta?");
    if (!confirmDelete) return;

    const stored = localStorage.getItem("pacientes") || "[]";
    const pacientes: Patient[] = JSON.parse(stored);
    const updatedPacientes = pacientes.map((p: Patient) => {
      if (p.id === paciente.id) {
        const updatedAppointments = p.appointments.filter((a: Appointment) => a.id !== appointment.id);
        return { ...p, appointments: updatedAppointments };
      }
      return p;
    });
    localStorage.setItem("pacientes", JSON.stringify(updatedPacientes));
    navigate("/atendimentos");
  }

  if (!appointment || !paciente) return <p>Consulta não encontrada.</p>;

  return (
    <div className="container consulta-detalhes">
      <Sidebar onLogout={() => { localStorage.removeItem("token"); navigate("/login"); }} />

      <main className="content">
        <section className="mainSection">
          <div className="topo">
            <h2> Atendimento - {paciente.name}</h2>
          </div>

          <div className="conteudo">
            <div className="principal">
              <div className="dadosConsulta">
                <div className="paciente">
                  <img
                    className="avatarPaciente"
                    src={paciente.avatar || "/default-avatar.png"}
                    alt={paciente.name}
                  />
                  <h3>{paciente.name}</h3>
                </div>

                <div className="informesGerais">
                  <h3>Dados do Atendimento</h3>
                  <div className="grid-infos">
                    <p><strong>Data:</strong></p>
                    <p>{appointment.date}</p>

                    <p><strong>Horário:</strong></p>
                    <p> {appointment.timeStart} - {appointment.timeEnd}</p>

                    <p><strong>Tipo:</strong></p>
                    <p>{appointment.type}</p>

                    <p><strong>Status:</strong></p>
                    <p>{appointment.status}</p>

                    <p><strong>Observações:</strong></p>
                    <p>{appointment.notes}</p>
                  </div>
                </div>
              </div>


              <div className="temporisador">
                <p className="timer">
                  <strong>Tempo da Sessão:</strong> {formatTime(timer)}
                </p>
              </div>

              <div className="botoes-controle">
                <button onClick={() => { setStarted(true); handleUpdate({ started: true }); }}>Iniciar</button>
                <button onClick={() => { setFinished(true); handleUpdate({ finished: true }); }}>Finalizar</button>
                <button onClick={() => setIsEditing(true)}><IoCreateOutline /> Editar</button>
                <button onClick={handleDelete} className="delete"><IoTrashOutline /> Excluir</button>
              </div>

              <div className="bloco-notas">
                <h3>Anotações da Sessão</h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  onBlur={() => handleUpdate({ notes })}
                  placeholder="Escreva observações sobre a sessão..."
                />
              </div>
            </div>

            <div className="documentos">
              <div className="cabecalhoDocumentos">
                <h3>Documentos</h3>
                <button className="adicionarDocumento" disabled>
                  <CiCirclePlus className="icone" />
                </button>
              </div>
              <ul className="listaDocumentos">
                <li className="document-item disabled">
                  <div className="info">
                    <p>Nenhum documento disponível.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
