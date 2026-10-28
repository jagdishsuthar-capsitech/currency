import { useState } from 'react';
import type { CurrencyInfo } from '../types/currency';

interface CurrencyModalProps {
  currencies: CurrencyInfo[];
  onSelect: (currency: CurrencyInfo) => void;
  onClose: () => void;
}

function CurrencyModal({ currencies, onSelect, onClose }: CurrencyModalProps) {
  const [query, setQuery] = useState('');

  const filtered = currencies.filter(
    (c) => c.code.toLowerCase().includes(query.toLowerCase()) || c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-2xl w-full max-w-sm max-h-[85vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold text-slate-800">Select Currency</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-lg font-bold cursor-pointer p-1"
          >
            X
          </button>
        </div>
        <input
          type="text"
          placeholder="Search country or currency..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full py-2.5 px-3.5 rounded-lg border border-slate-300 outline-none focus:border-blue-500 mb-3 text-sm"
          autoFocus
        />
        <div className="overflow-y-auto max-h-75 space-y-1 pr-1">
          {filtered.map((c) => (
            <div
              key={c.code}
              onClick={() => onSelect(c)}
              className="flex items-center gap-3 p-2.5 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
            >
              <img
                src={`https://flagcdn.com/w40/${c.countryCode}.png`}
                alt={c.code}
                className="w-6 h-4 rounded-sm object-cover shadow-xs"
              />
              <span className="text-sm">
                <strong className="text-slate-900">{c.code}</strong> -{' '}
                <span className="text-slate-500">{c.name}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CurrencyModal;