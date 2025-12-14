import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api';

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
        <div className="mt-12 border-t pt-8">
            <h3 className="text-2xl font-bold mb-6">💬 Comments ({comments.length})</h3>
            
            {/* Comment Form */}
            {user ? (
                <form onSubmit={handleSubmit} className="mb-8">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="What are your thoughts?"
                        className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
                        required
                    />
                    <div className="mt-2 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading || !newComment.trim()}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Posting...' : 'Post Comment'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="bg-gray-50 p-4 rounded-lg mb-8 text-center text-gray-600">
                    <a href="/login" className="text-blue-600 font-medium hover:underline">Log in</a> to leave a comment.
                </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
                {comments.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No comments yet. Be the first!</p>
                ) : (
                    comments.map(comment => (
                        <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                                        {comment.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <span className="font-semibold block text-sm">{comment.username}</span>
                                        <span className="text-xs text-gray-500">
                                            {new Date(comment.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                {(user?.role === 'admin' || user?.id === comment.user_id) && (
                                    <button
                                        onClick={() => handleDelete(comment.id)}
                                        className="text-gray-400 hover:text-red-500"
                                        title="Delete comment"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                            <p className="text-gray-700 text-sm whitespace-pre-wrap pl-10">{comment.body}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
