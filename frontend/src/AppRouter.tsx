import { useEffect, useLayoutEffect } from 'react';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import MainLayout from './layouts/MainLayout';
import CallbackPage from './pages/Callback';
import HomePage from './pages/Home';
import SitesPage from './pages/Sites';

const AppRouter = () => {
    return <BrowserRouter>
        <Routes>
            <Route element={<MainLayout><Outlet /></MainLayout>}>
                <Route path="/" element={<HomePage />} />
                <Route path="/projects" element={<SitesPage />} />
                <Route path="/builds" element={<CallbackPage />} />
                <Route path="/callback" element={<CallbackPage />} />
            </Route>:
        </Routes>
    </BrowserRouter>;
};

export default AppRouter;