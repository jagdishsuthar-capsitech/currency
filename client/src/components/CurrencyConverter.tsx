
import { useCallback, useState } from 'react';
import CurrencyInput from './CurrencyInput';
import CurrencyModal from './CurrencyModal';
import { useCurrency } from '../hooks/useCurrency';

function CurrencyConverter() {
    const { currencies, fromCurrency, toCurrency, fromAmount, toAmount, exchangeRate, rateDate, loading, error, setFromCurrency, setToCurrency, handleFromAmountChange, handleToAmountChange, handleSwap, } = useCurrency();

    const [selecting, setSelecting] = useState<'from' | 'to' | null>(null);

    const closeModal = useCallback(() => {
        setSelecting(null);
    }, []);

    const selectCurrency = useCallback(
        (currency: (typeof currencies)[number]) => {
            if (selecting === 'from') {
                setFromCurrency(currency);
            } else if (selecting === 'to') {
                setToCurrency(currency);
            }

            setSelecting(null);
        },
        [selecting, setFromCurrency, setToCurrency]
    );

    const canShowRate = exchangeRate !== null && !error;

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 sm:py-12">
            <div className="mx-auto max-w-2xl">
                {/* Header */}
                <header className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center  rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-6 w-6">
                                <path d="M4 8h15m0 0-4-4m4 4-4 4M20 16H5m0 0 4-4m-4 4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>

                        <div>
                            <h1 className="text-xl font-bold tracking-tight">
                                CurrencyFlow
                            </h1>
                            <p className="text-xs text-slate-500">
                                Simple currency conversion
                            </p>
                        </div>
                    </div>

                    <div className="hidden rounded-full border border-slate-200bg-white px-3 py-1.5 text-xs font-medium text-slate-500 sm:block">
                        Live rate lookup
                    </div>
                </header>

                {/* Intro */}
                <section className="mb-6">
                    <p className="mb-2 text-sm font-semibold text-blue-600">
                        CURRENCY CONVERTER
                    </p>

                    <h2 className="text-3xl font-bold tracking-tighttext-slate-900 sm:text-4xl">
                        Convert money,
                        <br className="sm:hidden" /> with confidence.
                    </h2>

                    <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
                        Choose your currencies, enter an amount, and see the
                        equivalent using the latest available reference rate.
                    </p>
                </section>

                {/* Main conversion card */}
                <section className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-xl shadow-slate-200/60 sm:p-7">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">
                                Convert currencies
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">
                                Edit either amount to convert.
                            </p>
                        </div>

                        <div className="rounded-xl bg-blue-50 px-3 py-2text-xs font-bold text-blue-700">
                            {fromCurrency.code} / {toCurrency.code}
                        </div>
                    </div>

                    {/* Source currency */}
                    <div className="rounded-2xl border border-slate-200bg-slate-50/70 p-4 transition-colorsfocus-within:border-blue-300 focus-within:bg-white sm:p-5">
                        <CurrencyInput
                            label="You send"
                            amount={fromAmount}
                            currency={fromCurrency}
                            onAmountChange={handleFromAmountChange}
                            onOpenModal={() => setSelecting('from')}
                        />
                    </div>

                    {/* Swap */}
                    <div className="relative z-10 flex items-center justify-center py-2">
                        <div className="h-px flex-1 bg-slate-100" />

                        <button
                            type="button"
                            onClick={handleSwap}
                            aria-label="Swap currencies"
                            title="Swap currencies"
                            className="group mx-3 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-white bg-blue-600 text-white shadow-lg shadow-blue-600/20 transition duration-200 hover:rotate-180 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        >
                            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
                                <path d="M7 7h13m0 0-4-4m4 4-4 4M17 17H4m0 0 4-4m-4 4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        <div className="h-px flex-1 bg-slate-100" />
                    </div>

                    {/* Target currency */}
                    <div className="rounded-2xl border border-blue-100  bg-blue-50/60 p-4 transition-colors  focus-within:border-blue-300 focus-within:bg-blue-50 sm:p-5">
                        <CurrencyInput
                            label="You receive"
                            amount={toAmount}
                            currency={toCurrency}
                            onAmountChange={handleToAmountChange}
                            onOpenModal={() => setSelecting('to')}
                        />
                    </div>

                    {/* Exchange-rate information */}
                    <div className="mt-5 rounded-2xl border border-slate-100bg-slate-50 p-4">
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center  justify-center rounded-xl bg-white text-blue-600  shadow-sm ring-1 ring-slate-100">
                                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
                                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
                                    <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                                </svg>
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium text-slate-500">
                                    Exchange rate
                                </p>

                                {loading ? (
                                    <div
                                        className="mt-2 flex items-center gap-2 text-sm   font-medium text-slate-500"
                                        role="status"
                                    >
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
                                        Updating exchange rate...
                                    </div>
                                ) : error ? (
                                    <p role="alert" className="mt-1 text-sm font-medium text-red-600">
                                        {error}
                                    </p>
                                ) : canShowRate ? (
                                    <>
                                        <p className="mt-1 wrap-break-words text-base font-bold text-slate-900 sm:text-lg">
                                            1 {fromCurrency.code} ={' '}
                                            {exchangeRate.toLocaleString('en-US', {
                                                maximumFractionDigits: 6,
                                            })}{' '}
                                            {toCurrency.code}
                                        </p>

                                        {exchangeRate > 0 && (
                                            <p className="mt-1 wrap-break-words text-xs text-slate-500">
                                                1 {toCurrency.code} ={' '}
                                                {(1 / exchangeRate).toLocaleString('en-US', {
                                                    maximumFractionDigits: 6,
                                                })}{' '}
                                                {fromCurrency.code}
                                            </p>
                                        )}

                                        {rateDate && (
                                            <p className="mt-2 text-xs text-slate-400">
                                                Reference date: {rateDate}
                                            </p>
                                        )}
                                    </>
                                ) : (
                                    <p className="mt-1 text-sm text-slate-500">
                                        Exchange rate unavailable.
                                    </p>
                                )}
                            </div>

                            <div className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${loading ? 'animate-pulse bg-amber-400' : error ? 'bg-red-500' : canShowRate ? 'bg-emerald-500' : 'bg-slate-300'}`} aria-hidden="true" />
                        </div>
                    </div>

                    <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                        Reference exchange rates are for informational purposes. Your bank or payment provider may use a different rate or charge additional fees.
                    </p>
                </section>

                {/* Footer */}
                <footer className="mt-6 text-center text-xs text-slate-400">
                    CurrencyFlow · Exchange rates provided by Frankfurter
                </footer>
            </div>

            {selecting !== null && (
                <CurrencyModal
                    currencies={currencies}
                    selectedCurrency={
                        selecting === 'from' ? fromCurrency : toCurrency
                    }
                    onSelect={selectCurrency}
                    onClose={closeModal}
                />
            )}
        </main>
    );
}

export default CurrencyConverter;
