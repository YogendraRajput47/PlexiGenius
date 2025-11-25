import React, { useState, useEffect } from 'react';
import debounce from 'lodash.debounce';

export default function Topbar({ onSearch }) {
  const [q, setQ] = useState('');
  const trigger = debounce((v) => onSearch && onSearch(v), 300);

  useEffect(()=> { trigger(q); return ()=> trigger.cancel(); }, [q]);

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100">
      <div className="flex-1">
        <div className="relative max-w-xl">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search"
            className="w-full border border-gray-200 rounded-lg px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</div>
        </div>
      </div>

      <div className="flex items-center gap-3 ml-4">
        <div className="px-3 py-2 bg-gray-50 rounded text-sm text-gray-700">Admin</div>
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">AD</div>
      </div>
    </div>
  );
}
