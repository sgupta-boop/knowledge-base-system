import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { MessageSquare, Trash2, Send } from 'lucide-react';
import api from '../api';
import { Button } from '@/components/ui/button';

export default function CommentSection({ articleId, user }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await api.get(`/comments/${articleId}`);
                setComments(response.data);
            } catch {
                console.error('Failed to load comments');
            }
        };

        if (articleId) {
            fetchComments();
        }
    }, [articleId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setLoading(true);
        try {
            const response = await api.post(`/comments/${articleId}`, {
                body: newComment
            });
            setComments([response.data, ...comments]);
            setNewComment('');
            toast.success('Comment posted!');
        } catch {
            toast.error('Failed to post comment');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (commentId) => {
        if (!window.confirm('Delete this comment?')) return;
        try {
            await api.delete(`/comments/${commentId}`);
            setComments(comments.filter(c => c.id !== commentId));
            toast.success('Comment deleted');
        } catch {
            toast.error('Failed to delete comment');
        }
    };

    return (
        <div className="mt-8">
            <h3 className="text-2xl font-black text-black mb-6 flex items-center gap-2 uppercase tracking-tight">
                <MessageSquare className="w-6 h-6" />
                Comments ({comments.length})
            </h3>
            
            {/* Comment Form */}
            {user ? (
                <form onSubmit={handleSubmit} className="mb-8 p-6 bg-yellow-50 border-2 border-black rounded-xl">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="What are your thoughts?"
                        className="w-full p-4 border-2 border-black rounded-lg focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] min-h-[100px] outline-none transition-all font-medium placeholder:text-gray-500 bg-white"
                        required
                    />
                    <div className="mt-4 flex justify-end">
                        <Button
                            type="submit"
                            disabled={loading || !newComment.trim()}
                            className="bg-black text-white px-6 py-2 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_bg-black]"
                        >
                            {loading ? 'Posting...' : 'Post Comment'}
                        </Button>
                    </div>
                </form>
            ) : (
                <div className="bg-gray-100 border-2 border-dashed border-gray-300 p-8 rounded-xl mb-8 text-center">
                    <p className="text-gray-600 font-bold mb-4">Join the conversation</p>
                    <a href="/login" className="inline-block bg-black text-white font-bold py-2 px-6 rounded-lg border-2 border-transparent hover:bg-white hover:text-black hover:border-black transition-all">
                        Log in to comment
                    </a>
                </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
                {comments.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
                        <p className="font-bold text-gray-400">No comments yet. Be the first!</p>
                    </div>
                ) : (
                    comments.map(comment => (
                        <div key={comment.id} className="bg-white p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-black text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 border-transparent">
                                        {comment.username?.charAt(0).toUpperCase() || '?'}
                                    </div>
                                    <div>
                                        <span className="font-black text-black block">{comment.username || 'Unknown User'}</span>
                                        <span className="text-xs font-bold text-gray-500">
                                            {new Date(comment.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                {(user?.role === 'admin' || user?.id === comment.user_id) && (
                                    <button
                                        onClick={() => handleDelete(comment.id)}
                                        className="text-gray-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete comment"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <p className="text-gray-800 font-medium whitespace-pre-wrap pl-1">{comment.body}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
