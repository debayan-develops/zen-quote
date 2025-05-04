// src/app/api/quote/route.ts

import { NextResponse } from 'next/server';

// Define the external API URL for zenquotes.io
const EXTERNAL_QUOTE_API_URL = 'https://zenquotes.io/api/random';

// Fallback quote in case the external API fails
const FALLBACK_QUOTE = "The journey of a thousand miles begins with a single step. - Lao Tzu";

export async function GET() {
  try {
    // Fetch data from the external API (zenquotes.io)
    const response = await fetch(EXTERNAL_QUOTE_API_URL, {
      // Increased the timeout duration to 10 seconds
      signal: AbortSignal.timeout(10000), // 10 seconds timeout

      // Disable caching for this fetch request to always get a new quote
      cache: 'no-store'
    });

    // Check if the external API request was successful
    if (!response.ok) {
      console.error(`Error fetching quote from zenquotes.io: ${response.status} ${response.statusText}`);
      // Throw an error to be caught by the catch block
      throw new Error('Failed to fetch quote from external API');
    }

    // Parse the JSON response
    // zenquotes.io returns an array like [{"q":"Quote text","a":"Author Name"}]
    const data = await response.json();

    // Check if the response data is in the expected format and contains a quote
    if (!Array.isArray(data) || data.length === 0 || !data[0].q || !data[0].a) {
      console.error('External API response from zenquotes.io missing expected data');
      throw new Error('Invalid data received from external API');
    }

    // Extract the quote and author from the first object in the array
    const quoteContent = data[0].q;
    const quoteAuthor = data[0].a;

    // Format the quote string (content - author)
    const formattedQuote = `${quoteContent} - ${quoteAuthor}`;

    // Return the formatted quote to our frontend
    return NextResponse.json({ quote: formattedQuote });

  } catch (error) {
    console.error('Error in /api/quote:', error);

    // Return a fallback quote in case of any error
    return NextResponse.json({ quote: FALLBACK_QUOTE }, {
      status: 500, // Internal Server Error status code
      headers: {
        'Cache-Control': 'no-store', // Don't cache error responses
      },
    });
  }
}

// Force dynamic execution (prevents caching of the API route itself)
export const dynamic = 'force-dynamic';
