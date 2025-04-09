import './App.css';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const api = axios.create({
  baseURL: 'https://dce8-200-201-116-46.ngrok-free.app',
});


function RegistrationForm() {
    const [userType, setUserType] = useState('garcom');
    const [isLoading, setIsLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [cpf, setCpf] = useState('');
    const navigate = useNavigate();

    // Máscara de CPF
    const handleCpfChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.substring(0, 11);
        
        // Aplica a máscara
        if (value.length > 9) {
            value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else if (value.length > 6) {
            value = value.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
        } else if (value.length > 3) {
            value = value.replace(/(\d{3})(\d{3})/, '$1.$2');
        }
        
        setCpf(value);
    };

    const validateForm = (formData) => {
        const errors = {};
        if (!formData.nome || formData.nome.length < 3) {
            errors.name = 'Nome deve ter pelo menos 3 caracteres';
        }
        if (!formData.cpf || formData.cpf.replace(/\D/g, '').length !== 11) {
            errors.cpf = 'CPF inválido';
        }
        if (!formData.senha || formData.senha.length < 6) {
            errors.password = 'Senha deve ter pelo menos 6 caracteres';
        }
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        const formData = {
            nome: e.target.name.value.trim(),
            cpf: cpf.replace(/\D/g, ''),
            senha: e.target.password.value,
            tipo: userType
        };

        const errors = validateForm(formData);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            setIsLoading(false);
            return;
        }

        try {
            const response = await api.post('/users', formData);
            
            if (response.data.success) {
                alert('Usuário cadastrado com sucesso!');
                navigate('/login');
            } else {
                alert(response.data.message || 'Erro ao cadastrar usuário');
            }
        } catch (error) {
            console.error('Erro no cadastro:', error);
            alert(error.response?.data?.message || 'Erro ao cadastrar usuário');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Cadastro de Funcionário</h2>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Nome Completo */}
                <div>
                    <label htmlFor="name" className="block mb-1">Nome Completo:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className={`w-full p-2 border rounded ${formErrors.name ? 'border-red-500' : ''}`}
                        placeholder="Digite seu nome completo"
                        required
                    />
                    {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}
                </div>

                {/* CPF */}
                <div>
                    <label htmlFor="cpf" className="block mb-1">CPF:</label>
                    <input
                        type="text"
                        id="cpf"
                        name="cpf"
                        value={cpf}
                        onChange={handleCpfChange}
                        className={`w-full p-2 border rounded ${formErrors.cpf ? 'border-red-500' : ''}`}
                        placeholder="000.000.000-00"
                        required
                    />
                    {formErrors.cpf && <p className="text-red-500 text-sm">{formErrors.cpf}</p>}
                </div>

                {/* Senha */}
                <div>
                    <label htmlFor="password" className="block mb-1">Senha:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className={`w-full p-2 border rounded ${formErrors.password ? 'border-red-500' : ''}`}
                        placeholder="Crie uma senha segura"
                        minLength="6"
                        required
                    />
                    {formErrors.password && <p className="text-red-500 text-sm">{formErrors.password}</p>}
                </div>

                {/* Tipo de Usuário */}
                <div className="role-selection space-y-2">
                    <label className="block mb-1">Função:</label>
                    <div className="flex flex-wrap gap-4">
                        {['garcom', 'cozinha', 'admin'].map((type) => (
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
                                {type === 'admin' && 'Administrador'}
                            </label>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    className={`w-full bg-amber-600 text-white py-2 px-4 rounded hover:bg-amber-700 transition ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    disabled={isLoading}
                >
                    {isLoading ? 'Cadastrando...' : 'Cadastrar'}
                </button>
            </form>
        </div>
    );
}

export default RegistrationForm;