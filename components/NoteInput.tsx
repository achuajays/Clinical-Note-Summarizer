import React from 'react';

interface NoteInputProps {
  rawNote: string;
  setRawNote: (note: string) => void;
  onSummarize: () => void;
  isLoading: boolean;
}

const NoteInput: React.FC<NoteInputProps> = ({ rawNote, setRawNote, onSummarize, isLoading }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col h-full">
      <h2 className="text-xl font-semibold text-slate-700 mb-4">Unstructured Clinical Note</h2>
      <textarea
        className="w-full flex-grow p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow duration-200 resize-none text-sm leading-6"
        placeholder="Paste or type the clinical note here..."
        value={rawNote}
        onChange={(e) => setRawNote(e.target.value)}
        disabled={isLoading}
      />
      <button
        onClick={onSummarize}
        disabled={isLoading}
        className="mt-4 w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          'Summarize Note'
        )}
      </button>
    </div>
  );
};

export default NoteInput;
