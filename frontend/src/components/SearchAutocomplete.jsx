import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2 } from 'lucide-react';
import api from '../api';

export default function SearchAutocomplete() {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const wrapperRef = useRef(null);

    // Debounce logic
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim().length > 0) {
                setLoading(true);
                try {
                    const response = await api.get(`/search/suggestions?q=${encodeURIComponent(query)}`);
                    setSuggestions(response.data);
                    setIsOpen(true);
                } catch (err) {
                    console.error('Suggestion fetch error', err);
                } finally {
                    setLoading(false);
                }
            } else {
                setSuggestions([]);
                setIsOpen(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/articles?q=${encodeURIComponent(query)}`);
            setIsOpen(false);
        }
    };

    const handleSelect = (articleId) => {
        navigate(`/articles/${articleId}`);
        setIsOpen(false);
        setQuery('');
    };

    return (
        <div ref={wrapperRef} className="relative w-full max-w-md hidden md:block">
            <form onSubmit={handleSearch} className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.trim().length > 0 && setIsOpen(true)}
                    placeholder="Search articles..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border-2 border-transparent focus:border-black rounded-lg text-sm font-medium transition-all outline-none focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </form>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden z-50">
                    {loading ? (
                        <div className="p-4 flex justify-center text-gray-500">
                            <Loader2 className="w-4 h-4 animate-spin" />
                        </div>
                    ) : suggestions.length > 0 ? (
                        <ul>
                            {suggestions.map((suggestion) => (
                                <li key={suggestion.id}>
                                    <button
                                        onClick={() => handleSelect(suggestion.id)}
                                        className="w-full text-left px-4 py-3 hover:bg-yellow-100 transition-colors border-b border-gray-100 last:border-0"
                                    >
                                        <div className="font-bold text-sm text-black truncate">
                                            {suggestion.title}
                                        </div>
                                    </button>
                                </li>
                            ))}
                            <li className="p-2 border-t-2 border-black bg-gray-50">
                                <button 
                                    onClick={handleSearch}
                                    className="w-full text-center text-xs font-bold text-blue-600 hover:underline uppercase"
                                >
                                    View all results for "{query}"
                                </button>
                            </li>
                        </ul>
                    ) : (
                        <div className="p-4 text-center text-gray-500 text-sm font-bold italic">
                            No matches found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
