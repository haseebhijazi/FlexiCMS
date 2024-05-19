import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css'
import SignUp from './components/Signup.jsx';
import LogIn from './components/Login.jsx';
import Home from './components/Home.jsx';
import Dashboard from './components/Dashboard.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx';
import EntityForm from './components/EntityForm.jsx';
import ChangePasswordForm from './components/ChangePasswordForm.jsx';
import EntityDashboard from './components/EntityDashboard.jsx';
import RowForm from './components/RowForm.jsx';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={ <Home /> } />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
        <Route path="/create-entity" element={<ProtectedRoute> <EntityForm /> </ProtectedRoute>} />
        <Route path="/change-password" element={<ProtectedRoute> <ChangePasswordForm /> </ProtectedRoute>} />
        <Route path="/entity/:entity_display_name" element={<ProtectedRoute> <EntityDashboard /> </ProtectedRoute>  } />
        <Route path="/insert-row/:entity_display_name" element={<ProtectedRoute> <RowForm /> </ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

    </Router>
  )
}

export default App
