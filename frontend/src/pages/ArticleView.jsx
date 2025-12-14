import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api';
import CommentSection from '../components/CommentSection';

export default function ArticleView({ user }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [versions, setVersions] = useState([]);
    const [showVersions, setShowVersions] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
             setLoading(true);
            try {
                const response = await api.get(`/articles/${id}`);
                setArticle(response.data);
            } catch {
                toast.error('Failed to load article');
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        const fetchVersions = async () => {
            if (!user) return;
            try {
                const response = await api.get(`/articles/${id}/versions`);
                setVersions(response.data);
            } catch {
                console.error('Failed to load versions');
            }
        };
        
        fetchArticle();
        fetchVersions();
    }, [id, navigate, user]);

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this article?')) return;
        try {
            await api.delete(`/articles/${id}`);
            toast.success('Article deleted');
            navigate('/');
        } catch {
            toast.error('Failed to delete article');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center scale-150 h-screen text-blue-500">
                 <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-current"></div>
            </div>
        );
    }

    if (!article) return null;

    const canEdit = user && (user.role === 'admin' || (user.role === 'editor' && user.id === article.author_id));

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            
            {/* Minimal Header with Metadata */}
            <div className="mb-8">
                 <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
                    <Link to="/" className="hover:text-blue-600 transition-colors">Articles</Link>
                    <span>/</span>
                    <span className="font-medium text-gray-900">{article.category_name}</span>
                </div>

                <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
                    {article.title}
                </h1>
                
                <div className="flex items-center justify-between border-b border-gray-100 pb-8">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {article.author_name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className="font-medium text-gray-900">{article.author_name}</div>
                            <div className="text-sm text-gray-500">
                                {new Date(article.created_at).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long', 
                                    day: 'numeric'
                                })} · {article.view_count || 0} views
                            </div>
                        </div>
                    </div>

                    {canEdit && (
                        <div className="flex gap-2">
                            <Link 
                                to={`/editor/${article.id}`}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-medium transition-colors"
                            >
                                Edit
                            </Link>
                            <button 
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-full text-sm font-medium transition-colors"
                            >
                                Delete
                            </button>
                             <button
                                onClick={() => setShowVersions(!showVersions)}
                                className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full text-sm font-medium transition-colors"
                            >
                                History
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <article className="prose prose-lg prose-slate max-w-none mb-16">
                 <div className="whitespace-pre-wrap font-serif leading-loose text-lg text-gray-800">
                    {article.body}
                </div>
            </article>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-12">
                    {article.tags.map(tag => (
                        <span key={tag.id} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md text-sm font-medium">
                            #{tag.name}
                        </span>
                    ))}
                </div>
            )}
            
            {/* Version History Sidebar/Modal could go here, but inline for now */}
            {showVersions && (
                <div className="bg-gray-50 rounded-xl p-6 mb-12 border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        📜 Version History
                    </h3>
                    {versions.length === 0 ? (
                        <p className="text-gray-500 italic">No previous versions found.</p>
                    ) : (
                        <div className="space-y-3">
                            {versions.map((version, index) => (
                                <div key={version.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
                                    <div>
                                        <div className="font-medium text-gray-900">
                                            Version {versions.length - index}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            Edited by {version.edited_by_name} on {new Date(version.created_at).toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="text-sm font-medium text-gray-600">
                                        {version.title}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
            
            {/* Comments Section */}
            <CommentSection articleId={id} user={user} />
        </div>
    );
}