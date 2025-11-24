import React from 'react';

export default function ConfirmModal({ title = 'Confirm', message = '', onConfirm, onCancel, confirmText='Delete' }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96 text-center">
        <h3 className="text-xl font-medium mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex flex-col gap-3">
          <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded">{confirmText}</button>
          <button onClick={onCancel} className="px-4 py-2 bg-black text-white rounded">Cancel</button>
        </div>
      </div>
    </div>
  );
}
