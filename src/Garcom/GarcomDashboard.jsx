import { useState } from 'react';

export default function GarcomDashboard({ onCreateComanda, loading = false }) {
  console.log('DEBUG - onCreateComanda:', onCreateComanda);

  const [nomeCliente, setNomeCliente] = useState('');
  const [numeroMesa, setNumeroMesa] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted with:', { nomeCliente, numeroMesa });

    if (!nomeCliente?.trim() || !numeroMesa?.trim()) {
      alert('Preencha todos os campos!');
      return;
    }

    try {
      if (onCreateComanda) {
        onCreateComanda({
          nome_cliente: nomeCliente.trim(),
          numero_mesa: numeroMesa.trim(),
        });
        setNomeCliente('');
        setNumeroMesa('');
      } else {
        throw new Error('onCreateComanda não existe!');
      }
    } catch (error) {
      console.error('Erro ao criar comanda:', error.message);
      alert('Erro no sistema. Recarregue a página (F5).');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Criar Nova Comanda</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nomeCliente" className="block text-sm font-medium text-gray-700">
            Nome do Cliente
          </label>
          <input
            id="nomeCliente"
            type="text"
            value={nomeCliente}
            onChange={(e) => setNomeCliente(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="numeroMesa" className="block text-sm font-medium text-gray-700">
            Número da Mesa
          </label>
          <input
            id="numeroMesa"
            type="text"
            value={numeroMesa}
            onChange={(e) => setNumeroMesa(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 text-white font-bold rounded-md ${
            loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {loading ? 'Carregando...' : 'Criar Comanda'}
        </button>
      </form>
    </div>
  );
}