
import { useCallback, useEffect, useState } from 'react';
import type { CurrencyInfo } from '../types/currency';
import { fetchLatestRates, fetchCurrencies } from '../api/currencyService';
import { currencyMetadata } from '../utils/currencyMetadata';

const initialFrom: CurrencyInfo = {
    code: 'USD',
    name: 'United States Dollar',
    countryCode: 'us',
};

const initialTo: CurrencyInfo = {
    code: 'INR',
    name: 'Indian Rupee',
    countryCode: 'in',
};

export function useCurrency() {
    const [currencies, setCurrencies] = useState<CurrencyInfo[]>([]);
    const [fromCurrency, setFromCurrency] =
        useState<CurrencyInfo>(initialFrom);
    const [toCurrency, setToCurrency] =
        useState<CurrencyInfo>(initialTo);

    const [fromAmount, setFromAmount] = useState('1');
    const [toAmount, setToAmount] = useState('');
    const [lastEdited, setLastEdited] = useState<'from' | 'to'>('from');

    const [exchangeRate, setExchangeRate] = useState<number | null>(null);
    const [rateDate, setRateDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load supported currencies.
    useEffect(() => {
        const controller = new AbortController();

        async function loadCurrencies() {
            try {
                const data = await fetchCurrencies(controller.signal);

                const formatted: CurrencyInfo[] = Object.entries(data)
                    .map(([code, name]) => ({
                        code,
                        name,
                        countryCode: currencyMetadata[code] ?? '',
                    }))
                    .sort((a, b) => a.code.localeCompare(b.code));

                setCurrencies(formatted);
            } catch (err) {
                if (!controller.signal.aborted) {
                    console.error('Failed to load currencies', err);
                }
            }
        }

        void loadCurrencies();

        return () => controller.abort();
    }, []);

    // Load rates only when the selected currency pair changes.
    useEffect(() => {
        const controller = new AbortController();

        async function loadRates() {
            setLoading(true);
            setError(null);
            setExchangeRate(null);
            setRateDate('');

            if (fromCurrency.code === toCurrency.code) {
                setExchangeRate(1);
                setRateDate(new Date().toISOString().slice(0, 10));
                setLoading(false);
                return;
            }

            try {
                const data = await fetchLatestRates(
                    fromCurrency.code,
                    controller.signal
                );

                const rate = data.rates[toCurrency.code];

                if (!Number.isFinite(rate) || rate <= 0) {
                    throw new Error('Exchange rate unavailable for this pair.');
                }

                setExchangeRate(rate);
                setRateDate(data.date);
            } catch (err) {
                if (!controller.signal.aborted) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : 'Unable to load exchange rates.'
                    );
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        void loadRates();

        return () => controller.abort();
    }, [fromCurrency.code, toCurrency.code]);

    // Recalculate the opposite amount when the rate changes.
    useEffect(() => {
        if (exchangeRate === null) return;

        const value = lastEdited === 'from' ? fromAmount : toAmount;

        if (value.trim() === '' || !Number.isFinite(Number(value))) {
            if (lastEdited === 'from') setToAmount('');
            else setFromAmount('');
            return;
        }

        if (lastEdited === 'from') {
            setToAmount((Number(value) * exchangeRate).toFixed(2));
        } else {
            setFromAmount(
                exchangeRate === 0
                    ? ''
                    : (Number(value) / exchangeRate).toFixed(2)
            );
        }
    }, [exchangeRate, fromAmount, toAmount, lastEdited]);

    const handleFromAmountChange = useCallback((value: string) => {
        setLastEdited('from');
        setFromAmount(value);
    }, []);

    const handleToAmountChange = useCallback((value: string) => {
        setLastEdited('to');
        setToAmount(value);
    }, []);

    const handleSwap = useCallback(() => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);

        // Preserve the amounts, then recalculate using the new rate.
        setFromAmount(toAmount);
        setToAmount(fromAmount);
        setLastEdited('from');
    }, [fromCurrency, toCurrency, fromAmount, toAmount]);

    const handleSelectFrom = useCallback((currency: CurrencyInfo) => {
        setFromCurrency(currency);
    }, []);

    const handleSelectTo = useCallback((currency: CurrencyInfo) => {
        setToCurrency(currency);
    }, []);

    return {
        currencies, fromCurrency, toCurrency, fromAmount, toAmount, exchangeRate, rateDate, loading, error,
        setFromCurrency: handleSelectFrom,
        setToCurrency: handleSelectTo, handleFromAmountChange, handleToAmountChange, handleSwap,
    };
}