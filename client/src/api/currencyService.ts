import type { ExchangeRatesResponse } from "../types/currency";

const BASE_URL = 'https://api.frankfurter.dev/v1';

export async function fetchLatestRates(baseCurrency: string): Promise<ExchangeRatesResponse> {
  const response = await fetch(`${BASE_URL}/latest?base=${baseCurrency}`);
  if (!response.ok) {
    throw new Error('Failed to fetch exchange rates');
  }
  return response.json();
}

// Add this function to get all available currencies
export async function fetchCurrencies(): Promise<Record<string, string>> {
  const response = await fetch(`${BASE_URL}/currencies`);
  if (!response.ok) {
    throw new Error('Failed to fetch currencies');
  }
  return response.json();
}