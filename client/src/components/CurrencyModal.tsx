
import { useEffect, useRef, useState } from 'react';
import type { CurrencyInfo } from '../types/currency';

interface CurrencyModalProps {
  currencies: CurrencyInfo[];
  selectedCurrency: CurrencyInfo;
  onSelect: (currency: CurrencyInfo) => void;
  onClose: () => void;
}

function CurrencyModal({
  currencies,
  selectedCurrency,
  onSelect,
  onClose,
}: CurrencyModalProps) {
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const filtered = currencies.filter((currency) => {
    const search = query.trim().toLowerCase();

    return (
      currency.code.toLowerCase().includes(search) ||
      currency.name.toLowerCase().includes(search)
    );
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
        bg-slate-950/40 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="currency-modal-title"
        className="flex max-h-[85vh] w-full max-w-md flex-col
          overflow-hidden rounded-3xl bg-white shadow-2xl
          animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between border-b
          border-slate-100 px-5 py-4">
          <div>
            <h2
              id="currency-modal-title"
              className="text-lg font-bold text-slate-900"
            >
              Select currency
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Choose from available currencies
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close currency selector"
            className="flex h-9 w-9 items-center justify-center
              rounded-full text-xl text-slate-400
              transition hover:bg-slate-100 hover:text-slate-700"
          >
            &times;
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-2 rounded-xl
            border border-slate-200 bg-slate-50 px-3
            transition focus-within:border-blue-400
            focus-within:bg-white">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className="h-5 w-5 shrink-0 text-slate-400"
            >
              <circle
                cx="10.8"
                cy="10.8"
                r="6.8"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="m16 16 4 4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>

            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search currency or code..."
              aria-label="Search currencies"
              className="w-full bg-transparent py-3 text-sm
                text-slate-800 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3">
          {filtered.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <p className="font-medium text-slate-700">
                No currencies found
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Try another name or currency code.
              </p>
            </div>
          ) : (
            filtered.map((currency) => {
              const selected =
                currency.code === selectedCurrency.code;

              return (
                <button
                  key={currency.code}
                  type="button"
                  onClick={() => onSelect(currency)}
                  aria-pressed={selected}
                  className={`flex w-full items-center gap-3
                    rounded-xl px-3 py-3 text-left transition
                    ${
                      selected
                        ? 'bg-blue-50 ring-1 ring-blue-200'
                        : 'hover:bg-slate-50'
                    }`}
                >
                  <div className="flex h-10 w-10 shrink-0
                    items-center justify-center rounded-xl
                    bg-slate-100 text-xs font-bold text-slate-600">
                    {currency.countryCode ? (
                      <img
                        src={`https://flagcdn.com/w40/${currency.countryCode}.png`}
                        alt=""
                        aria-hidden="true"
                        className="h-5 w-7 rounded-sm object-cover"
                      />
                    ) : (
                      currency.code.slice(0, 2)
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900">
                      {currency.code}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {currency.name}
                    </p>
                  </div>

                  {selected && (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                      className="h-5 w-5 text-blue-600"
                    >
                      <path
                        d="m5 12 4 4L19 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}

export default CurrencyModal;
