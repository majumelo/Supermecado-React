import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./products.css";
import Cookies from "js-cookie";

interface Equipment {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  quantity: number;
  code: string;
  purchaseDate: string;
  validityDate: string;
  discountPercentage?: number;
  discountedPrice?: number;
}

const Products = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    price: "",
    quantity: "",
    code: "",
    purchaseDate: "",
    validityDate: ""
  });

  const fetchEquipments = async () => {
    try {
      const result = await fetch("http://localhost:3000/api/equipment", {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get("token")}`
        }
      });

      if (!result.ok) throw new Error('Erro ao buscar equipamentos');
      const data = await result.json();
      setEquipments(data);
      setLoading(false);
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao carregar equipamentos');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  const handleSave = async () => {
    if (!formData.name || !formData.price || !formData.code) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      const url = editingId
        ? `http://localhost:3000/api/equipment/${formData.id}`
        : "http://localhost:3000/api/equipment";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get("token")}`
        },
        body: JSON.stringify({
          id: formData.id || Date.now().toString(),
          name: formData.name,
          price: Number(formData.price),
          quantity: Number(formData.quantity) || 0,
          code: formData.code,
          purchaseDate: formData.purchaseDate,
          validityDate: formData.validityDate
        })
      });

      if (!response.ok) throw new Error('Erro ao salvar');

      setFormData({ id: "", name: "", price: "", quantity: "", code: "", purchaseDate: "", validityDate: "" });
      setEditingId(null);
      setShowForm(false);
      fetchEquipments();
      alert(editingId ? 'Produto atualizado!' : 'Produto criado!');
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao salvar produto');
    }
  };

  const handleEdit = (equipment: Equipment) => {
    setFormData({
      id: equipment.id || "",
      name: equipment.name,
      price: equipment.price.toString(),
      quantity: equipment.quantity.toString(),
      code: equipment.code,
      purchaseDate: equipment.purchaseDate,
      validityDate: equipment.validityDate
    });
    setEditingId(equipment.id || "");
    setShowForm(true);
  };

  const handleDelete = async (equipmentId: string | undefined) => {
    if (!window.confirm('Tem certeza que deseja deletar este produto?')) return;

    try {
      const response = await fetch(`http://localhost:3000/api/equipment/${equipmentId}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${Cookies.get("token")}`
        }
      });

      if (!response.ok) throw new Error('Erro ao deletar');

      fetchEquipments();
      alert('Produto deletado!');
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao deletar produto');
    }
  };

  if (loading) {
    return <div className="products-page"><p>Carregando...</p></div>;
  }

  return (
    <div className="products-page">
      <nav className="navbar">
        <ul>
          <li><Link to="/products">Produtos</Link></li>
          <li><Link to="/promotion">Promoções</Link></li>
          <li><Link to="/editusers">Editar Usuários</Link></li>
          <li><Link to="/login" className="logout">Sair</Link></li>
        </ul>
      </nav>

      <div className="home-content">
        <div className="products-header">
          <h1>Gerenciar Produtos</h1>
          <button className="btn-novo" onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ id: "", name: "", price: "", quantity: "", code: "", purchaseDate: "", validityDate: "" }); }}>
            {showForm ? "Cancelar" : "+ Novo Produto"}
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
                placeholder="Nome do produto"
              />
            </div>
            <div className="form-group">
              <label>Preço *</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="Preço"
              />
            </div>
            <div className="form-group">
              <label>Quantidade</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="Quantidade"
              />
            </div>
            <div className="form-group">
              <label>Código *</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="Código"
              />
            </div>
            <div className="form-group">
              <label>Data de Compra</label>
              <input
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Data de Validade</label>
              <input
                type="date"
                value={formData.validityDate}
                onChange={(e) => setFormData({ ...formData, validityDate: e.target.value })}
              />
            </div>
            <button className="btn-salvar" onClick={handleSave}>
              {editingId ? "Atualizar" : "Criar"}
            </button>
          </div>
        )}

        <table className="zebra-table">
          <thead>
            <tr>
              <th>Nome do Produto</th>
              <th>Preço Original</th>
              <th>Desconto</th>
              <th>Preço Final</th>
              <th>Quantidade</th>
              <th>Código</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {equipments.map((equipment: Equipment) => {
              const temDesconto = equipment.discountPercentage && equipment.discountPercentage > 0;
              const precoFinal = temDesconto ? equipment.discountedPrice : equipment.price;

              return (
                <tr key={equipment.id}>
                  <td>{equipment.name}</td>
                  <td>R$ {equipment.price.toFixed(2)}</td>
                  <td>{temDesconto ? `${equipment.discountPercentage}%` : "-"}</td>
                  <td style={temDesconto ? { color: 'green', fontWeight: 'bold' } : {}}>
                    R$ {precoFinal?.toFixed(2)}
                  </td>
                  <td>{equipment.quantity}</td>
                  <td>{equipment.code}</td>
                  <td className="acoes">
                    <button className="btn-edit" onClick={() => handleEdit(equipment)}>Editar</button>
                    <button className="btn-delete" onClick={() => handleDelete(equipment.id)}>Deletar</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {equipments.length === 0 && (
          <p className="empty-state">Nenhum produto cadastrado.</p>
        )}
      </div>
    </div>
  );
};

export default Products;