// src/components/QuoteCard.tsx
'use client'; // This directive is necessary for using hooks like useState, useEffect

import { useState, useEffect } from 'react';

// Define a delay duration (in milliseconds) to prevent rapid clicks
const FETCH_DELAY_MS = 3000; // 3 seconds delay

export default function QuoteCard() {
  const [quote, setQuote] = useState<string>('Loading your moment of zen...');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // State to track if the button is temporarily disabled after a fetch
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);


  const fetchQuote = async () => {
    setIsLoading(true); // Show loading state
    setIsButtonDisabled(true); // Disable button immediately
    setError(null); // Clear previous errors

    try {
      const response = await fetch('/api/quote'); // Fetch from our API route

      // Always try to parse the JSON response, even if response.ok is false,
      // because our backend sends a fallback quote in the body on error.
      const data = await response.json();

      if (!response.ok) {
        // If the response status is not OK (e.g., 500 from our backend)
        if (data && data.quote) {
          // If the response body contains a quote (our fallback)
          setQuote(data.quote); // Use the fallback quote
          // Optional: Set an error message to indicate it's a fallback
          setError('Note: Could not fetch a new quote, showing fallback.');
        } else {
          // If the response is not OK and doesn't contain a fallback quote
          throw new Error('Failed to fetch quote and no fallback available.');
        }
      } else {
        // If the response status is OK (successful fetch from external API)
        if (data && data.quote) {
          setQuote(data.quote); // Use the fetched quote
          setError(null); // Clear any previous error message
        } else {
          // If the response is OK but the data is missing content (unlikely with our backend)
          throw new Error('Successfully fetched, but received invalid data.');
        }
      }

    } catch (err: unknown) { // FIX: Changed 'any' to 'unknown' to satisfy TypeScript/ESLint rules
      console.error("Frontend fetch error:", err);
      // Display a generic error message if something unexpected goes wrong
      // We can't directly access err.message here without a type check,
      // but we are setting a static error message anyway.
      setError('An error occurred while fetching the quote. Please try again.');
      setQuote(""); // Clear the quote on a hard error
    } finally {
      setIsLoading(false); // Hide loading state

      // Re-enable the button after a delay, regardless of success or failure
      setTimeout(() => {
        setIsButtonDisabled(false);
      }, FETCH_DELAY_MS); // Use the defined delay
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
          // Display the error message (including the fallback note if applicable)
          <p className={error.startsWith('Note:') ? "text-yellow-600 dark:text-yellow-400" : "text-red-500 dark:text-red-400"}>{error}</p>
        ) : (
          <blockquote className="text-xl font-medium text-gray-700 dark:text-gray-300">
            {quote}
          </blockquote>
        )}
      </div>

      <button
        onClick={fetchQuote}
        // Disable the button if isLoading is true OR if isButtonDisabled is true
        disabled={isLoading || isButtonDisabled}
        className={`
          px-6 py-2 rounded-md text-white font-semibold
          transition-all duration-200 ease-in-out
          ${isLoading || isButtonDisabled // Apply disabled styles if either state is true
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
