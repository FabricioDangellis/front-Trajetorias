import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { Link } from "react-router-dom";

import Logo from "../../assets/Logo.svg"
import Atendimento from "../../assets/Atendimento.svg"
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa6";
import { TextInput } from "../../components/Input/TextInputProps";

export default function Cadastro() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cpf, setCPF] = useState("");
  const [dataBirth, setDataBirth] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmedPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    const novoUsuario = {
      nome: name,
      sobrenome: lastName,
      email,
      cpf,
      dataNascimento: dataBirth,
      senha: password
    };

    // Recupera usuários existentes
    const usuariosSalvos = JSON.parse(localStorage.getItem("usuarios") || "[]");

    // Verifica se o e-mail já está cadastrado
    const emailExistente = usuariosSalvos.find((u: any) => u.email === email);
    if (emailExistente) {
      alert("Este e-mail já está cadastrado.");
      return;
    }

    // Salva o novo usuário
    usuariosSalvos.push(novoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuariosSalvos));
    navigate("/");
  }


  return (
    <div className="Cadastro">
      <div className='container'>

        <div className='sessao cadastro'>
          <img src={Logo} className="logo" />

          <div className="titulo">
            <h2>Crie sua conta e acompanhe de perto cada progresso.</h2>
            <span>Ao se cadastrar, você terá acesso a um espaço dedicado ao cuidado,
              acompanhamento e evolução de quem você ama. Seu apoio faz toda a diferença.</span>
          </div>

          <img src={Atendimento} />

        </div>

        <div className="sessao cadastro">

          <div className="formulario">

            <h2>Cadastro Rápido e Seguro</h2>
            <span>Acreditamos que pequenos passos constroem grandes trajetórias. <br />
              Comece hoje mesmo!
            </span>

            <div className="logins">
              <button title="Faça login com o Google" className="google">
                <FcGoogle className="iconeLogin" />
              </button>

              <button title="Faça login com o Facebook" className="facebook">
                <FaFacebook className="iconeLogin" />
              </button>
            </div>

            <h3>ou</h3>

            <form onSubmit={handleLogin}>

              <div className="nome">
                <TextInput
                  type="text"
                  placeholder="Nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <TextInput
                  type="text"
                  placeholder="Sobrenome"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>

              <TextInput
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="E-mail"
                required
              />

              <div className="dados">
                <TextInput
                  className="cpf"
                  type="text"
                  placeholder="CPF"
                  value={cpf}
                  onChange={(e) => setCPF(e.target.value)}
                  required
                />

                <TextInput
                  className="nascimento"
                  type="date"
                  placeholder="Data de nascimento"
                  value={dataBirth}
                  onChange={(e) => setDataBirth(e.target.value)}
                  required
                />

              </div>

              <TextInput
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <TextInput
                type="password"
                placeholder="Confirme sua senha"
                value={confirmedPassword}
                onChange={(e) => setConfirmedPassword(e.target.value)}
                required
              />

              <button type="submit">Cadastrar</button>
            </form>

            <span className="possuiConta">Já possui uma conta? <Link to={"/"}>Entrar</Link></span>

          </div>

        </div>
      </div>
    </div>
  );
}
