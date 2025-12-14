import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { BookOpen, PenTool, Settings, LogOut } from 'lucide-react';
import SearchAutocomplete from './SearchAutocomplete';

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
        <nav className="fixed top-0 w-full z-50 bg-white border-b-2 border-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center gap-8 flex-1">
                        <Link to="/" className="text-2xl font-black text-black uppercase tracking-tighter hover:underline decoration-4 underline-offset-4 shrink-0">
                            Knowledge Base
                        </Link>
                        
                        {/* Search Bar - Visible on desktop */}
                        <div className="hidden md:block w-full max-w-xs">
                            <SearchAutocomplete />
                        </div>
                        
                        <div className="hidden md:flex ml-12 space-x-2">
                            <Link 
                                to="/" 
                                className="flex items-center gap-2 text-black hover:bg-black hover:text-white px-4 py-2 rounded-lg text-sm font-bold border-2 border-transparent hover:border-black transition-all"
                            >
                                <BookOpen className="w-4 h-4" />
                                Articles
                            </Link>
                            
                            {(user.role === 'editor' || user.role === 'admin') && (
                                <Link 
                                    to="/editor" 
                                    className="flex items-center gap-2 text-black hover:bg-black hover:text-white px-4 py-2 rounded-lg text-sm font-bold border-2 border-transparent hover:border-black transition-all"
                                >
                                    <PenTool className="w-4 h-4" />
                                    Write
                                </Link>
                            )}
                            
                            {user.role === 'admin' && (
                                <Link 
                                    to="/admin" 
                                    className="flex items-center gap-2 text-black hover:bg-black hover:text-white px-4 py-2 rounded-lg text-sm font-bold border-2 border-transparent hover:border-black transition-all"
                                >
                                    <Settings className="w-4 h-4" />
                                    Admin
                                </Link>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-6">

                        <div className="flex items-center gap-3 border-l-2 border-gray-100 pl-6">
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <span className="block text-sm font-bold text-black leading-tight">
                                    {user.username}
                                </span>
                                <span className="inline-block px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-yellow-300 border border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                    {user.role}
                                </span>
                            </div>
                            <div className="h-10 w-10 bg-black rounded-full flex items-center justify-center text-white font-bold border-2 border-black">
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        
                        <button
                            onClick={handleLogout}
                            className="text-black hover:bg-red-500 hover:text-white p-2 rounded-lg border-2 border-transparent hover:border-black transition-all"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </nav>
    );
}