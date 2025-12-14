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
                <div className="flex items-center justify-between mb-8 sticky top-20 bg-white z-10 py-4 border-2 border-black px-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl transition-colors">
                    <div className="flex items-center space-x-2 text-sm text-black font-bold">
                        <span className="uppercase tracking-tight">{isEditMode ? 'Editing' : 'Drafting'} in</span>
                        <select
                            value={formData.category_id}
                            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                            className="bg-yellow-100 border-2 border-black rounded px-2 py-1 cursor-pointer focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all uppercase text-xs"
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        <span className="text-black mx-2">|</span>
                        <select
                             value={formData.status}
                             onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                             className={`border-2 border-black rounded px-2 py-1 cursor-pointer focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all uppercase text-xs font-bold ${
                                 formData.status === 'published' ? 'bg-green-300 text-black' : 'bg-gray-200 text-gray-500'
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
                            className="text-black font-bold hover:underline px-3 py-1.5 text-sm transition-colors uppercase"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-black text-white px-4 py-2 rounded-lg border-2 border-transparent text-sm font-bold hover:bg-white hover:text-black hover:border-black hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 transition-all uppercase"
                        >
                            {loading ? 'Saving...' : 'Save Article'}
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