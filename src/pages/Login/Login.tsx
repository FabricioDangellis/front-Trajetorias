import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { Link } from "react-router-dom";

import Logo from "../../assets/Logo.svg"
import Psicologa from "../../assets/Psicologa.svg"
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa6";
import { TextInput } from "../../components/Input/TextInputProps";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const usuariosSalvos = JSON.parse(localStorage.getItem("usuarios") || "[]");

    const usuarioEncontrado = usuariosSalvos.find(
      (u: any) => u.email === email && u.senha === password
    );

    if (!usuarioEncontrado) {
      alert("E-mail ou senha incorretos.");
      return;
    }

    // Salva o usuário logado
    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioEncontrado));
    localStorage.setItem("token", "fake-token");
    navigate("/dashboard"); // ajuste a rota se necessário
  }


  return (
    <div className='container Login'>

      <div className='sessao'>

        <div className="formulario">

          <h2>Acesse sua jornada</h2>
          <span>Cuidar do bem-estar começa com um simples passo.
            Faça login para acompanhar o desenvolvimento emocional
            das crianças.
          </span>

          <form onSubmit={handleLogin}>
            <TextInput
              type="email"
              title="Email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="E-mail"
              required
            />
            <TextInput
              type="password"
              title="Senha"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Senha"
              required
            />
            <Link className="
            
            " to={"/dashboard"}>Esqueci minha senha</Link>

            <button type="submit">Entrar</button>
          </form>

          <h3>ou</h3>

          <div className="logins">
            <button title="Faça login com o Google" className="google">
              <FcGoogle className="iconeLogin" />
            </button>

            <button title="Faça login com o Facebook" className="facebook">
              <FaFacebook className="iconeLogin" />
            </button>
          </div>

          <span>Ainda não tem uma conta? <Link to={"/cadastro"}>Cadastre-se</Link></span>

        </div>
      </div>

      <div className="sessao">
        <img src={Logo} className="logo" />

        <div className="painel"></div>

        <img src={Psicologa} className="imagemPs" />
      </div>
    </div>
  );
}
