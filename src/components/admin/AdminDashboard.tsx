import React from 'react';
import { ExamPaperUpload } from './ExamPaperUpload';

export function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
      
      <div className="grid gap-8 grid-cols-1">
        <ExamPaperUpload />
      </div>
    </div>
  );
}