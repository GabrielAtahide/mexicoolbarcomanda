import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Configuração do axios com URL base e headers padrão
const api = axios.create({ 
  baseURL: 'https://5e7a-200-201-116-46.ngrok-free.app',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default function CozinhaPage() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Função para carregar os pedidos
  const fetchPedidos = async () => {
    setLoading(true);
    try {
      const res = await api.get('/pedidos');
      setPedidos(res.data);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error.message);
      alert('Erro ao buscar pedidos. Verifique o console para mais detalhes.');
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar o status do pedido
  const atualizarStatusPedido = async (id_pedido, status) => {
    if (!id_pedido) {
      console.error('Erro: id_pedido está undefined ou inválido.');
      alert('Erro ao atualizar status: ID do pedido inválido.');
      return;
    }

    setLoading(true);
    try {
      console.log(`Atualizando status do pedido ${id_pedido} para "${status}"`);
      
      const response = await api.patch(`/pedidos/${id_pedido}/status`, { status });
      
      alert(`Status do pedido ${id_pedido} atualizado para "${status}".`);
      
      setPedidos(prevPedidos =>
        prevPedidos.map(pedido =>
          pedido.id_pedido === id_pedido ? { ...pedido, status } : pedido
        )
      );
    } catch (error) {
      console.error('Erro completo:', error);
      
      // Mensagem mais detalhada
      const serverMessage = error.response?.data?.details 
        || error.response?.data?.error 
        || error.response?.data?.message;
      
      const errorMessage = serverMessage 
        ? `Erro no servidor: ${serverMessage}`
        : `Erro ao atualizar status: ${error.message}`;
      
      alert(errorMessage);
      
      // Recarrega os pedidos para garantir consistência
      fetchPedidos();
    } finally {
      setLoading(false);
    }
  };

  // Verifica autenticação e carrega pedidos ao montar o componente
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.tipo !== 'cozinha') {
      alert('Acesso negado! Redirecionando para login.');
      navigate('/login');
    } else {
      fetchPedidos();
    }
  }, [navigate]);

  // Função para logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Filtra pedidos por status
  const pedidosPendentes = pedidos.filter(pedido => pedido.status !== 'pronto');
  const pedidosConcluidos = pedidos.filter(pedido => pedido.status === 'pronto');

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Área da Cozinha</h1>
          <button 
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Sair
          </button>
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="mb-4 p-2 bg-blue-100 text-blue-800 rounded flex items-center">
            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            Carregando...
          </div>
        )}

        {/* Seção de Pedidos Pendentes */}
        <div className="border-t pt-4">
          <h2 className="text-xl font-semibold mb-4">Pedidos Pendentes</h2>
          {pedidosPendentes.length === 0 ? (
            <p className="text-gray-500">Nenhum pedido pendente no momento.</p>
          ) : (
            <div className="space-y-4">
              {pedidosPendentes.map(pedido => (
                <div key={pedido.id_pedido} className="border p-4 rounded-lg bg-yellow-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Pedido #{pedido.id_pedido}</h3>
                      <p className="text-gray-700">Prato: {pedido.titulo_prato}</p>
                      <p className="text-gray-700">Quantidade: {pedido.quantidade}</p>
                      <p className="text-gray-700">Mesa: {pedido.numero_mesa}</p>
                      <p className="text-gray-700">Status: <span className="font-semibold capitalize">{pedido.status}</span></p>
                    </div>
                    <button
                      onClick={() => atualizarStatusPedido(pedido.id_pedido, 'pronto')}
                      className="mt-2 bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition"
                      disabled={loading}
                    >
                      Marcar como Pronto
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Seção de Pedidos Concluídos */}
        <div className="mt-8 border-t pt-4">
          <h2 className="text-xl font-semibold mb-4">Pedidos Concluídos</h2>
          {pedidosConcluidos.length === 0 ? (
            <p className="text-gray-500">Nenhum pedido concluído ainda.</p>
          ) : (
            <div className="space-y-4">
              {pedidosConcluidos.map(pedido => (
                <div key={pedido.id_pedido} className="border p-4 rounded-lg bg-green-50">
                  <h3 className="font-medium">Pedido #{pedido.id_pedido}</h3>
                  <p className="text-gray-700">Prato: {pedido.titulo_prato}</p>
                  <p className="text-gray-700">Quantidade: {pedido.quantidade}</p>
                  <p className="text-gray-700">Mesa: {pedido.numero_mesa}</p>
                  <p className="text-gray-700">Status: <span className="font-semibold text-green-600 capitalize">{pedido.status}</span></p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}