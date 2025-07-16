import { useNavigate, useParams } from "react-router-dom";
import "./PerfilPaciente.css";
import { Sidebar } from "../../components/SideBar/SideBar";
import { PatientCare } from "../../components/PatientCare/PatientCare";
import { CiCirclePlus, CiImport } from "react-icons/ci";
import { useEffect, useState } from "react";

interface Appointment {
  id: number;
  date: string;
  time: string;
  status: "Marcada" | "Cancelada" |"Finalizada";
  type: "Individual" | "Familiar" | "Retorno";
  timeStart: string;
  timeEnd: string;
}

interface Document {
  id: number;
  name: string;
  description: string;
  date: string;
}

interface Patient {
  id: number;
  name: string;
  status: "Ativo" | "Inativo";
  lastAppointment: string;
  avatar: string;
  guardianName: string;
  birthDate: string;
  aboutPatient: string;
  description: string;
  documents?: Document[]; // ✅ documentos opcionais
  appointments?: Appointment[]; // ✅ consultas opcionais
}

export default function PerfilPaciente() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [paciente, setPaciente] = useState<Patient | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [formDocumento, setFormDocumento] = useState({
    name: "",
    description: "",
    file: null as File | null,
  });

  useEffect(() => {
    const storedPatients: Patient[] = JSON.parse(localStorage.getItem("pacientes") || "[]");
    const found = storedPatients.find((p) => p.id === Number(id));
    if (found) {
      setPaciente(found);
    }
  }, [id]);

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  function handleSalvarDocumento(e: React.FormEvent) {
    e.preventDefault();
    if (!paciente) return;

    const novoDocumento: Document = {
      id: Date.now(),
      name: formDocumento.name,
      description: formDocumento.description,
      date: new Date().toLocaleDateString(),
    };

    const updatedPaciente = {
      ...paciente,
      documents: [...(paciente.documents || []), novoDocumento],
    };

    // Atualiza no localStorage
    const storedPatients: Patient[] = JSON.parse(localStorage.getItem("pacientes") || "[]");
    const updatedList = storedPatients.map((p) =>
      p.id === updatedPaciente.id ? updatedPaciente : p
    );

    localStorage.setItem("pacientes", JSON.stringify(updatedList));
    setPaciente(updatedPaciente);
    setShowModal(false);
    setFormDocumento({ name: "", description: "", file: null });
  }

  if (!paciente) {
    return (
      <div className="container perfilPaciente">
        <Sidebar onLogout={handleLogout} />
        <main className="content">
          <section className="mainSection">
            <div className="topo">
              <h2>Paciente não encontrado</h2>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="container perfilPaciente">
      <Sidebar onLogout={handleLogout} />
      <main className="content">
        <section className="mainSection">
          <div className="topo">
            <h2>Pacientes - Perfil Paciente</h2>
          </div>

          <div className="conteudo">
            <div className="principal">
              <div className="dadosPaciente">
                <div className="paciente">
                  <img src={paciente.avatar} alt={paciente.name} />
                  <h3>{paciente.name}</h3>
                </div>

                <div className="informesGerais">
                  <h3><strong>Informações Gerais</strong></h3>
                  <div className="grid-infos">
                    <p><strong>Nascimento:</strong></p>
                    <p>{paciente.birthDate}</p>

                    <p><strong>Responsável:</strong></p>
                    <p>{paciente.guardianName}</p>

                    <p><strong>Sobre:</strong></p>
                    <p>{paciente.aboutPatient}</p>

                    <p><strong>Descrição:</strong></p>
                    <p>{paciente.description}</p>
                  </div>
                </div>
              </div>

              <div className="listasQuadros">
                <div className="atendimentos">
                  <PatientCare appointments={paciente.appointments || []} />
                </div>
              </div>
            </div>

            <div className="documentos">
              <div className="cabecalhoDocumentos">
                <h3><strong>Documentos</strong></h3>
                <button className="adicionarDocumento" onClick={() => setShowModal(true)}>
                  <CiCirclePlus className="icone" />
                </button>
              </div>

              {paciente.documents && paciente.documents.length > 0 ? (
                <ul className="listaDocumentos">
                  {paciente.documents.map((doc) => (
                    <li key={doc.id} className="document-item">
                      <div className="info">
                        <p className="doc-name">{doc.name}</p>
                        <span className="doc-date">{doc.date}</span>
                        <p className="doc-description">{doc.description}</p>
                      </div>
                      <button className="downlod-button" disabled>
                        <CiImport className="icone" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="semDocumentos">Nenhum documento cadastrado ainda.</p>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* MODAL DOCUMENTO */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Adicionar Documento</h2>
            <form onSubmit={handleSalvarDocumento}>
              <input
                type="text"
                placeholder="Nome do documento"
                value={formDocumento.name}
                onChange={(e) => setFormDocumento({ ...formDocumento, name: e.target.value })}
                required
              />
              <textarea
                placeholder="Descrição do documento"
                value={formDocumento.description}
                onChange={(e) => setFormDocumento({ ...formDocumento, description: e.target.value })}
                required
              />
              <label>Upload do arquivo (desativado para testes)</label>
              <input
                type="file"
                accept=".pdf,.doc,.jpg,.png"
                disabled
                style={{ opacity: 0.5, cursor: "not-allowed" }}
              />

              <div className="botoesModal">
                <button type="submit">Salvar</button>
                <button type="button" onClick={() => setShowModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
