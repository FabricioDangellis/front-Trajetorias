import { NavLink, useNavigate } from "react-router-dom";
import { Sidebar } from "../../components/SideBar/SideBar";
import { Header } from "../../components/Header/Header";
import "./styles.css";

import Banner from "../../assets/Banner1.svg";
import { CiCalendar, CiEdit } from "react-icons/ci";
import { FaUserCircle } from "react-icons/fa";
import { WeekCalendar } from "../../components/WeekCalendar/WeekCalendar";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { DashboardCircleChart } from "../../components/DashboardCircleChart/DashboardCircleChart";
import { DashboardBarChart } from "../../components/DashboardBarChart/DashboardBarChart";

export default function Dashboard() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState<any>(null);
  const [date] = useState(new Date());
  const mes = format(date, "MMM", { locale: ptBR });
  const dia = format(date, "dd");

  useEffect(() => {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado") || "null");

    if (!usuarioLogado) {
      alert("Sessão expirada. Faça login novamente.");
      navigate("/");
    } else {
      setUsuario(usuarioLogado);
    }
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("usuarioLogado");
    navigate("/");
  }

  return (
    <div className="container">
      <Sidebar onLogout={handleLogout} />
      <main className="content">
        <div className="conteudo">
          <Header/>

          <section className="mainSection">
            <div className="banner">
              <NavLink className="date" to="/calendario">
                <CiCalendar className="icone" />
                {dia} {mes.charAt(0).toUpperCase() + mes.slice(1)}
              </NavLink>

              <div className="texto">
                <h1>Bem-vindo(a) ao seu painel</h1>
                <p>Aqui você pode visualizar seus pacientes, acompanhar relatórios e gerenciar seus atendimentos.</p>
              </div>

              <img src={Banner} alt="" />
            </div>

            <div className="graficos">
              <div className="graficoRosca">
                <h2>Consultas Semanais</h2>
                <DashboardCircleChart />
              </div>

              <div className="graficoBarras">
                <h2>Consultas Diarias</h2>
                <DashboardBarChart />
              </div>
            </div>
          </section>
        </div>

        <div className="dadosUser">
          <div className="meuPerfil">
            <h2>Meu Perfil</h2>
            <button>
              <CiEdit className="icone" />
            </button>
          </div>

          <div className="user">
            <FaUserCircle className="fotoUser" />
            <div className="dados">
              <h2 className="nome">
                Dr(a). {usuario?.nome} {usuario?.sobrenome}
              </h2>
              <span className="crp">
                {usuario?.crp || "87256492-94"}
              </span>
            </div>
          </div>

          <div className="meuCalendario">
            <h2>Meu Calendário</h2>
          </div>

          <div className="calendarioSemanal">
            <WeekCalendar />
          </div>
        </div>
      </main>
    </div>
  );
}
