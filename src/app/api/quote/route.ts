// src/app/api/quote/route.ts
import { NextResponse } from 'next/server';

// Our "Free GenAI" - a simple list of quotes
const quotes = [
    "The mind is everything. What you think you become. - Buddha",
    "The best way to predict the future is to create it. - Peter Drucker",
    "Simplicity is the ultimate sophistication. - Leonardo da Vinci",
    "Everything you can imagine is real. - Pablo Picasso",
    "Do one thing every day that scares you. - Eleanor Roosevelt",
    "Strive not to be a success, but rather to be of value. - Albert Einstein",
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Very little is needed to make a happy life; it is all within yourself, in your way of thinking. - Marcus Aurelius",
    "Be the change that you wish to see in the world. - Mahatma Gandhi",
    "Live as if you were to die tomorrow. Learn as if you were to live forever. - Mahatma Gandhi"
];

export async function GET() {
    // Select a random quote
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    // Return the quote as JSON
    // Add a small delay to simulate network latency (optional)
    await new Promise(resolve => setTimeout(resolve, 200)); 

    return NextResponse.json({ quote });
}

// Optional: Add configuration for edge runtime if preferred, 
// but default Node.js runtime is fine for this.
// export const runtime = 'edge';