import { BrowserRouter, Routes, Route} from "react-router-dom";
import Dashboard from "../pages/Dashboard/Dashboard";
import Login from "../pages/Login/Login";
import Cadastro from "../pages/Cadastro/Cadastro";
import Pacientes from "../pages/Pacientes/Pacientes";
import PerfilPaciente from "../pages/PerfilPaciente/PerfilPaciente";
import { Atendimentos } from "../pages/Atendimentos/Atendimentos";
import { Calendario } from "../pages/Calendario/Calendario";
import ConsultaDetalhes from "../pages/ConsultaDetalhes/ConsultaDetalhes";

export default function AppRoutes() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro/>}/>
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/pacientes" element={<Pacientes/>}/>
        <Route path="/pacientes/perfilPacientes/:id" element={<PerfilPaciente/>}/>
        <Route path="/atendimentos" element={<Atendimentos/>}/>
        <Route path="/atendimentos/atendimento/:id" element={<ConsultaDetalhes/>}/>
        <Route path="/calendario" element={<Calendario/>}/>
      </Routes>
    </BrowserRouter>
  );
}
