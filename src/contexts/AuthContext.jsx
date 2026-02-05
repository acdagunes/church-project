import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            verifyToken(token);
        } else {
            setLoading(false);
        }
    }, []);

    const verifyToken = async (token) => {
        try {
            const response = await axios.get('http://localhost:5000/api/auth/verify', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data.user);
        } catch (error) {
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                username,
                password
            });
            localStorage.setItem('token', response.data.token);
            setUser(response.data.user);
            return { success: true, role: response.data.user.role };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const loginMember = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:5000/api/parish/login', {
                username,
                password
            });
            localStorage.setItem('token', response.data.token);
            const userData = { ...response.data.member, type: 'member' };
            setUser(userData);
            return { success: true, role: response.data.member.role };
        } catch (error) {
            console.error('Member login error:', error.response?.data);
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, loginMember, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
