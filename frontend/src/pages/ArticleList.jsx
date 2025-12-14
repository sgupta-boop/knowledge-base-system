import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api';

export default function ArticleList() {
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [loading, setLoading] = useState(true);

    const displayArticles = searchResults || articles.filter(article => 
        !selectedCategory || article.category_id === parseInt(selectedCategory)
    );

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data);
        } catch {
            console.error('Failed to load categories');
        }
    };

    const fetchArticles = async () => {
        try {
            const response = await api.get('/articles');
            setArticles(response.data.articles || []);
        } catch {
            toast.error('Failed to load articles');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        
        try {
            const response = await api.get(`/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchResults(response.data.results);
        } catch {
            toast.error('Search failed');
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchArticles();
    }, []);

    // Helper to get random soft colors for category tags
    const getCategoryColor = (name) => {
        const colors = [
            'bg-blue-100 text-blue-700',
            'bg-purple-100 text-purple-700',
            'bg-green-100 text-green-700', 
            'bg-indigo-100 text-indigo-700',
            'bg-pink-100 text-pink-700'
        ];
        // Simple hash to persist color per category name
        let hash = 0;
        for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
        return colors[Math.abs(hash) % colors.length];
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                        Explore Knowledge
                    </h1>
                    <p className="text-lg text-slate-500">
                        Discover articles, tutorials, and guides.
                    </p>
                </div>
                
                {/* Search & Filter */}
                 <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <form onSubmit={handleSearch} className="relative group">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search..."
                            className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none shadow-sm group-hover:shadow-md"
                        />
                         <span className="absolute left-3.5 top-2.5 text-gray-400 group-focus-within:text-blue-500">
                            🔍
                        </span>
                        {searchResults && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchQuery('');
                                    setSearchResults(null);
                                }}
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 text-xs bg-gray-100 px-1.5 py-0.5 rounded-full"
                            >
                                ESC
                            </button>
                        )}
                    </form>

                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-2.5 bg-white border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none cursor-pointer shadow-sm hover:shadow-md transition-all text-sm font-medium text-slate-700"
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            
            {/* Results Info */}
            {searchResults && (
                <div className="mb-6 px-1">
                    <span className="text-slate-500 font-medium">
                        Found {searchResults.length} results for 
                    </span>
                    <span className="ml-2 font-bold text-slate-900">"{searchQuery}"</span>
                </div>
            )}
            
            {/* Articles Grid */}
            {displayArticles.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No articles found</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                        Try adjusting your search terms or filter. Or be the first to write one!
                    </p>
                </div>
            ) : (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {displayArticles.map((article, index) => (
                        <Link
                            key={article.id}
                            to={`/articles/${article.id}`}
                            className="group flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="h-3 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center justify-between mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getCategoryColor(article.category_name || '')}`}>
                                        {article.category_name || 'General'}
                                    </span>
                                    <span className="text-xs font-medium text-gray-400 flex items-center gap-1">
                                        👁️ {article.view_count || 0}
                                    </span>
                                </div>
                                
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                                    {article.title}
                                </h3>
                                
                                <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed">
                                    {article.body.replace(/[#*`]/g, '').substring(0, 150)}...
                                </p>
                                
                                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                                            {article.author_name?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-xs font-medium text-gray-600 truncate max-w-[100px]">
                                            {article.author_name}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {new Date(article.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
