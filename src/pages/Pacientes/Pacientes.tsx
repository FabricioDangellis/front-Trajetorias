import { useNavigate } from "react-router-dom";
import { Sidebar } from "../../components/SideBar/SideBar";
import "./styles.css";
import { PatientList } from "../../components/PatientList/PatientList";

export default function Pacientes() {
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/");
    }

    return (
        <div className="container">
            <Sidebar onLogout={handleLogout} />
            <main className="contentPacientesLista">

                <section className="mainSection">
                    <div className="topo">
                        <h2>Pacientes</h2>
                    </div>

                    <div className="lista">
                        <PatientList />
                    </div>
                </section>



            </main>
        </div>
    );
}