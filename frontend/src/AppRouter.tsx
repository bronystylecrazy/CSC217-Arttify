import { useEffect, useLayoutEffect } from 'react';
import { BrowserRouter, Outlet, Route, Routes, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import MainLayout from './layouts/MainLayout';
import BuildPage from './pages/Build';
import CallbackPage from './pages/Callback';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import SitesPage from './pages/Sites';

const AppRouter = () => {
    const { user } = useAuth();

    return <BrowserRouter>
        <Routes>
            {!user.isAuthenticated && <Route path="*" element={<Navigate to="/login" />} />}
            <Route path="/login" element={<LoginPage />} />
            <Route element={<MainLayout><Outlet /></MainLayout>}>
                <Route path="/" element={<HomePage />} />
                <Route path="/projects" element={<SitesPage />} />
                <Route path="/builds" element={<BuildPage />} />
                <Route path="/callback" element={<CallbackPage />} />
            </Route>
        </Routes>
    </BrowserRouter>;
};

export default AppRouter;