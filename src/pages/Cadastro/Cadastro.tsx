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

            <div className="logins">
              <button title="Cadastre-se com o Google" className="google">
                <FcGoogle className="iconeLogin" />
              </button>

              <button title="Cadastre-se com o Facebook" className="facebook">
                <FaFacebook className="iconeLogin" />
              </button>
            </div>
            

            <form onSubmit={handleLogin}>

              <div className="nome">
                <div className="nom">
                  <label htmlFor="id">Nome</label>
                  <TextInput
                    id="nome"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="sobrenom">
                  <label htmlFor="sobrenome">Sobrenome</label>
                  <TextInput
                    id="sobenome"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="email">
                <label htmlFor="email">Email</label>
                <TextInput
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  label="E-mail"
                  required
                />
              </div>

              <div className="dados">
                <div className="cpf">
                  <label htmlFor="cpf">CPF</label>
                  <TextInput
                    id="cpf"
                    className="cpf"
                    type="text"
                    value={cpf}
                    onChange={(e) => setCPF(e.target.value)}
                    required
                  />
                </div>

                <div className="dataNascimento">
                  <label htmlFor="nascimento">Data de Nascimento</label>
                  <TextInput
                    id="nascimento"
                    className="nascimento"
                    type="date"
                    value={dataBirth}
                    onChange={(e) => setDataBirth(e.target.value)}
                    required
                  />
                </div>


              </div>

              <div className="senhas">
                <label htmlFor="senha">Senha</label>
                <TextInput
                  id="senha"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="senhas">
                <label htmlFor="confirmeSenha">Confirme sua Senha</label>
                <TextInput
                  id="confirmeSenha"
                  type="password"
                  value={confirmedPassword}
                  onChange={(e) => setConfirmedPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit">Cadastrar</button>
            </form>

            <span className="possuiConta">Já possui uma conta? <Link to={"/"}>Entrar</Link></span>

          </div>

        </div>
      </div>
    </div>
  );
}
