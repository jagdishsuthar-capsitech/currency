import { useState, useEffect } from 'react';
import type { CurrencyInfo } from '../types/currency';
import { fetchLatestRates } from '../api/currencyService';

export const POPULAR_CURRENCIES: CurrencyInfo[] = [
    { code: 'USD', name: 'United States Dollar', countryCode: 'us' },
    { code: 'INR', name: 'Indian Rupee', countryCode: 'in' },
    { code: 'EUR', name: 'Euro', countryCode: 'eu' },
    { code: 'GBP', name: 'British Pound', countryCode: 'gb' },
    { code: 'CAD', name: 'Canadian Dollar', countryCode: 'ca' },

    { code: 'AUD', name: 'Australian Dollar', countryCode: 'au' },
    { code: 'JPY', name: 'Japanese Yen', countryCode: 'jp' },
    { code: 'CNY', name: 'Chinese Yuan', countryCode: 'cn' },
    { code: 'CHF', name: 'Swiss Franc', countryCode: 'ch' },
    { code: 'NZD', name: 'New Zealand Dollar', countryCode: 'nz' },
    { code: 'HKD', name: 'Hong Kong Dollar', countryCode: 'hk' },
    { code: 'SGD', name: 'Singapore Dollar', countryCode: 'sg' },
    { code: 'SEK', name: 'Swedish Krona', countryCode: 'se' },
    { code: 'KRW', name: 'South Korean Won', countryCode: 'kr' },
    { code: 'MXN', name: 'Mexican Peso', countryCode: 'mx' },
    { code: 'BRL', name: 'Brazilian Real', countryCode: 'br' },
    { code: 'ZAR', name: 'South African Rand', countryCode: 'za' },
    { code: 'AED', name: 'United Arab Emirates Dirham', countryCode: 'ae' },
    { code: 'SAR', name: 'Saudi Riyal', countryCode: 'sa' },
    { code: 'NOK', name: 'Norwegian Krone', countryCode: 'no' },
    { code: 'DKK', name: 'Danish Krone', countryCode: 'dk' }
];

export function useCurrency() {
    const [fromCurrency, setFromCurrency] = useState<CurrencyInfo>(POPULAR_CURRENCIES[0]);
    const [toCurrency, setToCurrency] = useState<CurrencyInfo>(POPULAR_CURRENCIES[1]);

    const [fromAmount, setFromAmount] = useState<number | string>(1);
    const [toAmount, setToAmount] = useState<number | string>('');

    const [exchangeRate, setExchangeRate] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

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
        fromCurrency, setFromCurrency, toCurrency, setToCurrency,
        fromAmount, toAmount, exchangeRate, loading, error,
        handleFromAmountChange, handleToAmountChange, handleSwap,
    };
}