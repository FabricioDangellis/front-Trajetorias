import { IoCloseOutline } from "react-icons/io5";
import "./ModalConsulta.css";
import { useNavigate } from "react-router-dom";

interface ModalConsultaProps {
  event: any;
  onClose: () => void;
}

export function ModalConsulta({ event, onClose }: ModalConsultaProps) {
  const navigate = useNavigate();

  function handleViewDetails() {
    navigate(`/atendimentos/atendimento/${event.id}`);
  }

  function formatHorario(startStr: string, endStr: string) {
    const start = new Date(startStr);
    const end = new Date(endStr);

    const data = start.toLocaleDateString("pt-BR"); // 15/07/2025
    const horaInicio = start.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }); // 14:00
    const horaFim = end.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });     // 15:00

    return `${data} das ${horaInicio} às ${horaFim}`;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Detalhes da Consulta</h2>
        <p><strong>Paciente:</strong> {event.title}</p>
        <p><strong>Horário:</strong> {formatHorario(event.start, event.end)}</p>
        <p><strong>Status:</strong> {event.status}</p>
        <p><strong>Tipo:</strong> {event.tipo}</p>

        <button className="view-button" onClick={handleViewDetails}>
          Ver na página de consulta
        </button>
        <button className="closeButton" onClick={onClose}>
          <IoCloseOutline className="icone"/>
        </button>
      </div>
    </div>
  );
}
