import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Navbar({ user, setUser }) {
    const navigate = useNavigate();
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        toast.success('Logged out successfully');
        navigate('/login');
    };
    
    return (
        <nav className="fixed top-0 w-full z-50 glass">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent transform hover:scale-105 transition-transform duration-200">
                            📚 Knowledge Base
                        </Link>
                        
                        <div className="hidden md:flex ml-10 space-x-1">
                            <Link 
                                to="/" 
                                className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-full text-sm font-medium transition-all"
                            >
                                Articles
                            </Link>
                            
                            {(user.role === 'editor' || user.role === 'admin') && (
                                <Link 
                                    to="/editor" 
                                    className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-full text-sm font-medium transition-all"
                                >
                                    ✏️ Write
                                </Link>
                            )}
                            
                            {user.role === 'admin' && (
                                <Link 
                                    to="/admin" 
                                    className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-full text-sm font-medium transition-all"
                                >
                                    ⚙️ Admin
                                </Link>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <span className="block text-sm font-medium text-slate-700 leading-tight">
                                    {user.username}
                                </span>
                                <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 rounded-full">
                                    {user.role}
                                </span>
                            </div>
                            <div className="h-9 w-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        
                        <div className="h-6 w-px bg-slate-200 mx-2"></div>
                        
                        <button
                            onClick={handleLogout}
                            className="text-slate-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                            title="Logout"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}