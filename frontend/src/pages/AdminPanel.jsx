import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { LayoutDashboard, FileText, Eye, Users, Plus, Folder, Settings, Search } from 'lucide-react';
import api from '../api';
import { Button } from '@/components/ui/button';

export default function AdminPanel() {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });
    const [stats, setStats] = useState({ global: null, categories: [] });
    
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/categories');
                setCategories(response.data);
            } catch {
                console.error('Failed to load categories');
            }
        };

        const fetchStats = async () => {
             try {
                 const response = await api.get('/stats');
                 setStats(response.data);
             } catch (error) {
                 console.error('Failed to fetch stats', error);
             }
        };

        fetchCategories();
        fetchStats();
        
        // Poll for active users every 30 seconds
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleAddCategory = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/categories', newCategory);
            setCategories([...categories, response.data]);
            setNewCategory({ name: '', description: '' });
            toast.success('Category added');
        } catch {
            toast.error('Failed to add category');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-black text-black mb-8 flex items-center gap-3 uppercase tracking-tighter">
                <LayoutDashboard className="w-10 h-10" />
                Admin Dashboard
            </h1>
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
                    <div className="flex items-center gap-3 mb-2">
                         <div className="p-2 bg-blue-100 border-2 border-black rounded-lg">
                            <FileText className="w-6 h-6 text-black" />
                         </div>
                        <div className="text-sm font-bold text-gray-500 uppercase">Total Articles</div>
                    </div>
                    <div className="text-4xl font-black text-black">{stats.global?.total_articles || 0}</div>
                </div>
                <div className="bg-white p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-yellow-100 border-2 border-black rounded-lg">
                            <Eye className="w-6 h-6 text-black" />
                        </div>
                        <div className="text-sm font-bold text-gray-500 uppercase">Total Views</div>
                    </div>
                    <div className="text-4xl font-black text-black">{stats.global?.total_views || 0}</div>
                </div>
                 <div className="bg-white p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-100 border-2 border-black rounded-lg">
                            <Users className="w-6 h-6 text-black" />
                        </div>
                        <div className="text-sm font-bold text-gray-500 uppercase">Active Users</div>
                        <span className="absolute top-4 right-4 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                            LIVE
                        </span>
                    </div>
                    <div className="text-4xl font-black text-black">{stats.global?.active_users || 0}</div>
                    <p className="text-xs text-gray-500 font-bold mt-2">Active in last 5 mins</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Category Management */}
                <div className="bg-white rounded-xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
                    <h2 className="text-2xl font-black text-black mb-6 flex items-center gap-2 uppercase">
                        <Folder className="w-6 h-6" />
                        Manage Categories
                    </h2>
                    
                    <form onSubmit={handleAddCategory} className="mb-8">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-black uppercase mb-1">Name</label>
                                <input
                                    type="text"
                                    value={newCategory.name}
                                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-black rounded-lg focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none transition-all font-medium"
                                    placeholder="e.g., Technology"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-black uppercase mb-1">Description</label>
                                <textarea
                                    value={newCategory.description}
                                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-black rounded-lg focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none transition-all font-medium"
                                    placeholder="Short description..."
                                    rows="2"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full py-6"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Category
                            </Button>
                        </div>
                    </form>
                    
                    <div className="space-y-4">
                        {stats.categories && stats.categories.length > 0 ? (
                            stats.categories.map(category => (
                                <div key={category.id} className="p-4 bg-gray-50 rounded-lg border-2 border-black group hover:bg-white transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="font-bold text-black text-lg">{category.name}</div>
                                        <span className="text-[10px] font-bold bg-black text-white px-2 py-0.5 rounded">
                                            ID: {category.id}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-3">
                                        <div className="bg-white p-2 rounded border border-black flex items-center justify-between">
                                            <span className="text-xs font-bold text-gray-500 uppercase">Articles</span>
                                            <span className="font-black text-black">{category.article_count}</span>
                                        </div>
                                         <div className="bg-white p-2 rounded border border-black flex items-center justify-between">
                                            <span className="text-xs font-bold text-gray-500 uppercase">Views</span>
                                            <span className="font-black text-black">{category.total_views}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="font-bold text-gray-400 italic">No category data available.</p>
                        )}
                    </div>
                </div>
                
                {/* Settings Placeholder */}
                 <div className="bg-white rounded-xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 border-2 border-black">
                        <Settings className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-black text-black mb-2 uppercase">System Settings</h3>
                    <p className="text-gray-600 font-medium mb-8 max-w-xs">
                        Configure global settings, manage users, and view system logs.
                    </p>
                    <button className="text-black font-bold hover:underline decoration-2 underline-offset-4">
                        View Advanced Settings →
                    </button>
                </div>
            </div>
        </div>
    );
}