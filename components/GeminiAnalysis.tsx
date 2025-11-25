import React, { useState } from 'react';
import { SpinnerIcon, LightBulbIcon } from './Icons';

interface GeminiAnalysisProps {
  onAnalyze: (prompt: string) => void;
  isLoading: boolean;
  response: string | null;
}

const samplePrompts = [
    "Summarize this dataset in 3 key points.",
    "What are the most interesting patterns or outliers?",
    "Calculate the average of the most relevant numerical column.",
    "Suggest a good chart to visualize this data."
];

const GeminiAnalysis: React.FC<GeminiAnalysisProps> = ({ onAnalyze, isLoading, response }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onAnalyze(prompt);
    }
  };
  
  const handleSamplePromptClick = (sample: string) => {
    setPrompt(sample);
    onAnalyze(sample);
  };

  return (
    <div className="bg-brand-surface rounded-xl shadow-lg p-6 sticky top-8">
      <h3 className="text-xl font-semibold mb-4 text-brand-text-primary">AI Analysis</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="prompt" className="block text-sm font-medium text-brand-text-secondary mb-2">
            Your Question
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-brand-text-primary focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition"
            placeholder="e.g., 'What is the total sales amount?'"
          />
        </div>
        <div className="mb-4">
             <p className="text-xs text-brand-text-secondary mb-2">Or try a suggestion:</p>
             <div className="flex flex-wrap gap-2">
                {samplePrompts.map((p, i) => (
                    <button type="button" key={i} onClick={() => handleSamplePromptClick(p)} className="text-xs bg-slate-700 hover:bg-slate-600 rounded-full px-3 py-1 transition-colors">
                        {p}
                    </button>
                ))}
             </div>
        </div>
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="w-full bg-brand-primary text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-sky-600"
        >
          {isLoading ? (
            <>
              <SpinnerIcon className="animate-spin h-5 w-5 mr-3" />
              Analyzing...
            </>
          ) : (
            'Generate Insights'
          )}
        </button>
      </form>
      <div className="mt-6">
        <h4 className="font-semibold text-brand-text-primary mb-2">Analysis Result</h4>
        <div className="prose prose-invert prose-sm max-w-none bg-slate-900/50 border border-slate-700 rounded-lg p-4 min-h-[150px] text-brand-text-secondary">
          {isLoading ? (
             <div className="flex items-center justify-center h-full">
                <p>Generating insights with Gemini...</p>
             </div>
          ) : response ? (
            <div dangerouslySetInnerHTML={{ __html: response.replace(/\n/g, '<br />') }} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <LightBulbIcon className="h-8 w-8 text-yellow-400 mb-2"/>
                <p>Your data analysis will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeminiAnalysis;