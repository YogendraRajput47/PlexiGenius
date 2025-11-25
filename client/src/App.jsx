import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LeadDetail from './pages/LeadDetail';
import ProtectedRoute from './components/ProtectedRoute';
import Leads from './pages/Leads';
import Employees from './pages/Employees';
function App(){
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
        <Route path="/leads" element={<ProtectedRoute><Leads/></ProtectedRoute>} />
        <Route path="/employees" element={<ProtectedRoute><Employees/></ProtectedRoute>} />
        <Route path="/leads/:id" element={<ProtectedRoute><LeadDetail/></ProtectedRoute>} />
      </Routes>
    </AuthProvider>
  );
}
export default App;