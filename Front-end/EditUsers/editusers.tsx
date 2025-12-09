import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./editusers.css";
import Cookies from "js-cookie";

interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  cpf: string;
  password?: string;
}

const EditUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    cpf: "",
    password: ""
  });

  const fetchUsers = async () => {
    try {
      const result = await fetch("http://localhost:3000/api/user", {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get("token")}`
        }
      });

      if (!result.ok) throw new Error('Erro ao buscar usuários');
      const data = await result.json();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao carregar usuários');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSave = async () => {
    if (!formData.name || !formData.email || !formData.cpf) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    if (!editingId && !formData.password) {
      alert('Senha é obrigatória para novos usuários');
      return;
    }

    try {
      const url = editingId
        ? `http://localhost:3000/api/user/${formData.id}`
        : "http://localhost:3000/api/user";

      const method = editingId ? "PUT" : "POST";

      const body: any = {
        id: formData.id || Date.now().toString(),
        name: formData.name,
        email: formData.email,
        cpf: formData.cpf
      };

      if (formData.password) {
        body.password = formData.password;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get("token")}`
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error('Erro ao salvar');

      setFormData({ id: "", name: "", email: "", cpf: "", password: "" });
      setEditingId(null);
      setShowForm(false);
      fetchUsers();
      alert(editingId ? 'Usuário atualizado!' : 'Usuário criado!');
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao salvar usuário');
    }
  };

  const handleEdit = (user: User) => {
    setFormData({
      id: user.id || "",
      name: user.name,
      email: user.email,
      cpf: user.cpf,
      password: ""
    });
    setEditingId(user.id || "");
    setShowForm(true);
  };

  const handleDelete = async (userId: string | undefined) => {
    if (!window.confirm('Tem certeza que deseja deletar este usuário?')) return;

    try {
      const response = await fetch(`http://localhost:3000/api/user/${userId}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${Cookies.get("token")}`
        }
      });

      if (!response.ok) throw new Error('Erro ao deletar');

      fetchUsers();
      alert('Usuário deletado!');
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao deletar usuário');
    }
  };

  if (loading) {
    return <div className="editusers-page"><p>Carregando...</p></div>;
  }

  return (
    <div className="editusers-page">
      <nav className="navbar">
        <ul>
          <li><Link to="/products">Produtos</Link></li>
          <li><Link to="/promotion">Promoções</Link></li>
          <li><Link to="/editusers">Editar Usuários</Link></li>
          <li><Link to="/login" className="logout">Sair</Link></li>
        </ul>
      </nav>

      <div className="editusers-content">
        <div className="users-header">
          <h1>Gerenciar Usuários</h1>
          <button className="btn-novo" onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ id: "", name: "", email: "", cpf: "", password: "" }); }}>
            {showForm ? "Cancelar" : "+ Novo Usuário"}
          </button>
        </div>

        {showForm && (
          <div className="form-container">
            <div className="form-group">
              <label>Nome *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nome do usuário"
              />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email"
              />
            </div>
            <div className="form-group">
              <label>CPF *</label>
              <input
                type="text"
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                placeholder="CPF"
              />
            </div>
            <div className="form-group">
              <label>Senha {editingId ? "(deixe em branco para manter)" : "*"}</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Senha"
              />
            </div>
            <button className="btn-salvar" onClick={handleSave}>
              {editingId ? "Atualizar" : "Criar"}
            </button>
          </div>
        )}

        <table className="users-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>CPF</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: User) => (
              <tr key={user.id || user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.cpf}</td>
                <td className="acoes">
                  <button className="btn-edit" onClick={() => handleEdit(user)}>Editar</button>
                  <button className="btn-delete" onClick={() => handleDelete(user.id)}>Deletar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <p className="empty-state">Nenhum usuário cadastrado.</p>
        )}
      </div>
    </div>
  );
};

export default EditUsers;
