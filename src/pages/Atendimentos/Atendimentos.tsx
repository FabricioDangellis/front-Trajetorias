import "./Atendimentos.css";
import { Sidebar } from "../../components/SideBar/SideBar";
import { useNavigate } from "react-router-dom";
import { AppointmentList } from "../../components/AppointmentList/AppointmentList";

export function Atendimentos() {
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/login");
    }

    return (
        <div className="container">
            <Sidebar onLogout={handleLogout} />
            <main className="content">

                <section className="mainSection">
                    <div className="topo">
                        <h2>Atendimentos</h2>
                    </div>

                    <div className="listaAtendimentos">
                        <AppointmentList />                        
                    </div>

                </section>

            </main>
        </div>
    );
}
