import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Clock, Eye, Trash2, Edit2, History, ArrowLeft, Tag } from 'lucide-react';
import api from '../api';
import CommentSection from '../components/CommentSection';
import { Button } from '@/components/ui/button';

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
            <div className="flex justify-center items-center h-screen">
                 <div className="animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent"></div>
            </div>
        );
    }

    if (!article) return null;

    const canEdit = user && (user.role === 'admin' || (user.role === 'editor' && user.id === article.author_id));

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            
            {/* Back Link */}
            <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-black font-bold mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Articles
            </Link>

            {/* Main Article Card */}
            <div className="bg-white border-2 border-black rounded-xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-12">
                
                {/* Header Metadata */}
                <div className="flex flex-col gap-4 mb-8 pb-8 border-b-2 border-gray-100">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
                         <span className="bg-yellow-300 text-black px-2 py-1 rounded border border-black">
                            {article.category_name}
                         </span>
                         <span>•</span>
                         <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {article.created_at ? new Date(article.created_at).toLocaleDateString() : 'Unknown Date'}
                         </span>
                         <span>•</span>
                         <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {article.view_count || 0} views
                         </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-black leading-tight">
                        {article.title}
                    </h1>

                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-black rounded-full flex items-center justify-center text-white font-bold border-2 border-black">
                                {article.author_name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="font-bold text-black">{article.author_name}</div>
                                <div className="text-xs font-medium text-gray-500">Author</div>
                            </div>
                        </div>

                        {canEdit && (
                            <div className="flex gap-3">
                                <Link 
                                    to={`/editor/${article.id}`}
                                    className="p-2 text-black hover:bg-black hover:text-white rounded-lg border-2 border-black transition-all"
                                    title="Edit Article"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </Link>
                                <button 
                                    onClick={handleDelete}
                                    className="p-2 text-red-600 hover:bg-red-600 hover:text-white rounded-lg border-2 border-red-600 transition-all"
                                    title="Delete Article"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                 <button
                                    onClick={() => setShowVersions(!showVersions)}
                                    className={`p-2 rounded-lg border-2 border-gray-400 transition-all ${showVersions ? 'bg-gray-800 text-white border-gray-800' : 'text-gray-500 hover:text-black hover:border-black'}`}
                                    title="Version History"
                                >
                                    <History className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Article Body */}
                <article className="prose prose-lg prose-slate max-w-none mb-8 font-medium text-gray-800">
                     <div className="whitespace-pre-wrap leading-relaxed">
                        {article.body}
                    </div>
                </article>

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-6 border-t-2 border-gray-100">
                        {article.tags.map(tag => (
                            <span key={tag.id} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-bold border border-gray-300">
                                <Tag className="w-3 h-3" />
                                {tag.name}
                            </span>
                        ))}
                    </div>
                )}
            </div>
            
            {/* Version History */}
            {showVersions && (
                <div className="bg-gray-50 rounded-xl p-6 mb-12 border-2 border-black">
                    <h3 className="text-xl font-black text-black mb-4 flex items-center gap-2 uppercase">
                        <History className="w-5 h-5" />
                        Version History
                    </h3>
                    {versions.length === 0 ? (
                        <p className="font-bold text-gray-500 italic">No previous versions found.</p>
                    ) : (
                        <div className="space-y-3">
                            {versions.map((version, index) => (
                                <div key={version.id} className="bg-white p-4 rounded-lg border-2 border-black flex justify-between items-center shadow-sm">
                                    <div>
                                        <div className="font-bold text-black">
                                            Version {versions.length - index}
                                        </div>
                                        <div className="text-xs font-bold text-gray-500 mt-1">
                                            Edited by {version.edited_by_name} on {new Date(version.created_at).toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="text-sm font-bold text-gray-600">
                                        {version.title}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
            
            {/* Comments Section */}
            <div className="bg-white border-2 border-black rounded-xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <CommentSection articleId={id} user={user} />
            </div>
        </div>
    );
}