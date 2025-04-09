import { useState } from 'react';

export default function LancarPedido({ comandas, itens, onAdicionarPedido }) {
    const [idComanda, setIdComanda] = useState('');
    const [idItem, setIdItem] = useState('');
    const [quantidade, setQuantidade] = useState(1);

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdicionarPedido({ id_comanda: idComanda, id_item: idItem, quantidade });
        setIdComanda(''); // Reset comanda selection
        setIdItem('');
        setQuantidade(1);
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Lançar Pedido</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1">Comanda</label>
                    <select
                        value={idComanda}
                        onChange={(e) => setIdComanda(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value="">Selecione a comanda</option>
                        {comandas.map((c) => (
                            <option key={`comanda-${c.id_comanda}`} value={c.id_comanda}>
                                {c.nome_cliente} (Mesa: {c.numero_mesa})
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block mb-1">Item</label>
                    <select
                        value={idItem}
                        onChange={(e) => setIdItem(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value="">Selecione o item</option>
                        {Array.isArray(itens) && itens.map((item) => (
                            <option key={`item-${item.id_item}`} value={item.id_item}>
                                {item.titulo_prato} - R$ {!isNaN(Number(item.preco)) ? Number(item.preco).toFixed(2) : 'N/A'}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block mb-1">Quantidade</label>
                    <input
                        type="number"
                        min="1"
                        value={quantidade}
                        onChange={(e) => setQuantidade(parseInt(e.target.value) || 1)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Adicionar Pedido
                </button>
            </form>
        </div>
    );
}