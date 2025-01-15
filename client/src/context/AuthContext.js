import React, { createContext, useState, useContext } from 'react';
import axiosInstance from '../utils/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = async (userInput, password) => {
        try {
            setLoading(true);
            setError(null);
            
            
            const isEmail = userInput.includes('@');
            
            const response = await axiosInstance.post('/auth/login', {
                
                ...(isEmail ? { email: userInput } : { username: userInput }),
                password
            });
            
            setUser(response.data.user);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            }
            
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'An error occurred during login';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const register = async (username, email, password) => {
        try {
            setLoading(true);
            setError(null);
            

            if (!email.includes('@')) {
                throw new Error('Invalid email format');
            }
            

            if (password.length < 6) {
                throw new Error('Password must be at least 6 characters long');
            }

            const response = await axiosInstance.post('/auth/register', {
                username,
                email,
                password
            });

            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            await axiosInstance.post('/auth/logout');
            setUser(null);
            // Clear stored token
            localStorage.removeItem('token');
            delete axiosInstance.defaults.headers.common['Authorization'];
        } catch (err) {
            setError(err.response?.data?.message || 'Logout failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setUser(null);
                return false;
            }

            const response = await axiosInstance.get('/auth/me');
            setUser(response.data.user);
            return true;
        } catch (err) {
            setUser(null);
            localStorage.removeItem('token');
            return false;
        }
    };

    const clearError = () => {
        setError(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            error,
            login,
            register,
            logout,
            checkAuth,
            clearError,
            setUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
