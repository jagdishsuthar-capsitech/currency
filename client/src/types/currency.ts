export interface CurrencyInfo {
  code: string;
  name: string;
  countryCode: string;
}

export interface ExchangeRatesResponse {
  base: string;
  date: string;
  rates: Record<string, number>;
}
