import { useState, useEffect } from 'react';
import axios from 'axios';
import GarcomDashboard from './GarcomDashboard.jsx';
import ComandaList from './ComandaList.jsx';
import LancarPedidos from './LancarPedidos.jsx';

const api = axios.create({
  baseURL: 'https://dce8-200-201-116-46.ngrok-free.app',
});


export default function GarcomPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [comandas, setComandas] = useState([]);
  const [itens, setItens] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Função centralizada para atualizar comandas
  const atualizarComandas = async () => {
    try {
      const res = await api.get('/comandas?status=aberta');
      setComandas(res.data.map(comanda => ({
        ...comanda,
        total: comanda.total ? Number(comanda.total).toFixed(2) : '0.00'
      })));
    } catch (error) {
      console.error('Erro ao atualizar comandas:', error);
      alert('Erro ao carregar comandas!');
    }
  };

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      try {
        const [itensRes, comandasRes] = await Promise.all([
          api.get('/itens'),
          api.get('/comandas?status=aberta'),
        ]);
        
        setItens(Array.isArray(itensRes.data?.itens) ? itensRes.data.itens : []);
        await atualizarComandas(); // Usa a função centralizada
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        alert('Erro ao carregar dados iniciais.');
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
    const intervalId = setInterval(atualizarComandas, 30000);

    return () => clearInterval(intervalId);
  }, []);

  // Atualiza comandas quando muda para a aba
  useEffect(() => {
    if (activeTab === 'comandas') {
      atualizarComandas();
    }
  }, [activeTab]);

  const criarComanda = async (dados) => {
    if (!dados?.nome_cliente || !dados?.numero_mesa) {
      alert('Preencha todos os campos!');
      return;
    }

    setLoading(true);
    try {
      await api.post('/comandas', { ...dados, status: 'aberta' });
      await atualizarComandas();
      setActiveTab('comandas');
    } catch (error) {
      console.error('Erro ao criar comanda:', error);
      alert('Erro ao criar comanda!');
    } finally {
      setLoading(false);
    }
  };

  const fecharComanda = async (id) => {
    if (!id || !confirm('Deseja fechar esta comanda?')) return;

    setLoading(true);
    try {
      const res = await api.patch(`/comandas/${id}/fechar`);
      const total = res.data.total_consumo ? Number(res.data.total_consumo).toFixed(2) : '0.00';
      alert(`Comanda fechada! Total: R$ ${total}`);
      await atualizarComandas();
    } catch (error) {
      console.error('Erro ao fechar comanda:', error);
      alert(error.response?.data?.message || 'Erro ao fechar comanda!');
    } finally {
      setLoading(false);
    }
  };

  const adicionarPedido = async (dados) => {
    if (!dados?.id_comanda || !dados?.id_item || !dados?.quantidade) {
      alert('Preencha todos os campos!');
      return;
    }

    setLoading(true);
    try {
      await api.post('/pedidos', dados);
      await atualizarComandas(); // Atualiza a lista de comandas
      alert('Pedido adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar pedido:', error);
      alert('Erro ao adicionar pedido!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Painel do Garçom</h1>
      
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 rounded transition-colors ${
            activeTab === 'dashboard' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Nova Comanda
        </button>
        <button
          onClick={() => setActiveTab('comandas')}
          className={`px-4 py-2 rounded transition-colors ${
            activeTab === 'comandas' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Comandas
        </button>
        <button
          onClick={() => setActiveTab('pedidos')}
          className={`px-4 py-2 rounded transition-colors ${
            activeTab === 'pedidos' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Lançar Pedido
        </button>
      </div>

      {loading && (
        <div className="mb-4 p-2 bg-blue-100 text-blue-800 rounded flex items-center">
          <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          Carregando...
        </div>
      )}

      <div className="bg-white p-4 rounded-lg shadow">
        {activeTab === 'dashboard' && (
          <GarcomDashboard onCreateComanda={criarComanda} loading={loading} />
        )}
        {activeTab === 'comandas' && (
          <ComandaList
            comandas={comandas}
            onFecharComanda={fecharComanda}
            loading={loading}
          />
        )}
        {activeTab === 'pedidos' && (
          <LancarPedidos
            comandas={comandas}
            itens={Array.isArray(itens) ? itens : []}
            onAdicionarPedido={adicionarPedido}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}