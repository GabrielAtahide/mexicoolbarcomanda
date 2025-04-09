export default function ComandasList({ comandas, onFecharComanda }) {
    const comandasAbertas = comandas.filter((comanda) => comanda.status === 'aberta');

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Comandas Abertas</h2>
            {comandasAbertas.length === 0 ? (
                <p>Nenhuma comanda aberta</p>
            ) : (
                <div className="space-y-3">
                    {comandasAbertas.map((comanda) => (
                        <div key={comanda.id_comanda || comanda.id} className="border p-4 rounded-lg">
                            <h3 className="font-medium">{comanda.nome_cliente}</h3>
                            <p>Mesa: {comanda.numero_mesa}</p>
                            <p>Total: R$ {comanda.total}</p> {/* Display total */}
                            <button
                                onClick={() => {
                                    console.log(`Fechando comanda: ${comanda.id_comanda}`);
                                    if (!comanda.id_comanda) {
                                        console.error('Erro: id_comanda está undefined.');
                                        alert('Erro ao fechar comanda: ID inválido.');
                                        return;
                                    }
                                    onFecharComanda(comanda.id_comanda);
                                }}
                                className="mt-2 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                            >
                                Fechar Comanda
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}