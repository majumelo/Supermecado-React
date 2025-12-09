import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./promotion.css";
import Cookies from "js-cookie";

interface Equipment {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  quantity: number;
  discountPercentage?: number;
  discountedPrice?: number;
}

const Promotion = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [desconto, setDesconto] = useState<number | string>("");
  const [produtoSelecionado, setProdutoSelecionado] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const result = await fetch("http://localhost:3000/api/equipment", {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get("token")}`
          }
        });

        if (!result.ok) {
          throw new Error('Erro ao buscar equipamentos');
        }

        const data = await result.json();
        setEquipments(data);
        setLoading(false);
      } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar equipamentos');
        setLoading(false);
      }
    };

    fetchEquipments();
  }, []);

  
  const aplicarPromocao = async (equipmentId: string | undefined) => {
    if (!desconto || Number(desconto) <= 0 || Number(desconto) > 100) {
      alert("Informe um valor de desconto válido (0-100%)!");
      return;
    }

    const equipmentIndex = equipments.findIndex(e => (e._id || e.id) === equipmentId);
    if (equipmentIndex === -1) return;

    const equipment = equipments[equipmentIndex];
    const discountedPrice = equipment.price - (equipment.price * Number(desconto)) / 100;

    try {
      // Usar o campo 'id' do equipment para a requisição
      const idParaRequisicao = equipment.id || equipmentId;
      
      // Chamar API para salvar desconto no banco
      const response = await fetch(`http://localhost:3000/api/equipment/${idParaRequisicao}/discount`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get("token")}`
        },
        body: JSON.stringify({ discountPercentage: Number(desconto) })
      });

      if (!response.ok) {
        throw new Error('Erro ao aplicar desconto no banco');
      }

      // Atualizar no estado local após sucesso no banco
      const equipmentsAtualizados = [...equipments];
      equipmentsAtualizados[equipmentIndex] = {
        ...equipment,
        discountPercentage: Number(desconto),
        discountedPrice: Number(discountedPrice.toFixed(2))
      };

      setEquipments(equipmentsAtualizados);
      setDesconto("");
      setProdutoSelecionado(null);
      alert("Promoção aplicada com sucesso!");
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao aplicar promoção no banco');
    }
  };

  const removerPromocao = async (equipmentId: string | undefined) => {
    const equipmentIndex = equipments.findIndex(e => (e._id || e.id) === equipmentId);
    if (equipmentIndex === -1) return;

    try {
      // Usar o campo 'id' do equipment para a requisição
      const equipment = equipments[equipmentIndex];
      const idParaRequisicao = equipment.id || equipmentId;

      // Chamar API para remover desconto no banco
      const response = await fetch(`http://localhost:3000/api/equipment/${idParaRequisicao}/discount`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get("token")}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao remover desconto no banco');
      }

      // Atualizar no estado local após sucesso no banco
      const equipmentsAtualizados = [...equipments];
      equipmentsAtualizados[equipmentIndex] = {
        ...equipments[equipmentIndex],
        discountPercentage: 0,
        discountedPrice: 0
      };

      setEquipments(equipmentsAtualizados);
      alert("Promoção removida!");
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao remover promoção do banco');
    }
  };

  if (loading) {
    return <div className="promotion-page"><p>Carregando...</p></div>;
  }

  return (
    <div className="promotion-page">
      <nav className="navbar">
        <ul>
          <li><Link to="/products">Produtos</Link></li>
          <li><Link to="/promotion">Promoções</Link></li>
          <li><Link to="/editusers">Editar Usuários</Link></li>
          <li><Link to="/login" className="logout">Sair</Link></li>
        </ul>
      </nav>

      <div className="promotion-container">
        <h1>Gerenciar Promoções</h1>
        <p>Selecione um produto para aplicar ou remover uma promoção.</p>

        <table className="promotion-table">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Preço Original</th>
              <th>Desconto (%)</th>
              <th>Preço com Desconto</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {equipments.map((equipment) => {
              const equipId = equipment._id || equipment.id;
              const temDesconto = equipment.discountPercentage && equipment.discountPercentage > 0;

              return (
                <tr key={equipId}>
                  <td>{equipment.name}</td>
                  <td>R$ {equipment.price.toFixed(2)}</td>
                  <td>{temDesconto ? `${equipment.discountPercentage}%` : "-"}</td>
                  <td>
                    {temDesconto
                      ? `R$ ${equipment.discountedPrice?.toFixed(2)}`
                      : "-"}
                  </td>
                  <td>{temDesconto ? "Ativa" : "Nenhuma"}</td>
                  <td>
                    {!temDesconto ? (
                      <>
                        {produtoSelecionado === equipId ? (
                          <>
                            <input
                              type="number"
                              placeholder="%"
                              min="0"
                              max="100"
                              value={desconto}
                              onChange={(e) => setDesconto(e.target.value)}
                              className="input-desconto"
                            />
                            <button
                              className="btn-apply"
                              onClick={() => aplicarPromocao(equipId)}
                            >
                              Aplicar
                            </button>
                            <button
                              className="btn-cancel"
                              onClick={() => {
                                setProdutoSelecionado(null);
                                setDesconto("");
                              }}
                            >
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <button
                            className="btn-edit"
                            onClick={() => setProdutoSelecionado(equipId || null)}
                          >
                            Aplicar Promoção
                          </button>
                        )}
                      </>
                    ) : (
                      <button
                        className="btn-delete"
                        onClick={() => removerPromocao(equipId)}
                      >
                        Remover Promoção
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {equipments.length === 0 && (
          <p className="empty-state">Nenhum equipamento cadastrado.</p>
        )}
      </div>
    </div>
  );
};

export default Promotion;