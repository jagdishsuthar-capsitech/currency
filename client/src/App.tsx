import { useState } from 'react';
import { useCurrency } from './hooks/useCurrency';
import CurrencyInput from './components/CurrencyInput';
import CurrencyModal from './components/CurrencyModal';
import type { CurrencyInfo } from './types/currency';

function App() {
  const { fromCurrency, setFromCurrency, toCurrency, setToCurrency, fromAmount, toAmount, exchangeRate, loading, error, handleFromAmountChange, handleToAmountChange, handleSwap, } = useCurrency();

  const [modalType, setModalType] = useState<'from' | 'to' | null>(null);

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-100 p-4 font-sans">
      <div className="w-full max-w-2xl p-8 rounded-3xl bg-white shadow-xl border border-slate-200/60">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-6">
          Currency Converter
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center">
            Error: {error}
          </div>
        )}

        <div className="flex flex-col md:flex-row items-center gap-4">
          <CurrencyInput
            label="From"
            amount={fromAmount}
            currency={fromCurrency}
            onAmountChange={handleFromAmountChange}
            onOpenModal={() => setModalType('from')}
          />

          <button
            onClick={handleSwap}
            className="p-3.5 text-xl rounded-full border-2 border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all cursor-pointer shadow-sm md:mt-5"
            title="Swap Currencies"
          >
            ⇆
          </button>

          <CurrencyInput
            label="To"
            amount={toAmount}
            currency={toCurrency}
            onAmountChange={handleToAmountChange}
            onOpenModal={() => setModalType('to')}
          />
        </div>

        <div className="mt-6 text-center text-sm font-medium text-slate-600 py-3.5 px-4 bg-slate-50 rounded-xl border border-slate-200/60">
          {loading ? (
            <span className="animate-pulse">Updating live rates...</span>
          ) : (
            <span>
              1 {fromCurrency.code} = <strong className="text-slate-900">{exchangeRate}</strong> {toCurrency.code}
            </span>
          )}
        </div>
      </div>

      {modalType && (
        <CurrencyModal
          onClose={() => setModalType(null)}
          onSelect={(selected: CurrencyInfo) => {
            if (modalType === 'from') setFromCurrency(selected);
            else setToCurrency(selected);
            setModalType(null);
          }}
        />
      )}
    </div>
  );
}

export default App;