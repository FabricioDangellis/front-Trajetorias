import Modal from "react-modal";
import "./modalStyles.css";
import Logo from "../../assets/Logo3.svg";
import { IoCloseOutline } from "react-icons/io5";

interface AboutModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

Modal.setAppElement("#root");

export function AboutModal({ isOpen, onRequestClose }: AboutModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal"
      overlayClassName="overlay"
    >
      <div className="contentModal">
        <img src={Logo} alt="" />
        <button onClick={onRequestClose}>
            <IoCloseOutline className="iconeClose"/>
        </button>
        <p>
          O sistema <strong>Trajetórias</strong> foi desenvolvido para auxiliar psicólogos e responsáveis no
          acompanhamento da saúde mental de crianças. Ele proporciona um ambiente intuitivo, seguro e
          acolhedor, onde é possível cadastrar pacientes, acompanhar sua evolução e manter registros clínicos.
        </p>
        <p>
          Desenvolvido com foco em usabilidade, acessibilidade e design emocional, o sistema busca tornar o
          cuidado mais humano e próximo, respeitando os princípios da IHC.
        </p>
      </div>
    </Modal>
  );
}
