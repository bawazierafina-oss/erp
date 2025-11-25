import React, { useState, useCallback } from 'react';
import { DataRow } from './types';
import { analyzeDataWithGemini } from './services/geminiService';
import FileUpload from './components/FileUpload';
import DataTable from './components/DataTable';
import DataVisualization from './components/DataVisualization';
import GeminiAnalysis from './components/GeminiAnalysis';
import { Header } from './components/Header';
import { SparklesIcon, TableIcon, ChartBarIcon } from './components/Icons';

declare const Papa: any;
declare const XLSX: any;

type View = 'table' | 'chart';

interface SheetData {
  name: string;
  headers: string[];
  data: DataRow[];
}

const App: React.FC = () => {
  const [sheetsData, setSheetsData] = useState<SheetData[] | null>(null);
  const [activeSheetIndex, setActiveSheetIndex] = useState<number>(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [geminiResponse, setGeminiResponse] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<View>('table');

  const handleFileSelect = useCallback((file: File) => {
    if (!file) return;

    const isCsv = file.name.toLowerCase().endsWith('.csv');
    const isExcel = file.name.toLowerCase().endsWith('.xlsx') || file.name.toLowerCase().endsWith('.xls');

    if (!isCsv && !isExcel) {
      setError('Invalid file type. Please upload a CSV or Excel file.');
      return;
    }

    setIsParsing(true);
    setError(null);
    setSheetsData(null);
    setActiveSheetIndex(0);
    setFileName(null);
    setGeminiResponse(null);
    setActiveView('table');

    if (isCsv) {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
          complete: (results: any) => {
            if (results.errors.length > 0) {
              setError(`Error parsing CSV: ${results.errors[0].message}`);
              setIsParsing(false);
              return;
            }
            const sheetName = file.name.replace(/\.[^/.]+$/, "") || 'data';
            const sheet: SheetData = {
              name: sheetName,
              headers: results.meta.fields || [],
              data: results.data
            };
            setFileName(file.name);
            setSheetsData([sheet]);
            setIsParsing(false);
          },
          error: (err: Error) => {
            setError(`Error parsing file: ${err.message}`);
            setIsParsing(false);
          },
        });
    } else if (isExcel) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const fileData = e.target?.result;
                const workbook = XLSX.read(fileData, { type: 'array' });
                
                const allSheets: SheetData[] = workbook.SheetNames.map(sheetName => {
                    const worksheet = workbook.Sheets[sheetName];
                    const jsonData: DataRow[] = XLSX.utils.sheet_to_json(worksheet);
                    
                    if (jsonData.length === 0) {
                        return { name: sheetName, headers: [], data: [] };
                    }
                    const fileHeaders = Object.keys(jsonData[0]);
                    return { name: sheetName, headers: fileHeaders, data: jsonData };
                });

                const validSheets = allSheets.filter(sheet => sheet.data.length > 0);

                if (validSheets.length === 0) {
                    setError('The Excel file is empty or contains no data in any of its sheets.');
                    setIsParsing(false);
                    return;
                }

                setFileName(file.name);
                setSheetsData(validSheets);
                setActiveSheetIndex(0);
            } catch (err) {
                setError(`Error parsing Excel file: ${err instanceof Error ? err.message : 'An unknown error occurred'}`);
            } finally {
                setIsParsing(false);
            }
        };
        reader.onerror = () => {
            setError('Error reading file.');
            setIsParsing(false);
        };
        reader.readAsArrayBuffer(file);
    }
  }, []);

  const handleAnalysisRequest = async (prompt: string) => {
    const activeSheet = sheetsData ? sheetsData[activeSheetIndex] : null;
    if (!activeSheet || !activeSheet.data) {
      setError('No data available to analyze.');
      return;
    }
    setIsAnalyzing(true);
    setError(null);
    setGeminiResponse(null);
    try {
      const response = await analyzeDataWithGemini(activeSheet.data, prompt);
      setGeminiResponse(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetState = () => {
    setSheetsData(null);
    setActiveSheetIndex(0);
    setFileName(null);
    setError(null);
    setGeminiResponse(null);
  };

  const renderTabs = () => (
    <div className="mb-6 border-b border-slate-700">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            <button
                onClick={() => setActiveView('table')}
                className={`${
                    activeView === 'table'
                        ? 'border-brand-primary text-brand-primary'
                        : 'border-transparent text-brand-text-secondary hover:text-brand-text-primary hover:border-gray-500'
                } flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
                <TableIcon />
                Data Preview
            </button>
            <button
                onClick={() => setActiveView('chart')}
                className={`${
                    activeView === 'chart'
                        ? 'border-brand-primary text-brand-primary'
                        : 'border-transparent text-brand-text-secondary hover:text-brand-text-primary hover:border-gray-500'
                } flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
                <ChartBarIcon />
                Visualization
            </button>
        </nav>
    </div>
  );
  
  const activeSheet = sheetsData ? sheetsData[activeSheetIndex] : null;

  return (
    <div className="min-h-screen bg-brand-background text-brand-text-primary font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {!sheetsData && <FileUpload onFileSelect={handleFileSelect} isLoading={isParsing} />}
        {sheetsData && activeSheet && (
          <div>
            <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold text-brand-text-primary flex items-center gap-2">
                  <SparklesIcon /> AI-Powered Analysis
                </h2>
                <p className="text-brand-text-secondary">Ask anything about your data from <span className="font-semibold text-brand-text-primary">{fileName}</span></p>
                {sheetsData.length > 1 && (
                  <div className="mt-4">
                    <label htmlFor="sheet-select" className="block text-sm font-medium text-brand-text-secondary mb-1">
                      Current Sheet
                    </label>
                    <select
                      id="sheet-select"
                      value={activeSheetIndex}
                      onChange={(e) => {
                        setActiveSheetIndex(Number(e.target.value));
                        setActiveView('table'); // Reset to table view on sheet change
                      }}
                      className="bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-brand-text-primary focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition"
                    >
                      {sheetsData.map((sheet, index) => (
                        <option key={`${sheet.name}-${index}`} value={index}>
                          {sheet.name} ({sheet.data.length} rows)
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <button
                onClick={resetState}
                className="bg-brand-secondary hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
              >
                Upload New File
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3">
                {renderTabs()}
                {activeView === 'table' && <DataTable headers={activeSheet.headers} data={activeSheet.data} />}
                {activeView === 'chart' && <DataVisualization headers={activeSheet.headers} data={activeSheet.data} />}
              </div>
              <div className="lg:col-span-2">
                <GeminiAnalysis onAnalyze={handleAnalysisRequest} isLoading={isAnalyzing} response={geminiResponse} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
