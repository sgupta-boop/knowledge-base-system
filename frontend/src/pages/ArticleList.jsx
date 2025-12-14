import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Search, FileText, Eye, User, Calendar, Tag } from 'lucide-react';
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

    // Highlight helper
    const highlightText = (text, query) => {
        if (!query) return text;
        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return parts.map((part, i) => 
            part.toLowerCase() === query.toLowerCase() ? (
                <span key={i} className="bg-yellow-300">{part}</span>
            ) : (
                part
            )
        );
    };

    useEffect(() => {
        fetchCategories();
        fetchArticles();
    }, []);

    // Helper to get random soft colors for category tags (slightly bolder now)
    const getCategoryColor = (name) => {
        const colors = [
            'bg-blue-200 text-black',
            'bg-purple-200 text-black',
            'bg-green-200 text-black', 
            'bg-yellow-200 text-black',
            'bg-pink-200 text-black'
        ];
        let hash = 0;
        for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
        return colors[Math.abs(hash) % colors.length];
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-black uppercase tracking-tighter mb-2">
                        Explore Knowledge
                    </h1>
                    <p className="text-lg font-bold text-gray-500">
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
                            placeholder="SEARCH..."
                            className="w-full sm:w-64 pl-10 pr-4 py-3 bg-white border-2 border-black rounded-lg focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all outline-none font-bold placeholder:text-gray-400"
                        />
                         <span className="absolute left-3.5 top-3.5 text-black">
                            <Search className="w-5 h-5" />
                        </span>
                        {searchResults && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchQuery('');
                                    setSearchResults(null);
                                }}
                                className="absolute right-3 top-3 text-xs font-bold bg-black text-white px-2 py-1 rounded"
                            >
                                ESC
                            </button>
                        )}
                    </form>

                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-3 bg-white border-2 border-black rounded-lg focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none cursor-pointer transition-all font-bold text-black uppercase"
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
                    <span className="font-bold text-black border-2 border-black bg-yellow-300 px-3 py-1 rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        Found {searchResults.length} results for "{searchQuery}"
                    </span>
                </div>
            )}
            
            {/* Articles Grid */}
            {displayArticles.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <div className="inline-block p-4 rounded-full bg-gray-100 border-2 border-black mb-4">
                        <FileText className="w-8 h-8 text-black" />
                    </div>
                    <h3 className="text-2xl font-black text-black uppercase mb-2">No articles found</h3>
                    <p className="font-bold text-gray-500 max-w-sm mx-auto">
                        Try adjusting your search terms or filter. Or be the first to write one!
                    </p>
                </div>
            ) : (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {displayArticles.map((article) => (
                        <Link
                            key={article.id}
                            to={`/articles/${article.id}`}
                            className="group flex flex-col bg-white rounded-xl border-2 border-black overflow-hidden hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                        >
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center justify-between mb-4">
                                    <span className={`px-2 py-1 rounded border-2 border-black text-xs font-black uppercase tracking-wider ${getCategoryColor(article.category_name || '')}`}>
                                        {article.category_name || 'General'}
                                    </span>
                                    <span className="text-xs font-bold text-gray-600 flex items-center gap-1 bg-gray-100 px-2 py-1 rounded border border-black">
                                        <Eye className="w-3 h-3" />
                                        {article.view_count || 0}
                                    </span>
                                </div>
                                
                                <h3 className="text-xl font-black text-black mb-3 group-hover:underline decoration-2 underline-offset-2 line-clamp-2">
                                    {searchResults ? highlightText(article.title, searchQuery) : article.title}
                                </h3>
                                
                                <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed font-medium border-l-4 border-gray-200 pl-3">
                                    {article.body.replace(/[#*`]/g, '').substring(0, 150)}...
                                </p>
                                
                                <div className="mt-auto pt-4 border-t-2 border-black flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-xs font-bold text-white border-2 border-transparent group-hover:border-yellow-300 transition-colors">
                                            {article.author_name?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-xs font-bold text-black truncate max-w-[100px]">
                                            {article.author_name}
                                        </span>
                                    </div>
                                    <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
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
