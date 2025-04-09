import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://5e7a-200-201-116-46.ngrok-free.app/users',
});

function LoginPage() {
    const [cpf, setCpf] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('garcom');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
    
        try {
            const response = await api.post('/login', {
                cpf,
                senha: password,
                tipo: userType
            });
    
            if (response.data.success) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                
                if (userType === 'garcom') {
                    navigate('/garcom');
                } else if (userType === 'cozinha') {
                    navigate('/cozinha');
                }
            }
        } catch (err) {
            let errorMessage = 'Erro ao fazer login';
            
            if (err.response) {
                // O servidor respondeu com um status fora do range 2xx
                if (err.response.data && err.response.data.message) {
                    errorMessage = err.response.data.message;
                } else if (err.response.status === 500) {
                    errorMessage = 'Erro interno no servidor. Tente novamente mais tarde.';
                }
            } else if (err.request) {
                // A requisição foi feita mas não houve resposta
                errorMessage = 'Sem resposta do servidor. Verifique sua conexão.';
            }
            
            setError(errorMessage);
            console.error('Detalhes do erro:', {
                error: err,
                response: err.response?.data,
                status: err.response?.status
            });
        }
    };

    const handleCpfChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.substring(0, 11);
        
        if (value.length > 9) {
            value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else if (value.length > 6) {
            value = value.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
        } else if (value.length > 3) {
            value = value.replace(/(\d{3})(\d{3})/, '$1.$2');
        }
        
        setCpf(value);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                
                {error && (
                    <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="cpf" className="block mb-1">CPF:</label>
                        <input
                            type="text"
                            id="cpf"
                            value={cpf}
                            onChange={handleCpfChange}
                            className="w-full p-2 border rounded"
                            placeholder="000.000.000-00"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block mb-1">Senha:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Digite sua senha"
                            required
                        />
                    </div>

                    <div className="role-selection space-y-2">
                        <label className="block mb-1">Tipo de Usuário:</label>
                        <div className="flex flex-wrap gap-4">
                            {['garcom', 'cozinha'].map((type) => (
                                <label key={type} className="flex items-center">
                                    <input
                                        type="radio"
                                        name="userType"
                                        value={type}
                                        checked={userType === type}
                                        onChange={() => setUserType(type)}
                                        className="mr-2"
                                        required
                                    />
                                    {type === 'garcom' && 'Garçom/Garçonete'}
                                    {type === 'cozinha' && 'Cozinha'}
                                </label>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-amber-600 text-white py-2 px-4 rounded hover:bg-amber-700 transition"
                    >
                        Entrar
                    </button>

                    {/* Botão de cadastro adicionado corretamente */}
                    <div className="text-center mt-4">
                        <span className="text-gray-600">Não tem uma conta? </span>
                        <Link 
                            to="/cadastro" 
                            className="text-amber-600 hover:text-amber-700 font-medium"
                        >
                            Cadastre-se
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;