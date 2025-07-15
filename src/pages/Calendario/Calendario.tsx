import { useNavigate } from "react-router-dom";
import { CalendarComponent } from "../../components/CalendarComponent/CalendarComponent";
import { Sidebar } from "../../components/SideBar/SideBar";
import "./Calendario.css"

export function Calendario() {
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
                        <h2>Calendário</h2>
                    </div>

                    <div className="lista">
                        <CalendarComponent />
                    </div>
                </section>

            </main>
        </div>
    );
}
