import { useState } from "react";
import "./login.css";
import Cookies from "js-cookie"; 
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigate();

  const sendRequest = async (e: any) => {
    e.preventDefault();

    if (!email || !password ) {
      alert("Preencha todos os campos para continuar.");
      return;
    }

    const result = await fetch("http://localhost:3000/api/user/login", {
      method: "POST",
      headers: {  
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    if (result.status !== 200) {
      alert("Usuário ou senha incorretos.");
      return;
    }
    const json = await result.json();
    Cookies.set("token", json.token);
    navigation("/products");
};

  return (
    <div id="login-page">
      <div id="login-form-container">
        <h1>Mercadinho Unifacisa</h1>
        <p>Somente para Funcionários</p>

        <form id="login-form" onSubmit={(event) => {sendRequest(event)}}>
          <input
            type="username" id="username" placeholder="Usuário" value={email} onChange={(e) => setEmail(e.target.value)}  autoComplete="username"
          />
          <input type="password" id="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password"
          />

          <div className="options">
            <a href="#">Esqueceu a senha?</a>
          </div>

          <button type="submit">ENTRAR</button>
        </form>

      </div>
    </div>
  );
};

export default Login;