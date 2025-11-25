
import React from 'react';
import { CubeIcon } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-brand-surface/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2 text-brand-text-primary">
                <CubeIcon />
                <span className="font-bold text-xl">ERP Data Analyzer</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
