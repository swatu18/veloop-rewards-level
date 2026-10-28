import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css';
import { AuthProvider } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';
import { ToastProvider } from './context/ToastContext';
import AppLayout from './components/layout/AppLayout';
import Landing from './pages/Landing/Landing';
import SignIn from './pages/Auth/SignIn';
import SignUp from './pages/Auth/SignUp';
import LevelDashboard from './pages/LevelDashboard/LevelDashboard';
import Earn from './pages/Earn/Earn';
import Rewards from './pages/Rewards/Rewards';
import Wallet from './pages/Wallet/Wallet';
import Profile from './pages/Profile/Profile';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PlayerProvider>
          <ToastProvider>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route element={<AppLayout />}>
                <Route path="/Lvl-Dashboard" element={<LevelDashboard />} />
                <Route path="/earn" element={<Earn />} />
                <Route path="/rewards" element={<Rewards />} />
                <Route path="/wallet" element={<Wallet />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ToastProvider>
        </PlayerProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
