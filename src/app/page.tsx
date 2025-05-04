// src/app/page.tsx
import QuoteCard from '@/components/QuoteCard'; // Using the alias @

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-200">
        ZenQuote
      </h1>
      <QuoteCard /> 
    </main>
  );
}