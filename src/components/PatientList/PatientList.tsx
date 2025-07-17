import { useEffect, useState } from "react";
import "./PatientList.css";

import { IoCloseOutline } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import avatarPlaceholder from "../../assets/padrao.jpg"; // um avatar padrão local
import { TextInput } from "../Input/TextInputProps";
import { Toast } from "../Feedback/Toast";


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
}

export function PatientList() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "">("");

  const [formData, setFormData] = useState<{
    name: string;
    status: "Ativo" | "Inativo";
    lastAppointment: string;
    avatar: string;
    guardianName: string;
    birthDate: string;
    aboutPatient: string;
    description: string;
  }>({
    name: "",
    status: "Ativo",
    lastAppointment: "",
    avatar: "",
    guardianName: "",
    birthDate: "",
    aboutPatient: "",
    description: "",
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("pacientes") || "[]");
    setPatients(stored);
  }, []);

  function savePatients(newList: Patient[]) {
    localStorage.setItem("pacientes", JSON.stringify(newList));
    setPatients(newList);
  }

  function handleCadastrarPaciente(e: React.FormEvent) {
    e.preventDefault();

    try {
      const novoPaciente: Patient = {
        ...formData,
        id: Date.now(),
        avatar: formData.avatar || avatarPlaceholder,
      };

      const atualizado = [...patients, novoPaciente];
      savePatients(atualizado);
      setShowModal(false);
      setFormData({
        name: "",
        status: "Ativo",
        lastAppointment: "",
        avatar: "",
        guardianName: "",
        birthDate: "",
        aboutPatient: "",
        description: "",
      });

      setToastMessage("Paciente cadastrado com sucesso!");
      setToastType("success");
    } catch (error) {
      setToastMessage("Erro ao cadastrar paciente.");
      setToastType("error");
    }
  }


  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="patients-container">
      <div className="menuLista">
        <input
          type="text"
          placeholder="Buscar paciente"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button onClick={() => setShowModal(true)}>Cadastrar Paciente</button>
      </div>

      <div className="corpoLista">
        <div className="patient-list">
          <div className="titulo">
            <div className="nome">Paciente</div>
            <div className="status">Status</div>
            <div className="ultimaSessao">Último Atendimento</div>
          </div>

          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className={`patient-item ${selectedPatient?.id === patient.id ? "selected" : ""}`}
              onClick={() => setSelectedPatient(patient)}
            >
              <div className="nome">
                <img src={patient.avatar} alt={patient.name} />
                <h4>{patient.name}</h4>
              </div>
              <div className="status">
                <p>{patient.status}</p>
              </div>
              <div className="ultimaSessao">
                <p>{patient.lastAppointment || "Sem registro"}</p>
              </div>
            </div>
          ))}
        </div>

        {selectedPatient && (
          <div className="patient-detail">
            <button
              className="close-button"
              onClick={() => setSelectedPatient(null)}
            >
              <IoCloseOutline className="icone" />
            </button>

            <img src={selectedPatient.avatar} />
            <h2>{selectedPatient.name}</h2>
            <p>{selectedPatient.birthDate}</p>
            <p>{selectedPatient.guardianName}</p>
            <p className="sobrePaciente">
              <strong>Sobre {selectedPatient.name}:</strong> {selectedPatient.aboutPatient}
            </p>
            <p className="descricaoPaciente">
              <strong>Informes: </strong>{selectedPatient.description}
            </p>
            <NavLink className="botaoExibir" to={`/pacientes/perfilPacientes/${selectedPatient.id}`}>
              <strong>Exibir Paciente</strong>
            </NavLink>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Novo Paciente</h2>
            <button className="fecharCadastro" type="button" onClick={() => setShowModal(false)}>
              <IoCloseOutline className="iconeClose" />
            </button>
            <form onSubmit={handleCadastrarPaciente}>
              <div className="pacienteResponsavel">
                <div className="paciente">
                  <h4>Paciente</h4>
                  <TextInput
                    type="text"
                    placeholder="Nome do paciente"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="responsavel">
                  <h4>Responsável</h4>
                  <TextInput
                    type="text"
                    placeholder="Nome do responsável"
                    value={formData.guardianName}
                    onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="nascimentoStatus">
                <div className="nascimento">
                  <h4>Data de Nascimento</h4>
                  <TextInput
                    type="date"
                    placeholder="Data de nascimento"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    required
                  />
                </div>
                <div className="statusFormularioPaciente">
                  <h4>Status</h4>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as "Ativo" | "Inativo" })}
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                  </select>
                </div>
              </div>

              <div className="ultimoAtendimento">
                <h4>Último Atendimento</h4>
                <TextInput
                  type="text"
                  placeholder="Último atendimento (opcional)"
                  value={formData.lastAppointment}
                  onChange={(e) => setFormData({ ...formData, lastAppointment: e.target.value })}
                />
              </div>

              {/* UPLOAD de IMAGEM */}
              <label>Foto do paciente</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setFormData({ ...formData, avatar: reader.result as string });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />

              <div className="informes">
                <textarea
                  placeholder="Sobre o paciente"
                  value={formData.aboutPatient}
                  onChange={(e) => setFormData({ ...formData, aboutPatient: e.target.value })}
                />
                <textarea
                  placeholder="Informações adicionais"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>


              <button type="submit">Salvar</button>
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
