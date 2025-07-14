import "./ModalConsulta.css";

export function ModalConsulta({ event, onClose }: any) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>📝 Detalhes da Consulta</h3>
        <p><strong>Paciente:</strong> {event.title}</p>
        <p><strong>Horário:</strong> {event.start} - {event.end}</p>
        <p><strong>Status:</strong> {event.status}</p>
        <p><strong>Tipo:</strong> {event.tipo}</p>

        <button className="view-button">Ver na página de consulta</button>
        <button className="close-button" onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
}
