import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';

import Login from './pages/Login';
import Register from './pages/Register';
import ArticleList from './pages/ArticleList';
import ArticleView from './pages/ArticleView';
import ArticleEditor from './pages/ArticleEditor';
import AdminPanel from './pages/AdminPanel';
import Navbar from './components/Navbar';

function App() {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    return (
        <Router basename="/knowledge-base-system">
            <div className="min-h-screen bg-gray-50 pt-20">
                {user && <Navbar user={user} setUser={setUser} />}

                <Routes>
                    {/* Default redirect */}
                    <Route
                        path="/"
                        element={user ? <ArticleList user={user} /> : <Navigate to="/login" />}
                    />

                    <Route
                        path="/login"
                        element={user ? <Navigate to="/" /> : <Login setUser={setUser} />}
                    />

                    <Route
                        path="/register"
                        element={user ? <Navigate to="/" /> : <Register setUser={setUser} />}
                    />

                    <Route
                        path="/articles/:id"
                        element={user ? <ArticleView user={user} /> : <Navigate to="/login" />}
                    />

                    <Route
                        path="/editor"
                        element={
                            user && (user.role === 'editor' || user.role === 'admin')
                                ? <ArticleEditor user={user} />
                                : <Navigate to="/" />
                        }
                    />

                    <Route
                        path="/editor/:id"
                        element={
                            user && (user.role === 'editor' || user.role === 'admin')
                                ? <ArticleEditor user={user} />
                                : <Navigate to="/" />
                        }
                    />

                    <Route
                        path="/admin"
                        element={
                            user && user.role === 'admin'
                                ? <AdminPanel user={user} />
                                : <Navigate to="/" />
                        }
                    />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>

                <Toaster position="top-right" />
            </div>
        </Router>
    );
}

export default App;
