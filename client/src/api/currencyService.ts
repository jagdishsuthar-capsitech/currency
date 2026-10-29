
import type { ExchangeRatesResponse } from '../types/currency';

const BASE_URL = 'https://api.frankfurter.dev/v1';

export async function fetchLatestRates(
  baseCurrency: string,
  signal?: AbortSignal
): Promise<ExchangeRatesResponse> {
  const response = await fetch(
    `${BASE_URL}/latest?base=${encodeURIComponent(baseCurrency)}`,
    { signal }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch exchange rates.');
  }

  return response.json() as Promise<ExchangeRatesResponse>;
}

export async function fetchCurrencies(
  signal?: AbortSignal
): Promise<Record<string, string>> {
  const response = await fetch(`${BASE_URL}/currencies`, {
    signal,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch currencies.');
  }

  return response.json() as Promise<Record<string, string>>;
}
