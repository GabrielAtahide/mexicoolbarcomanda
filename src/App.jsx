import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegistrationForm from './RegistrationForm';
import GarcomPage from './Garcom/GarcomPage';
import CozinhaPage from './Cozinha/CozinhaPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/garcom" element={<GarcomPage />} />
        <Route path="/cozinha" element={<CozinhaPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;