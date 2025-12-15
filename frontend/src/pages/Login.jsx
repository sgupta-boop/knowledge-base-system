import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircleIcon, LogInIcon } from 'lucide-react';

export default function Login({ setUser }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/auth/login', { username, password });
            const { token, user } = response.data;
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            
            navigate('/');
        } catch {
            setError('Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-yellow-50 relative">
            <div className="absolute top-8 left-8 hidden md:block">
                <div className="bg-white border-2 border-black px-6 py-3 rounded-full font-black text-xl uppercase tracking-wider animate-pulse-shadow">
                    Knowledge Base
                </div>
            </div>

            <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
                
                <div className="bg-white border-2 border-black rounded-xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <div className="mb-8">
                        <h1 className="text-4xl font-black text-black mb-2 uppercase tracking-tight">
                            Welcome Back
                        </h1>
                        <p className="font-bold text-gray-500">Sign in to your account</p>
                    </div>

                    {error && (
                        <div className="mb-6">
                            <Alert variant="destructive">
                                <AlertCircleIcon className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-black uppercase">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 bg-white border-2 border-black rounded-lg focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all outline-none font-medium placeholder:text-gray-400"
                                placeholder="Enter your username"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-black uppercase">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-white border-2 border-black rounded-lg focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all outline-none font-medium placeholder:text-gray-400"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="w-full text-base py-6 mt-4"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-sm font-bold">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-600 hover:text-blue-800 underline decoration-2 underline-offset-4">
                            Create Account
                        </Link>
                    </div>
                </div>
                
                {/* Right Side: Decorative */}
                <div className="hidden md:block">
                    <div className="bg-blue-100 border-2 border-black rounded-xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                         <div className="w-16 h-16 bg-white border-2 border-black rounded-full flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <LogInIcon className="h-8 w-8 text-black" />
                        </div>
                        <h2 className="text-3xl font-black text-black mb-4 uppercase">
                            Knowledge awaits
                        </h2>
                        <p className="text-lg font-medium text-gray-800 leading-relaxed">
                            Access your articles, manage your content, and explore the knowledge base.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}