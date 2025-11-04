import React, { useState, useCallback } from 'react';
import { summarizeClinicalNote } from './services/geminiService';
import type { ClinicalSummary } from './types';
import Header from './components/Header';
import NoteInput from './components/NoteInput';
import SummaryOutput from './components/SummaryOutput';

function App() {
  const [rawNote, setRawNote] = useState<string>('');
  const [summary, setSummary] = useState<ClinicalSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSummarize = useCallback(async () => {
    if (!rawNote.trim()) {
      setError('Please enter a clinical note to summarize.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setSummary(null);

    try {
      const result = await summarizeClinicalNote(rawNote);
      setSummary(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [rawNote]);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <NoteInput
            rawNote={rawNote}
            setRawNote={setRawNote}
            onSummarize={handleSummarize}
            isLoading={isLoading}
          />
          <SummaryOutput
            summary={summary}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
