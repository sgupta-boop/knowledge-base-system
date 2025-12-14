import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api';

export default function ArticleEditor() {
    const { id } = useParams(); // If id exists, we're editing
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        title: '',
        body: '',
        category_id: '',
        status: 'draft',
        tags: ''
    });
    
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const isEditMode = !!id;
    
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/categories');
                setCategories(response.data);
            } catch {
                toast.error('Failed to load categories');
            }
        };

        const fetchArticle = async () => {
             setLoading(true);
            try {
                const response = await api.get(`/articles/${id}`);
                const article = response.data;
                
                setFormData({
                    title: article.title,
                    body: article.body,
                    category_id: article.category_id || '',
                    status: article.status,
                    tags: article.tags?.map(t => t.name).join(', ') || ''
                });
            } catch {
                toast.error('Failed to load article');
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
        
        if (id) {
            fetchArticle();
        }
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title.trim() || !formData.body.trim()) {
            return toast.error('Title and body are required');
        }
        
        setLoading(true);
        
        try {
            const payload = {
                title: formData.title,
                body: formData.body,
                category_id: formData.category_id || null,
                status: formData.status,
                tags: formData.tags 
                    ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
                    : []
            };
            
            let response;
            
            if (isEditMode) {
                response = await api.put(`/articles/${id}`, payload);
                toast.success('Article updated successfully!');
            } else {
                response = await api.post('/articles', payload);
                toast.success('Article created successfully!');
            }
            
            navigate(`/articles/${response.data.id || id}`);
        } catch {
            toast.error('Failed to save article');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Header Controls */}
                <div className="flex items-center justify-between mb-8 sticky top-20 bg-gray-50 z-10 py-4 border-b border-transparent hover:border-gray-200 transition-colors">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{isEditMode ? 'Editing' : 'Drafting'} in</span>
                        <select
                            value={formData.category_id}
                            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                            className="bg-transparent hover:bg-gray-200 rounded px-2 py-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        <span className="text-gray-300">|</span>
                        <select
                             value={formData.status}
                             onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                             className={`bg-transparent hover:bg-gray-200 rounded px-2 py-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                 formData.status === 'published' ? 'text-green-600 font-medium' : 'text-gray-500'
                             }`}
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </select>
                    </div>

                    <div className="flex items-center space-x-3">
                         <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded text-sm transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-700 disabled:opacity-50 shadow-sm transition-all"
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>

                {/* Document Area */}
                <div className="min-h-[calc(100vh-200px)]">
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Untitled"
                        className="w-full text-4xl font-bold placeholder-gray-300 border-none bg-transparent focus:ring-0 px-0 py-4 text-gray-800"
                        autoFocus
                    />
                    
                    <div className="mb-8">
                         <input
                            type="text"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            placeholder="Add tags..."
                            className="w-full text-sm text-gray-500 placeholder-gray-300 border-none bg-transparent focus:ring-0 px-0 italic"
                        />
                    </div>

                    <textarea
                        value={formData.body}
                        onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                        placeholder="Type '/' for commands"
                        className="w-full h-[600px] resize-none border-none bg-transparent focus:ring-0 px-0 text-lg leading-relaxed text-gray-700 placeholder-gray-300 font-serif"
                    />
                </div>
            </form>
        </div>
    );
}