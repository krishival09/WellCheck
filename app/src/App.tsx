import React from 'react';
import { AppProvider } from './context/AppContext';
import { MobileApp } from './mobile/MobileApp';

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-[#FAF7F2] dark:bg-slate-900 flex justify-center">
        <div className="w-full max-w-md min-h-screen flex flex-col shadow-2xl relative bg-[#FAF7F2] dark:bg-slate-900">
          <MobileApp />
        </div>
      </div>
    </AppProvider>
  );
}