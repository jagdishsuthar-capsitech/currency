import { useState, useEffect } from 'react';
import type { CurrencyInfo } from '../types/currency';
import { fetchLatestRates, fetchCurrencies } from '../api/currencyService';

export function useCurrency() {
    const [currencies, setCurrencies] = useState<CurrencyInfo[]>([]);
    const [fromCurrency, setFromCurrency] = useState<CurrencyInfo>({ code: 'USD', name: 'United States Dollar', countryCode: 'us' });
    const [toCurrency, setToCurrency] = useState<CurrencyInfo>({ code: 'INR', name: 'Indian Rupee', countryCode: 'in' });

    const [fromAmount, setFromAmount] = useState<number | string>(1);
    const [toAmount, setToAmount] = useState<number | string>('');

    const [exchangeRate, setExchangeRate] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    
    useEffect(() => {
        const getCurrencies = async () => {
            try {
                const data = await fetchCurrencies();
                const formatted: CurrencyInfo[] = Object.entries(data).map(([code, name]) => ({
                    code,
                    name,
                    countryCode: code.slice(0, 2).toLowerCase(),
                }));
                setCurrencies(formatted);
            } catch (err) {
                console.error('Failed to load currency list', err);
            }
        };
        getCurrencies();
    }, []);


    useEffect(() => {
        let isMounted = true;
        const getRates = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchLatestRates(fromCurrency.code);
                if (isMounted) {
                    const rate = fromCurrency.code === toCurrency.code ? 1 : data.rates[toCurrency.code] || 1;
                    setExchangeRate(rate);
                    if (typeof fromAmount === 'number') {
                        setToAmount((fromAmount * rate).toFixed(2));
                    }
                }
            } catch (err: any) {
                if (isMounted) setError(err.message || 'Something went wrong');
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        getRates();
        return () => { isMounted = false; };
    }, [fromCurrency, toCurrency]);

    const handleFromAmountChange = (val: string) => {
        setFromAmount(val);
        if (val === '' || isNaN(Number(val))) {
            setToAmount('');
        } else {
            setToAmount((Number(val) * exchangeRate).toFixed(2));
        }
    };

    const handleToAmountChange = (val: string) => {
        setToAmount(val);
        if (val === '' || isNaN(Number(val))) {
            setFromAmount('');
        } else {
            setFromAmount((Number(val) / exchangeRate).toFixed(2));
        }
    };

    const handleSwap = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
        setFromAmount(toAmount);
        setToAmount(fromAmount);
    };

    return {
        currencies,
        fromCurrency, setFromCurrency, toCurrency, setToCurrency,
        fromAmount, toAmount, exchangeRate, loading, error,
        handleFromAmountChange, handleToAmountChange, handleSwap,
    };
}