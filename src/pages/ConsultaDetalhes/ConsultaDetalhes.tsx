import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Sidebar } from "../../components/SideBar/SideBar";
import { IoTrashOutline, IoCreateOutline, IoCloseOutline } from "react-icons/io5";
import { CiCirclePlus } from "react-icons/ci";
import { Toast } from "../../components/Feedback/Toast";
import "./ConsultaDetalhes.css";

interface Appointment {
  id: number;
  date: string;
  timeStart: string;
  timeEnd: string;
  status: "Marcada" | "Cancelada" | "Finalizada";
  type: string;
  notes?: string;      // Observações do atendimento
  anotacao?: string;   // Anotações da sessão
  started?: boolean;
  finished?: boolean;
  duration?: number;
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
  const [notes, setNotes] = useState(""); // Anotação da sessão
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "">("");

  const [editForm, setEditForm] = useState({
    date: "",
    timeStart: "",
    timeEnd: "",
    type: "",
    status: "",
    note: ""
  });

  useEffect(() => {
    const stored = localStorage.getItem("pacientes") || "[]";
    const pacientes: Patient[] = JSON.parse(stored);
    let found: Appointment | null = null;
    for (const p of pacientes) {
      const appt = p.appointments?.find((a) => a.id === Number(id));
      if (appt) {
        found = appt;
        setPaciente(p);
        break;
      }
    }
    if (found) {
      setAppointment(found);
      setStarted(!!found.started);
      setFinished(!!found.finished);
      setTimer(found.duration || 0);
      setNotes(found.anotacao || ""); // agora pega anotação da sessão
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

    const updatedPacientes = pacientes.map((p) => {
      if (p.id === paciente.id) {
        const updatedAppointments = p.appointments.map((a) => {
          if (a.id === appointment.id) {
            return {
              ...a,
              ...updatedFields,
              status: updatedFields.finished ? "Finalizada" : updatedFields.status || a.status,
            };
          }
          return a;
        });
        return { ...p, appointments: updatedAppointments };
      }
      return p;
    });

    localStorage.setItem("pacientes", JSON.stringify(updatedPacientes));

    setAppointment((prev) =>
      prev
        ? {
            ...prev,
            ...updatedFields,
            status: updatedFields.finished ? "Finalizada" : updatedFields.status || prev.status,
          }
        : null
    );

    if (updatedFields.anotacao !== undefined) {
      setNotes(updatedFields.anotacao);
    }
  }

  function handleDelete() {
    if (!paciente || !appointment) return;
    const confirmDelete = window.confirm("Tem certeza que deseja excluir essa consulta?");
    if (!confirmDelete) return;

    const stored = localStorage.getItem("pacientes") || "[]";
    const pacientes: Patient[] = JSON.parse(stored);
    const updatedPacientes = pacientes.map((p) => {
      if (p.id === paciente.id) {
        const updatedAppointments = p.appointments.filter((a) => a.id !== appointment.id);
        return { ...p, appointments: updatedAppointments };
      }
      return p;
    });
    localStorage.setItem("pacientes", JSON.stringify(updatedPacientes));
    navigate("/atendimentos");
  }

  function handleNoteChange(value: string) {
    setNotes(value);
    handleUpdate({ anotacao: value });
  }

  function handleEditClick() {
    if (!appointment) return;
    setEditForm({
      date: appointment.date,
      timeStart: appointment.timeStart,
      timeEnd: appointment.timeEnd,
      type: appointment.type,
      status: appointment.status,
      note: appointment.notes || "", // apenas notes
    });
    setIsModalOpen(true);
  }

  function handleEditChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleUpdate({
      date: editForm.date,
      timeStart: editForm.timeStart,
      timeEnd: editForm.timeEnd,
      type: editForm.type,
      status: editForm.status as Appointment["status"],
      notes: editForm.note,
    });
    setIsModalOpen(false);
    setToastMessage("Atendimento editado com sucesso!");
    setToastType("success");
  }

  if (!appointment || !paciente) return <p>Consulta não encontrada.</p>;

  return (
    <div className="container consulta-detalhes">
      <Sidebar onLogout={() => { localStorage.removeItem("token"); navigate("/"); }} />

      <main className="contentConsultaDetelhes">
        <section className="mainSection">
          <div className="topo">
            <h2>Atendimento - {paciente.name}</h2>
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
                    <p>{appointment.timeStart} - {appointment.timeEnd}</p>

                    <p><strong>Tipo:</strong></p>
                    <p>{appointment.type}</p>

                    <p><strong>Status:</strong></p>
                    <p>{appointment.status}</p>

                    <p><strong>Observações:</strong></p>
                    <p>{appointment.notes || "Nenhuma observação cadastrada."}</p>
                  </div>
                </div>
              </div>

              <div className="temporisador">
                <p className="timer">
                  <strong>Tempo da Sessão:</strong> {formatTime(timer)}
                </p>
              </div>

              <div className="botoes-controle">
                <button
                  onClick={() => {
                    setStarted(true);
                    handleUpdate({ started: true });
                  }}
                  disabled={appointment.status === "Finalizada"}
                >
                  Iniciar
                </button>

                <button
                  onClick={() => {
                    setFinished(true);
                    handleUpdate({ finished: true, duration: timer });
                  }}
                  disabled={appointment.status === "Finalizada"}
                >
                  Finalizar
                </button>

                <button onClick={handleEditClick}><IoCreateOutline /> Editar</button>
                <button onClick={handleDelete} className="delete"><IoTrashOutline /> Excluir</button>
              </div>

              <div className="bloco-notas">
                <h3>Anotações da Sessão</h3>
                <textarea
                  value={notes}
                  onChange={(e) => handleNoteChange(e.target.value)}
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

      {isModalOpen && (
        <div className="modalOverlay">
          <div className="modalContent">
            <button className="closeButton" onClick={() => setIsModalOpen(false)}>
              <IoCloseOutline className="icone" />
            </button>
            <h2>Editar Atendimento</h2>
            <form onSubmit={handleEditSubmit} className="formAtendimento">
              <label>Data:</label>
              <input type="date" name="date" value={editForm.date} onChange={handleEditChange} required />

              <div className="horariosAtendimento">
                <div className="inicio">
                  <label>Horário Início:</label>
                  <input type="time" name="timeStart" value={editForm.timeStart} onChange={handleEditChange} required />
                </div>

                <div className="fim">
                  <label>Horário Fim:</label>
                  <input type="time" name="timeEnd" value={editForm.timeEnd} onChange={handleEditChange} required />
                </div>
              </div>

              <div className="tipoStatus">
                <div className="tiposListaAtendimento">
                  <label>Tipo:</label>
                  <select name="type" value={editForm.type} onChange={handleEditChange}>
                    <option value="Individual">Individual</option>
                    <option value="Familiar">Familiar</option>
                    <option value="Retorno">Retorno</option>
                  </select>
                </div>
                <div className="statusListaAtendimentos">
                  <label>Status:</label>
                  <select name="status" value={editForm.status} onChange={handleEditChange}>
                    <option value="Marcada">Marcada</option>
                    <option value="Finalizada">Finalizada</option>
                    <option value="Cancelada">Cancelada</option>
                  </select>
                </div>
              </div>

              <div className="observacoesAtendimento">
                <label>Observação:</label>
                <textarea name="note" value={editForm.note} onChange={handleEditChange} />
              </div>

              <button type="submit">Salvar Alterações</button>
            </form>
          </div>
        </div>
      )}

      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType as "success" | "error"}
          onClose={() => {
            setToastMessage("");
            setToastType("");
          }}
        />
      )}
    </div>
  );
}
