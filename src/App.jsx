import React, {useEffect, useState} from 'react';
import {Routes, Route, Navigate, useLocation} from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import BooksCatalogPage from './pages/BooksCatalogPage';
import BookDetailsPage from './pages/BookDetailsPage';
import AdminBookDetailsPage from './pages/AdminBookDetailsPage'
import AdminAddBookPage from './pages/AdminAddBookPage'
import ProfilePage from './pages/ProfilePage'
import Navbar from './components/Navbar';
import AdminNavbar from './components/AdminNavbar';
import AdminGenresPage from './pages/AdminGenresPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import {setupAxiosInterceptors} from './api/axios';
import {Toaster} from '@/components/ui/toaster';
import {useToast} from '@/hooks/use-toast';
import {SearchProvider} from './api/SearchContext';

const App = () => {
    const {toast} = useToast();

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeInterceptors = async () => {
            await setupAxiosInterceptors(toast);
            setIsLoading(false);
        };

        initializeInterceptors();
    }, []);

    const location = useLocation();
    const isAdmin = JSON.parse(localStorage.getItem('isAdmin'));
    const isAuthPage = location.pathname === '/login';
    const isErrorPage = location.pathname.startsWith('/error');

    if (isLoading) {
        return null;
    }

    return (
        <SearchProvider>
            {!isAuthPage && !isErrorPage && (isAdmin ? <AdminNavbar/> : <Navbar isAdmin={isAdmin}/>)}
            <Routes>
                <Route path="/login" element={<AuthPage/>}/>
                <Route path="/" element={<BooksCatalogPage/>}/>
                <Route path="/profile" element={<ProfilePage/>}/>

                {!isAdmin && (
                    <>
                        <Route path="/book/:id" element={<BookDetailsPage/>}/>
                    </>
                )}

                {isAdmin && (
                    <>
                        <Route path="/book/:id" element={<AdminBookDetailsPage/>}/>
                        <Route path="/admin/add-book" element={<AdminAddBookPage/>}/>
                        <Route path="/admin/genres" element={<AdminGenresPage/>}/>
                        <Route path="/admin/orders" element={<AdminOrdersPage/>}/>
                    </>
                )}

                <Route path="*" element={<Navigate to="/"/>}/>
            </Routes>
            <Toaster/>
        </SearchProvider>
    );
};

export default App;
