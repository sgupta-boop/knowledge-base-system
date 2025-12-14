import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api';

export default function AdminPanel() {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });
    const [stats, setStats] = useState({ articles: 0, views: 0, users: 0 }); // Mock stats for now
    
    // Fetch real stats would require an endpoint, simplifying for UI demo
    
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
             // Simulate network delay
             await new Promise(resolve => setTimeout(resolve, 500));
             setStats({ articles: 12, views: 3450, users: 8 });
        };

        fetchCategories();
        fetchStats();
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
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-sm font-medium text-gray-500 mb-1">Total Articles</div>
                    <div className="text-3xl font-bold text-blue-600">{stats.articles}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-sm font-medium text-gray-500 mb-1">Total Views</div>
                    <div className="text-3xl font-bold text-indigo-600">{stats.views}</div>
                </div>
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-sm font-medium text-gray-500 mb-1">Active Users</div>
                    <div className="text-3xl font-bold text-purple-600">{stats.users}</div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Category Management */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Manage Categories</h2>
                    
                    <form onSubmit={handleAddCategory} className="mb-8">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={newCategory.name}
                                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Technology"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={newCategory.description}
                                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Short description..."
                                    rows="2"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors font-medium"
                            >
                                Add Category
                            </button>
                        </div>
                    </form>
                    
                    <div className="space-y-3">
                        {categories.map(category => (
                            <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <div>
                                    <div className="font-semibold text-gray-900">{category.name}</div>
                                    <div className="text-xs text-gray-500">{category.description || 'No description'}</div>
                                </div>
                                <span className="text-xs bg-white border border-gray-200 px-2 py-1 rounded text-gray-500">
                                    ID: {category.id}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Placeholder for other admin tools */}
                 <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl mb-4">
                        🛠️
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">System Settings</h3>
                    <p className="text-gray-500 mb-6">
                        Configure global settings, manage users, and view system logs.
                        (Coming soon)
                    </p>
                    <button className="text-blue-600 font-medium hover:underline">
                        View Advanced Settings →
                    </button>
                </div>
            </div>
        </div>
    );
}