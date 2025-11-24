import React from 'react';

export default function StatsCard({ title, subtitle, value }) {
  return (
    <div className="bg-white rounded-xl2 border border-gray-100 p-5 shadow-sm w-full max-w-xs">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-xs text-gray-400 mb-4">{subtitle}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
}
