import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2Icon, AlertCircleIcon } from 'lucide-react';
import ProfilePreview from '@/components/ProfilePreview';

export default function Register({ setUser }) {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'reader' // Default role
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const response = await api.post('/auth/register', formData);
            const { token, user } = response.data;
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            
            setSuccess(true);
            
            // Delay navigation slightly to show success alert
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
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

            <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-start">
                
                <div className="bg-white border-2 border-black rounded-xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <div className="mb-8">
                        <h1 className="text-4xl font-black text-black mb-2 uppercase tracking-tight">
                            Join Us
                        </h1>
                        <p className="font-bold text-gray-500">Create your knowledge base account</p>
                    </div>

                    {success && (
                        <div className="mb-6">
                            <Alert variant="success" className="bg-green-200">
                                <CheckCircle2Icon className="h-4 w-4" />
                                <AlertTitle>Success!</AlertTitle>
                                <AlertDescription>
                                    Your account has been created. Redirecting...
                                </AlertDescription>
                            </Alert>
                        </div>
                    )}

                    {error && (
                        <div className="mb-6">
                            <Alert variant="destructive">
                                <AlertCircleIcon className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>
                                    {error}
                                </AlertDescription>
                            </Alert>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-black uppercase">Username</label>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                                className="w-full px-4 py-3 bg-white border-2 border-black rounded-lg focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all outline-none font-medium placeholder:text-gray-400"
                                placeholder="Choose a username"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-black uppercase">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="w-full px-4 py-3 bg-white border-2 border-black rounded-lg focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all outline-none font-medium placeholder:text-gray-400"
                                placeholder="name@example.com"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-black uppercase">Password</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                className="w-full px-4 py-3 bg-white border-2 border-black rounded-lg focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all outline-none font-medium placeholder:text-gray-400"
                                placeholder="Super secret password"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-black uppercase">Role</label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                                className="w-full px-4 py-3 bg-white border-2 border-black rounded-lg focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all outline-none font-medium cursor-pointer"
                            >
                                <option value="reader">Reader</option>
                                <option value="editor">Editor</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <Button 
                            type="submit" 
                            disabled={loading || success}
                            className="w-full text-base py-6 mt-4"
                        >
                            {loading ? 'Creating...' : 'Sign Up Now'}
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-sm font-bold">
                        Already a member?{' '}
                        <Link to="/login" className="text-blue-600 hover:text-blue-800 underline decoration-2 underline-offset-4">
                            Log In
                        </Link>
                    </div>
                </div>

                {/* Right Side: Preview */}
                <div className="hidden md:block sticky top-24">
                    <div className="mb-4">
                        <h3 className="text-xl font-black text-black uppercase mb-1">Live Badge Preview</h3>
                        <p className="text-sm text-gray-600 font-medium">This is how you'll appear to others</p>
                    </div>
                    <ProfilePreview username={formData.username} role={formData.role} />
                    

                </div>

            </div>
        </div>
    );
}