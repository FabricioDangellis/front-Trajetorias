import { NavLink } from "react-router-dom";
import "./styles.css";
import Logo from "../../assets/Logo2.svg";

import { MdOutlineEmojiPeople } from "react-icons/md";
import { RiMentalHealthLine } from "react-icons/ri";
import { CiCalendar, CiGrid41 } from "react-icons/ci";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { AboutModal } from "../AboutModal/AboutModal";
import { CiLogout } from "react-icons/ci";
import { useState } from "react";

interface SideBarProps {
  onLogout: () => void;
}

export function Sidebar({onLogout}: SideBarProps) {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  
  return (
    <aside className= "sidebar">
      <h2 className="logo">
        <img src={Logo} alt="" />
      </h2>

      <hr className="divisao" />

      <nav className="nav">
        <NavLink to="/teste" className="link">
          <CiGrid41 className="icone"/>
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/pacientes" className="link">
          <MdOutlineEmojiPeople className="icone"/>
          <span>Pacientes</span>
        </NavLink>
        <NavLink to="/atendimentos" className="link">
          <RiMentalHealthLine className="icone"/>
          <span>Atendimentos</span>
        </NavLink>
        <NavLink to="/calendario" className="link">
          <CiCalendar className="icone"/>
          <span>Calendário</span>
        </NavLink>
        <hr className="divisao" />
        <button onClick={() => setIsAboutOpen(true)} className="link">
          <IoIosInformationCircleOutline className="icone"/>
          <span>Sobre</span>
        </button>
        <button onClick={onLogout} className="link">
          <CiLogout className="icone"/>
          <span>Sair</span>
        </button>
      </nav>
      <AboutModal isOpen={isAboutOpen} onRequestClose={() => setIsAboutOpen(false)} />
    </aside>
  );
}
