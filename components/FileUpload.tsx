import React, { useState, useCallback } from 'react';
import { UploadIcon, SpinnerIcon } from './Icons';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`w-full max-w-2xl p-8 border-2 border-dashed rounded-xl transition-all duration-300 ${
          isDragging ? 'border-brand-primary bg-brand-primary/10' : 'border-brand-surface hover:border-brand-secondary'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <UploadIcon className="mx-auto h-12 w-12 text-brand-text-secondary" />
          <h3 className="mt-4 text-lg font-medium text-brand-text-primary">
            {isLoading ? 'Processing your file...' : 'Upload your data file'}
          </h3>
          <p className="mt-1 text-sm text-brand-text-secondary">
            Drag and drop a CSV or Excel file here, or click to select a file.
          </p>
          <div className="mt-6">
            {isLoading ? (
              <div className="flex justify-center items-center">
                <SpinnerIcon className="animate-spin h-8 w-8 text-brand-primary" />
              </div>
            ) : (
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-brand-primary focus-within:ring-offset-2 focus-within:ring-offset-brand-background"
              >
                <span>Select a file</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".csv, .xlsx, .xls" />
              </label>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;