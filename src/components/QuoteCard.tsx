// src/components/QuoteCard.tsx
'use client'; // This directive is necessary for using hooks like useState, useEffect

import { useState, useEffect } from 'react';

export default function QuoteCard() {
    const [quote, setQuote] = useState<string>('Loading your moment of zen...');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchQuote = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/quote'); // Fetch from our API route
            if (!response.ok) {
                throw new Error('Failed to fetch quote');
            }
            const data = await response.json();
            setQuote(data.quote);
        } catch (err) {
            console.error(err);
            setError('Could not load quote. Please try again.');
            setQuote(''); // Clear quote on error
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch quote on initial component mount
    useEffect(() => {
        fetchQuote();
    }, []); // Empty dependency array means this runs once on mount

    return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full text-center transition-all duration-300 ease-in-out">
            <div className="min-h-[100px] flex items-center justify-center mb-6"> 
                {isLoading ? (
                    <p className="text-gray-500 dark:text-gray-400 italic">Finding inspiration...</p>
                ) : error ? (
                    <p className="text-red-500 dark:text-red-400">{error}</p>
                ) : (
                    <blockquote className="text-xl font-medium text-gray-700 dark:text-gray-300">
                        "{quote}"
                    </blockquote>
                )}
            </div>
            <button
                onClick={fetchQuote}
                disabled={isLoading}
                className={`
                    px-6 py-2 rounded-md text-white font-semibold 
                    transition-all duration-200 ease-in-out
                    ${isLoading 
                        ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' 
                        : 'bg-blue-500 hover:bg-blue-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-indigo-500 focus:ring-opacity-50'
                    }
                `}
            >
                {isLoading ? 'Loading...' : 'Get New Quote'}
            </button>
        </div>
    );
}