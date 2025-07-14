import { IoIosNotificationsOutline } from "react-icons/io";
import "./header.css";

export function Header() {

  return (
    <header className="header">

      <div>
        <input type="text" placeholder="Pesquisar..." className="pesquisa" />
      </div>

      <button>
        <IoIosNotificationsOutline className="icone"/>
      </button>

    </header>
  );
}
